import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { Song } from './entities/song.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';
import { Like } from './entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Song, Like]), CloudinaryModule],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule { }
