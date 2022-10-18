import { Test, TestingModule } from '@nestjs/testing';
import { TrackerController } from './tracker.controller';
import { TrackerService } from './tracker.service';

describe('TrackerController', () => {
  let controller: TrackerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackerController],
      providers: [TrackerService],
    }).compile();

    controller = module.get<TrackerController>(TrackerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
