import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { video } from '@prisma/client';

@Injectable()
export class VideosService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(): Promise<Pick<video, 'name' | 'original_name'>[]> {
    return await this.prismaService.video.findMany({
      select: {
        name: true,
        original_name: true,
      },
    });
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
