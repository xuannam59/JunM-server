import { Injectable } from '@nestjs/common';
import { AuthLoginDto, AuthRegisterDto } from './dto/request-auth.dto';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) {}
    
  async register(authRegisterDto: AuthRegisterDto) {
    const result = await this.usersService.register(authRegisterDto);
    console.log(result);
    return {
        user_id: result.user_id
    };
  }

  login(authLoginDto: AuthLoginDto) {
    console.log(authLoginDto);
    return "Login success";
  }
}
