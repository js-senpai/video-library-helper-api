import { Test, TestingModule } from '@nestjs/testing';
import { VideosTasksService } from './videos-tasks.service';

describe('VideosService', () => {
  let service: VideosTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideosTasksService],
    }).compile();

    service = module.get<VideosTasksService>(VideosTasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
