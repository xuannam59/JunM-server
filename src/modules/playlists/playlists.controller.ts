import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Public, ResponseMessage, User } from '@/decorators/customize';
import { IUser } from '@/interfaces/user.interface';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) { }

  @Post("create")
  @ResponseMessage("Playlist created successfully")
  create(
    @Body() createPlaylistDto: CreatePlaylistDto,
    @User() user: IUser
  ) {
    return this.playlistsService.create(createPlaylistDto, user);
  }

  @Get("all")
  @Public()
  findAll(
    @Query() query: Record<string, string>,
  ) {
    return this.playlistsService.findAll(query);
  }

  @Get(":id")
  @Public()
  findOne(@Param('id') id: string) {
    return this.playlistsService.findOne(id);
  }

  @Patch('update/:id')
  @ResponseMessage("Playlist updated successfully")
  update(@Param('id') id: string, @Body() updatePlaylistDto: UpdatePlaylistDto) {
    return this.playlistsService.update(id, updatePlaylistDto);
  }

  @Delete('delete/:id')
  @ResponseMessage("Playlist deleted successfully")
  remove(@Param('id') id: string) {
    return this.playlistsService.remove(id);
  }
}
