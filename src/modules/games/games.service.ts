import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackersService } from '../trackers/trackers.service';
import { firstValueFrom, map } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { Map } from './entities/map.entity';
import { Mode } from './entities/mode.entity';
import { ResourceNotFoundException } from '../../exceptions/ResourceNotFoundException';
import { MissingTagException } from '../../exceptions/MissingTagException';

@Injectable()
export class GamesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly trackerService: TrackersService,

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

  async findOneById(userId: number, gameId: number) {
    const game = await this.findOneByIdWithTracker(gameId);

    if (null === game) {
      throw new ResourceNotFoundException('Game not found');
    }

    /* Current user is not allowed to see the game */
    if (userId !== game.tracker.user.id) {
      throw new ResourceNotFoundException('Game not found');
    }

    return await this.gamesRepository.findOne({
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
    return await this.gamesRepository.findOne({
      where: {
        id: gameId,
      },
      relations: {
        tracker: {
          user: true,
        },
      },
    });
  }

  async create(createGameDto: CreateGameDto, userId: number) {
    const map = await this.mapsRepository.findOneBy({
      id: createGameDto.mapId,
    });

    if (null === map) {
      throw new ResourceNotFoundException('Map not found');
    }

    const mode = await this.modesRepository.findOneBy({
      id: createGameDto.modeId,
    });

    if (null === mode) {
      throw new ResourceNotFoundException('Mode not found');
    }

    const tracker = await this.trackerService.findOneByHashAndUserId(
      createGameDto.trackerHash,
      userId,
    );

    if (null === tracker) {
      throw new ResourceNotFoundException('Tracker not found');
    }

    const game = this.gamesRepository.create({
      ...createGameDto,
      map,
      mode,
      tracker,
    });

    return this.gamesRepository.save(game);
  }

  async findSuggest(gameId: number) {
    const game = await this.findOneByIdWithTracker(gameId);
    const tag = game.tracker.tag;

    if (null === tag) {
      throw new MissingTagException();
    }

    return await firstValueFrom(
      this.httpService
        .get(`/players/%23${tag}/battlelog`)
        .pipe(map((response) => this.parseOnGames(response.data))),
    );
  }

  async update(userId: number, gameId: number, updateGameDto: UpdateGameDto) {
    const game = await this.findOneByIdWithTracker(gameId);

    if (null === game) {
      throw new ResourceNotFoundException('Game not found');
    }

    /* Current user is not allowed to remove the game */
    if (userId !== game.tracker.user.id) {
      throw new ResourceNotFoundException('Game not found');
    }

    if (updateGameDto.mapId) {
      const map = await this.mapsRepository.findOneBy({
        id: updateGameDto.mapId,
      });

      if (null === map) {
        throw new ResourceNotFoundException('Map not found');
      }

      game.map = map;
    }

    if (updateGameDto.modeId) {
      const mode = await this.modesRepository.findOneBy({
        id: updateGameDto.modeId,
      });

      if (null === mode) {
        throw new ResourceNotFoundException('Mode not found');
      }

      game.mode = mode;
    }

    return this.gamesRepository.save({ ...game, ...updateGameDto });
  }

  async remove(userId: number, gameId: number) {
    const game = await this.findOneByIdWithTracker(gameId);

    if (null === game) {
      throw new ResourceNotFoundException('Game not found');
    }

    /* Current user is not allowed to remove the game */
    if (userId !== game.tracker.user.id) {
      throw new ResourceNotFoundException('Game not found');
    }

    return await this.gamesRepository.remove(game);
  }
}
