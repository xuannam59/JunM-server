import { Controller, Post, Body, UseGuards, Req, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/request-auth.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, User } from '@/decorators/customize';
import { IUser } from '@/interfaces/user.interface';
import { Request, Response } from 'express';
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

  @Get('account')
  getAccount(
    @User() user: IUser,
  ) {
    return this.authService.getAccount(user);
  }

  @Public()
  @Post("refresh-token")
  processRefreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshToken = req.cookies["refresh_token"];
    return this.authService.processRefreshToken(refreshToken, res);
  }

  @Post("logout")
  logout(
    @User() user: IUser,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.logout(user, res);
  }

}
