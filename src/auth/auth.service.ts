import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { compare } from 'bcrypt';
import { AuthRegisterDto } from './dto/request-auth.dto';
import { IGoogleUser, IUser } from '@/interfaces/user.interface';
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
    const user = await this.usersService.findUserBy({ email });
    if (user) {
      const isPasswordValid = await compare(password, user.password_hash);
      if (isPasswordValid) {
        return user;
      }
    }
    return null;
  }

  async validateGoogleUser(googleUser: IGoogleUser): Promise<any> {
    const user = await this.usersService.findOrCreateUser(googleUser);
    return user; // Trả về user để sử dụng trong phiên
  }

  async register(authRegisterDto: AuthRegisterDto) {
    const result = await this.usersService.register(authRegisterDto);
    return {
      user_id: result.user_id
    };
  }

  async login(user: IUser, res: Response) {
    const { user_id, email, username, role, avatar, number_phone, full_name, listeningHistories } = user;
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

    await this.usersService.updateRefreshToken(user_id, refresh_token);

    return {
      access_token,
      user: {
        user_id, full_name,
        email, username, role,
        avatar, number_phone, listeningHistories
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

  async getAccount(userId: string) {
    const user = await this.usersService.findUserBy({ user_id: userId });
    const { user_id, email, username, role, avatar, number_phone, full_name, google_id, listeningHistories } = user;
    return {
      user_id, email, full_name,
      username, role, google_id,
      avatar, number_phone, listeningHistories
    }
  }

  async processRefreshToken(refreshToken: string, res: Response) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
      });

      const user = await this.usersService.findUserBy({ refresh_token: refreshToken });
      if (!user) {
        res.clearCookie("refresh_token");
        throw new BadRequestException("Refresh token is invalid. Please login again");
      }
      const { user_id, email, username, role, avatar, number_phone, google_id, full_name } = user;
      const payload = {
        sub: "token access",
        iss: "from server",
        user_id,
        email,
        username,
        role
      };
      const access_token = this.jwtService.sign(payload);
      const refresh_token = this.createRefreshToken(payload);

      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        maxAge: ms(this.configService.get<StringValue>("JWT_REFRESH_EXPIRE"))
      });

      await this.usersService.updateRefreshToken(user_id, refresh_token);
      return {
        access_token,
        user: {
          user_id, email, full_name,
          username, role, avatar,
          number_phone, google_id,
        }
      };

    } catch (error) {
      throw new BadRequestException("Invalid refresh token");
    }
  }

  async logout(user: IUser, res: Response) {
    await this.usersService.updateRefreshToken(user.user_id, null);
    res.clearCookie("refresh_token");
    return "Logout successfully";
  }

  async loginByGoogle(user: IUser, res: Response) {
    const { user_id, email, username, role } = user;
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

    await this.usersService.updateRefreshToken(user_id, refresh_token);

    const frontendUrl = this.configService.get<string>("URL_FE");
    res.redirect(`${frontendUrl}/google/${access_token}`)
  }
}
