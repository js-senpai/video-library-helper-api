import { Controller, Get, Logger } from '@nestjs/common';
import { VideosService } from './videos.service';

@Controller('videos-tasks')
export class VideosController {
  constructor(
    private readonly videoService: VideosService,
    private readonly logger: Logger,
  ) {}

  @Get()
  async getAll() {
    try {
      return await this.videoService.getAll();
    } catch (e) {
      this.logger.error(VideosController, 'Error in "getAll" method', e);
      throw e;
    }
  }

  @Get('/random')
  async getRandom() {
    try {
      return await this.videoService.getAll();
    } catch (e) {
      this.logger.error(VideosController, 'Error in "getRandom" method', e);
      throw e;
    }
  }
}
