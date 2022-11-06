import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from '../../src/modules/games/games.controller';
import { GamesService } from '../../src/modules/games/games.service';

describe('GamesController', () => {
  let controller: GamesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [GamesService],
    }).compile();

    controller = module.get<GamesController>(GamesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
