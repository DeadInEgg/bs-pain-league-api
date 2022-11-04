import { Test, TestingModule } from '@nestjs/testing';
import { TrackersController } from '../../src/trackers/trackers.controller';
import { TrackersService } from '../../src/trackers/trackers.service';

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
