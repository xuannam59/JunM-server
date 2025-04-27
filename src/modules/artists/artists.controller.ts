import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { User } from '@/decorators/customize';
import { IUser } from '@/interfaces/user.interface';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) { }

  @Post("create")
  create(
    @Body() createArtistDto: CreateArtistDto,
    @User() user: IUser
  ) {
    return this.artistsService.create(createArtistDto, user);
  }

  @Get("all")
  findAll(@Query() query: Record<string, string>) {
    return this.artistsService.findAll(query);
  }


  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
    return this.artistsService.update(id, updateArtistDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.artistsService.remove(id);
  }
}
