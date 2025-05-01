import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { ResponseMessage, User } from '@/decorators/customize';
import { IUser } from '@/interfaces/user.interface';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) { }

  @Post('create')
  @ResponseMessage('Video created successfully')
  create(
    @Body() createVideoDto: CreateVideoDto,
    @User() user: IUser
  ) {
    return this.videoService.create(createVideoDto, user);
  }

  @Get("all")
  @ResponseMessage("All videos fetched successfully")
  findAll(
    @Query() query: Record<string, string>
  ) {
    return this.videoService.findAll(query);
  }

  @Patch('update/:id')
  @ResponseMessage('Video updated successfully')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(id, updateVideoDto);
  }

  @Delete('delete/:id')
  @ResponseMessage('Video deleted successfully')
  remove(@Param('id') id: string) {
    return this.videoService.remove(id);
  }
}
