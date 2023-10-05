import { Logger, Module } from '@nestjs/common';
import { VideosTasksService } from './videos-tasks.service';
import { PrismaService } from '../../common/services/prisma.service';

@Module({
  providers: [VideosTasksService, Logger, PrismaService],
})
export class VideosTasksModule {}
