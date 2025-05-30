import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Public, ResponseMessage, User } from '@/decorators/customize';
import { IUser } from '@/interfaces/user.interface';

@Controller('songs')
export class SongsController {
    constructor(private readonly songsService: SongsService) { }

    @Post('create')
    @ResponseMessage("Create song")
    create(
        @Body() createSongDto: CreateSongDto,
        @User() user: IUser
    ) {
        return this.songsService.create(createSongDto, user);
    }

    @Get('detail/:id')
    @Public()
    @ResponseMessage("Get song detail")
    findDetail(@Param('id') song_id: string) {
        return this.songsService.findDetail(song_id);
    }

    @Get('all')
    @Public()
    @ResponseMessage("Get all songs")
    findAll(@Query() query: Record<string, string>) {
        return this.songsService.findAll(query);
    }

    @Get('favorite')
    @ResponseMessage("Get favorite songs")
    findFavoriteSongs(
        @Query() query: Record<string, string>
    ) {
        return this.songsService.findFavoriteSongs(query);
    }


    @Patch('update/:id')
    @ResponseMessage("Update song")
    update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto) {
        return this.songsService.update(id, updateSongDto);
    }

    @Delete('delete/:id')
    @ResponseMessage("Delete song")
    remove(@Param('id') id: string) {
        return this.songsService.remove(id);
    }

    @Post('toggle-like/:id')
    @ResponseMessage("Toggle like song")
    toggleLike(
        @Param('id') song_id: string,
        @User() user: IUser
    ) {
        return this.songsService.toggleLike(user.user_id, song_id);
    }

}
