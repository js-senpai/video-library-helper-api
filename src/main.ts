import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { PrismaService } from './common/services/prisma.service';
import * as compression from 'compression';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import * as fs from 'fs';
import { join } from 'path';
const httpsOptions: HttpsOptions = {
  key: fs.readFileSync(
    join(__dirname, '..', '..', 'ssl-certificates', 'private.key'),
  ),
  cert: fs.readFileSync(
    join(__dirname, '..', '..', 'ssl-certificates', 'server.pem'),
  ),
  requestCert: true,
  rejectUnauthorized: false,
};
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  // Set global prefix for routes
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'video', method: RequestMethod.GET }],
  });
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
