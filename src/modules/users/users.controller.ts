import { Controller, Get, Body, Patch, Param, Delete, Query, Post } from '@nestjs/common';
import { UsersService } from './users.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from '@/decorators/customize';
import { IUser } from '@/interfaces/user.interface';
import { CreateListeningHistoryDto } from './dto/create-listening-history.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get("all")
  findAll(
    @Query() query: any
  ) {
    return this.usersService.findAll(query);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }

  @Post("listening-history/create")
  @ResponseMessage("Create Listening History")
  createListeningHistory(
    @Body() createListeningHistoryDto: CreateListeningHistoryDto,
    @User() user: IUser
  ) {
    return this.usersService.createListeningHistory(createListeningHistoryDto, user.user_id);
  }

  @Get("listening-history/all")
  @ResponseMessage("Get Listening History")
  getListeningHistory(
    @Query() query: string,
    @User() user: IUser,
  ) {
    return this.usersService.getListeningHistory(user.user_id, query);
  }

}
