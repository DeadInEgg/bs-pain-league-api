import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackersService } from 'src/modules/trackers/trackers.service';
import { firstValueFrom, map } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { Map } from './entities/map.entity';
import { Mode } from './entities/mode.entity';

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

  async create(createGameDto: CreateGameDto) {
    const map = await this.mapsRepository.findOneBy({
      id: createGameDto.mapId,
    });
    const mode = await this.modesRepository.findOneBy({
      id: createGameDto.modeId,
    });
    const tracker = await this.trackerService.findOneById(
      createGameDto.trackerId,
    );
    const game = this.gamesRepository.create({
      ...createGameDto,
      map,
      mode,
      tracker,
    });

    return this.gamesRepository.save(game);
  }

  async findSuggest(tag: string): Promise<Game[]> {
    return await firstValueFrom(
      this.httpService
        .get(`/players/%23${tag}/battlelog`)
        .pipe(map((response) => this.parseOnGames(response.data))),
    );
  }

  findOneById(id: number) {
    return this.gamesRepository.findOne({where: {id: id}, relations: {tracker: true}});
  }

  async update(id: number, updateGameDto: UpdateGameDto) {
    const game = await this.findOneById(id);

    if (!game) {
      throw new HttpException(
        'Game not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (updateGameDto.mapId) {
      game.map = await this.mapsRepository.findOneBy({
        id: updateGameDto.mapId,
      });
    }

    if (updateGameDto.modeId) {
      game.mode = await this.modesRepository.findOneBy({
        id: updateGameDto.modeId,
      });
    }

    if (updateGameDto.trackerId) {
      game.tracker = await this.trackerService.findOneById(
        updateGameDto.trackerId,
      );
    }

    return this.gamesRepository.save({ ...game, ...updateGameDto });
  }

  async remove(id: number) {
    const game = await this.findOneById(id);

    return this.gamesRepository.remove(game);
  }
}
