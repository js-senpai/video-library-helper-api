import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { join } from 'path';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('videos')
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
      this.logger.error(VideosController.name, 'Error in "getAll" method', e);
      throw e;
    }
  }

  @Get('/info/:name')
  async get(@Param('name') name: string) {
    try {
      return await this.videoService.get(name);
    } catch (e) {
      this.logger.error(VideosController.name, 'Error in "get" method', e);
      throw e;
    }
  }

  @Get('random')
  async getRandom() {
    try {
      return await this.videoService.getRandom();
    } catch (e) {
      this.logger.error(
        VideosController.name,
        'Error in "getRandom" method',
        e,
      );
      throw e;
    }
  }

  @Delete('/:name')
  async delete(@Param('name') name: string) {
    try {
      return await this.videoService.delete(name);
    } catch (e) {
      this.logger.error(VideosController.name, 'Error in "delete" method', e);
      throw e;
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        files: 1,
      },
      storage: diskStorage({
        destination: async function (req, file, cb) {
          const destinationPath = join(__dirname, '..', '..', '..', `videos`);
          if (!fs.existsSync(destinationPath)) {
            await fs.promises.mkdir(destinationPath, { recursive: true });
          }
          cb(null, destinationPath);
        },
        filename: function (req, file, cb) {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async create(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(mp4)$/,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    try {
      return await this.videoService.create(file);
    } catch (e) {
      this.logger.error(VideosController.name, 'Error in "create" method', e);
      throw e;
    }
  }
}
