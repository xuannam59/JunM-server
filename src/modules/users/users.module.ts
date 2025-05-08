import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';
import { ListeningHistory } from './entities/listening-history.entity';
import { Song } from '../songs/entities/song.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ListeningHistory, Song]), CloudinaryModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
