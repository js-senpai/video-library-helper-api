import { Controller, Get, Logger } from '@nestjs/common';

@Controller('videos-tasks')
export class VideosController {
  constructor(private readonly videoService, private readonly logger: Logger) {}

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
