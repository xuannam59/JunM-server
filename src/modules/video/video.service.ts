import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { IUser } from '@/interfaces/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Like, Repository } from 'typeorm';
import { replaceSlug } from '@/helpers/replaceSlug.helper';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>
  ) { }

  async create(createVideoDto: CreateVideoDto, user: IUser) {
    const newVideo = new Video({
      ...createVideoDto,
      slug: replaceSlug(createVideoDto.title),
      posted_by: user.user_id
    });

    await this.videoRepository.save(newVideo);
    return newVideo;
  }

  async findAll(query: Record<string, string>) {
    const params = new URLSearchParams(query);
    const current = +params.get('current') || 1;
    const pageSize = +params.get('pageSize') || 10;
    const skip = (current - 1) * pageSize;
    const sort = params.get('sort') || '-created_at';
    const searchText = params.get('search') || '';

    const column = sort.startsWith('-') ? sort.slice(1) : sort;
    const order = sort.startsWith('-') ? 'DESC' : 'ASC';


    let filter: any = {};

    if (searchText) {
      filter.slug = Like(`%${searchText}%`);
    }

    const videos = await this.videoRepository.find({
      where: filter,
      take: pageSize,
      skip,
      order: {
        [column]: order,
      },
      relations: {
        artist: true,
        song: true,
      }
    })

    const totalItems = await this.videoRepository.count({ where: filter });

    return {
      meta: {
        current: current,
        pageSize: pageSize,
        totalItems
      },
      result: videos
    }
  }

  async update(id: string, updateVideoDto: UpdateVideoDto) {
    const result = await this.videoRepository.update({ video_id: id },
      {
        ...updateVideoDto,
        slug: replaceSlug(updateVideoDto.title)
      });

    if (result.affected === 0) {
      throw new Error("Video not found");
    }

    return "Video updated successfully";
  }

  async remove(id: string) {
    const result = await this.videoRepository.delete({ video_id: id });
    if (result.affected === 0) {
      throw new Error("Video not found");
    }
    return "Video deleted successfully";
  }
}
