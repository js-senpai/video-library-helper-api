import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../common/services/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class VideosTasksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}
  @Cron('*/1 * * * *')
  async handleCron() {
    try {
      this.logger.log('The videos tasks has started');
      const videos = await fs.promises.readdir(
        join(__dirname, '..', '..', '..', 'videos'),
      );
      await Promise.all(
        videos.map(async (name) => {
          const checkFile = await this.prismaService.video.findFirst({
            where: {
              original_name: name,
            },
            select: {
              id: true,
            },
          });
          if (!checkFile) {
            await this.prismaService.video.create({
              data: {
                original_name: name,
                name: name.replace(/\.[^.]+$/, ''),
              },
            });
          }
        }),
      );
    } catch (e) {
      this.logger.error(VideosTasksService, 'Error in "handleCron"');
    } finally {
      this.logger.log('The videos tasks has finished');
    }
  }
}
