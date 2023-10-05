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

  async getRandom(): Promise<Pick<video, 'name' | 'original_name'>> {
    const totalRecords = await this.prismaService.video.count();
    const randomIndex = Math.floor(Math.random() * totalRecords);
    const [result] = await this.prismaService.video.findMany({
      take: 1,
      skip: randomIndex,
      select: {
        name: true,
        original_name: true,
      },
    });
    return result;
  }
}
