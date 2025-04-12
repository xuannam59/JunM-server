import { Controller, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/request-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, User } from '@/decorators/customize';
import { IUser } from '@/interfaces/user.interface';
import { Response } from 'express';
@Controller('auths')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('register')
  register(@Body() authRegisterDto: AuthRegisterDto) {
    return this.authService.register(authRegisterDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @User() user: IUser,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.login(user, res);
  }
}
