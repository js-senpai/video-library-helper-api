import { Logger, Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { PrismaService } from '../../common/services/prisma.service';

@Module({
  providers: [VideosService, Logger, PrismaService],
  controllers: [VideosController],
})
export class VideosModule {}
