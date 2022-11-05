import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,

    @InjectRepository(Map)
    private mapsRepository: Repository<Map>,

    @InjectRepository(Mode)
    private modesRepository: Repository<Mode>,
  ) {}

  async create(createGameDto: CreateGameDto) {
    const map = await this.mapsRepository.findOneBy({
      id: createGameDto.mapId,
    });

    const mode = await this.modesRepository.findOneBy({
      id: createGameDto.modeId,
    });

    const game = new Game();
    game.win = createGameDto.win;
    game.mode = mode;
    game.map = map;

    return this.gamesRepository.create(game);
  }

  findSuggest() {
    return this.httpService.get(
      'https://api.brawlstars.com/v1/players/%23JGCCGY80/battlelog',
    );
  }

  findOne(id: number) {
    return this.gamesRepository.findOneBy({ id });
  }

  async update(id: number, updateGameDto: UpdateGameDto) {
    const game = await this.findOne(id);
    if (updateGameDto.win) game.win = updateGameDto.win;
    if (updateGameDto.mapId) {
      const map = await this.mapsRepository.findOneBy({
        id: updateGameDto.mapId,
      });
      game.map = map;
    }
    if (updateGameDto.modeId) {
      const mode = await this.modesRepository.findOneBy({
        id: updateGameDto.modeId,
      });
      game.mode = mode;
    }

    return this.gamesRepository.save(game);
  }

  async remove(id: number) {
    return this.gamesRepository.delete(id);
  }
}
