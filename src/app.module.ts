import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './configs/database.module';
import { UsersModule } from './modules/users/users.module';
import { ArtistsModule } from './modules/artists/artists.module';
import { SongsModule } from './modules/songs/songs.module';
import { PlaylistsModule } from './modules/playlists/playlists.module';
import { VideoModule } from './modules/video/video.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CacheRedisModule } from './configs/cashe.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),
    DatabaseModule,
    CacheRedisModule,
    UsersModule,
    ArtistsModule,
    SongsModule,
    PlaylistsModule,
    VideoModule,
    AuthModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
