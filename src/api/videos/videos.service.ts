import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { video } from '@prisma/client';
import { IResponseOk } from '../../common/interfaces/response.interface';
import { join } from 'path';
import fs from 'fs';

@Injectable()
export class VideosService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(): Promise<Pick<video, 'name' | 'original_name'>[]> {
    return this.prismaService.video.findMany({
      select: {
        name: true,
        original_name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async create(file: Express.Multer.File): Promise<video> {
    const checkFile = await this.prismaService.video.findFirst({
      where: {
        original_name: file.filename,
      },
      select: {
        id: true,
      },
    });
    if (checkFile) {
      throw new ForbiddenException(`The file is already exist`);
    }
    return this.prismaService.video.create({
      data: {
        original_name: file.filename,
        name: file.originalname,
      },
    });
  }

  async delete(name: string): Promise<IResponseOk> {
    const getFile = await this.prismaService.video.findFirst({
      where: {
        name,
      },
      select: {
        id: true,
        original_name: true,
      },
    });
    if (!getFile) {
      throw new NotFoundException(`The file with name "${name}" not found`);
    }
    const getPath = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'videos',
      getFile.original_name,
    );
    const checkPath = fs.existsSync(getPath);
    if (checkPath) {
      await fs.promises.unlink(getPath);
    }
    return {
      ok: 'The video has successfully deleted',
    };
  }

  async get(name: string): Promise<Pick<video, 'name' | 'original_name'>> {
    return await this.prismaService.video.findFirst({
      where: {
        OR: [
          {
            name,
          },
          {
            original_name: name,
          },
        ],
      },
      select: {
        name: true,
        original_name: true,
      },
    });
  }

  async getRandom(): Promise<Pick<video, 'name' | 'original_name'>> {
    const totalRecords = await this.prismaService.video.count();
    const randomIndex = Math.max(
      0,
      Math.floor(Math.random() * totalRecords) - 1,
    );
    const [result] = await this.prismaService.video.findMany({
      take: 1,
      skip: randomIndex,
      select: {
        name: true,
        original_name: true,
      },
      orderBy: {
        name: 'desc',
      },
    });
    return result;
  }
}
