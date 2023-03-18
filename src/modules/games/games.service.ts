import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackersService } from '../trackers/trackers.service';
import { firstValueFrom, map } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { Map } from './entities/map.entity';
import { Mode } from './entities/mode.entity';
import { FightersService } from './fighters.service';
import { Fighter } from './entities/fighter.entity';

@Injectable()
export class GamesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly trackerService: TrackersService,
    private readonly fighterService: FightersService,

    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,

    @InjectRepository(Map)
    private mapsRepository: Repository<Map>,

    @InjectRepository(Mode)
    private modesRepository: Repository<Mode>,
  ) {}

  async parseOnGames(response: any): Promise<Game[]> {
    const games: Game[] = [];

    await Promise.all(
      response.items.map(async (item) => {
        const game = new Game();

        game.map = await this.mapsRepository.findOneBy({
          name: item.event.map,
        });
        game.mode = await this.modesRepository.findOneBy({
          name: item.event.mode,
        });
        game.result = item.battle.result;

        if (game.mode && game.map) {
          games.push(game);
        }
      }),
    );

    return games;
  }

  async findOneById(userId: number, gameId: number): Promise<Game> {
    const game = await this.findOneByIdWithTracker(gameId);

    if (null === game) {
      throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    /* Current user is not allowed to see the game */
    if (userId !== game.tracker.user.id) {
      throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    return this.gamesRepository.findOne({
      where: {
        id: gameId,
      },
      relations: {
        fighters: {
          brawler: true,
        },
        map: true,
        mode: {
          type: true,
        },
      },
    });
  }

  async findOneByIdWithTracker(gameId: number): Promise<Game> {
    return this.gamesRepository.findOne({
      where: {
        id: gameId,
      },
      relations: {
        tracker: {
          user: true,
        },
        fighters: true,
      },
    });
  }

  async create(createGameDto: CreateGameDto, userId: number): Promise<Game> {
    const map = await this.mapsRepository.findOneBy({
      id: createGameDto.mapId,
    });

    if (null === map) {
      throw new HttpException('Map not found', HttpStatus.NOT_FOUND);
    }

    const mode = await this.modesRepository.findOneBy({
      id: createGameDto.modeId,
    });

    if (null === mode) {
      throw new HttpException('Mode not found', HttpStatus.NOT_FOUND);
    }

    const tracker = await this.trackerService.findOneByHashAndUserId(
      createGameDto.trackerHash,
      userId,
    );

    if (null === tracker) {
      throw new HttpException('Tracker not found', HttpStatus.NOT_FOUND);
    }

    const fighters: Fighter[] = [];

    for (const fighter of createGameDto.fighters) {
      fighters.push(await this.fighterService.create(fighter));
    }

    const game = this.gamesRepository.create({
      ...createGameDto,
      map,
      mode,
      tracker,
      fighters,
    });

    return this.gamesRepository.save(game);
  }

  async findSuggest(hash: string, userId: number): Promise<Game[]> {
    const tracker = await this.trackerService.findOneByHashAndUserId(
      hash,
      userId,
    );

    const tag = tracker?.tag;

    if (null == tag) {
      throw new HttpException('Tag required', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    return firstValueFrom(
      this.httpService
        .get(`/players/%23${tag}/battlelog`)
        .pipe(map((response) => this.parseOnGames(response.data))),
    );
  }

  async update(
    updateGameDto: UpdateGameDto,
    userId: number,
    gameId: number,
  ): Promise<Game> {
    const game = await this.findOneByIdWithTracker(gameId);

    if (null === game) {
      throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    /* Current user is not allowed to remove the game */
    if (userId !== game.tracker.user.id) {
      throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    if (updateGameDto.mapId) {
      const map = await this.mapsRepository.findOneBy({
        id: updateGameDto.mapId,
      });

      if (null === map) {
        throw new HttpException('Map not found', HttpStatus.NOT_FOUND);
      }

      game.map = map;
    }

    if (updateGameDto.modeId) {
      const mode = await this.modesRepository.findOneBy({
        id: updateGameDto.modeId,
      });

      if (null === mode) {
        throw new HttpException('Mode not found', HttpStatus.NOT_FOUND);
      }

      game.mode = mode;
    }

    const fighters: Fighter[] = [];

    for (const fighter of updateGameDto.fighters) {
      fighters.push(await this.fighterService.create(fighter));
    }

    return this.gamesRepository.save({ ...game, ...updateGameDto, fighters });
  }

  async remove(userId: number, gameId: number): Promise<Game> {
    const game = await this.findOneByIdWithTracker(gameId);

    if (null === game) {
      throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    /* Current user is not allowed to remove the game */
    if (userId !== game.tracker.user.id) {
      throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    return this.gamesRepository.remove(game);
  }
}
