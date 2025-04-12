import { Injectable } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { compare } from 'bcrypt';
import { AuthRegisterDto } from './dto/request-auth.dto';
import { IUser } from '@/interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import ms, { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const isPasswordValid = await compare(password, user.password_hash);
      if (isPasswordValid) {
        return user;
      }
    }
    return null;
  }

  async register(authRegisterDto: AuthRegisterDto) {
    const result = await this.usersService.register(authRegisterDto);
    return {
      user_id: result.user_id
    };
  }

  login(user: IUser, res: Response) {
    const { user_id, email, username, role, avatar, number_phone } = user;
    const payload = {
      sub: "token access",
      iss: "from server",
      user_id,
      email,
      username,
      role
    }

    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.createRefreshToken(payload);

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<StringValue>("JWT_REFRESH_EXPIRE"))
    });

    return {
      access_token,
      user: {
        user_id,
        email,
        username,
        role,
        avatar,
        number_phone
      }
    };
  }

  createRefreshToken(payload) {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRE")
    });
    return refresh_token
  }
}
