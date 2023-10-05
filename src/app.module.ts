import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { VideosModule } from './api/videos/videos.module';
import { VideosTasksModule } from './tasks/videos-tasks/videos-tasks.module';

@Module({
  imports: [
    // Config module
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'videos-tasks'),
      serveRoot: '/video',
    }),
    VideosModule,
    VideosTasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
