import { Test, TestingModule } from '@nestjs/testing';
import { TrackersController } from './trackers.controller';
import { TrackersService } from './trackers.service';

describe('TrackerController', () => {
  let controller: TrackersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackersController],
      providers: [TrackersService],
    }).compile();

    controller = module.get<TrackersController>(TrackersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
