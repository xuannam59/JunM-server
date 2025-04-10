import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './configs/database.module';
import { UsersModule } from './modules/users/users.module';
import { ArtistsModule } from './modules/artists/artists.module';
import { SongsModule } from './modules/songs/songs.module';
import { AlbumsModule } from './modules/albums/albums.module';
import { PlaylistsModule } from './modules/playlists/playlists.module';
import { VideoModule } from './modules/video/video.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),
    DatabaseModule,
    UsersModule,
    ArtistsModule,
    SongsModule,
    AlbumsModule,
    PlaylistsModule,
    VideoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
