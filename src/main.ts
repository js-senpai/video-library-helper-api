import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from './common/services/prisma.service';
import * as compression from 'compression';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Set global prefix for routes
  app.setGlobalPrefix('api');
  // Enable global validation request body data
  app.useGlobalPipes(new ValidationPipe());
  // Prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  // Compression
  app.use(compression());
  await app.listen(3000);
}
bootstrap();
