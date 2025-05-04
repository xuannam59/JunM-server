import { Controller, Get, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage, User } from '@/decorators/customize';
import { IUser } from '@/interfaces/user.interface';

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

  @Get("listening-history")
  @ResponseMessage("Get Listening History")
  getListeningHistory(
    @Query() query: string,
    @User() user: IUser,
  ) {
    return this.usersService.getListeningHistory(user.user_id, query);
  }

}
