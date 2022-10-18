import { Test, TestingModule } from '@nestjs/testing';
import { TrackerService } from './tracker.service';

describe('TrackerService', () => {
  let service: TrackerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrackerService],
    }).compile();

    service = module.get<TrackerService>(TrackerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
