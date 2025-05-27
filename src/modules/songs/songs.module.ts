import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { Song } from './entities/song.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';
import { Like } from './entities/like.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheRedisModule } from '@/configs/cashe.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Song, Like]),
    CloudinaryModule,
    CacheRedisModule
  ],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule { }
