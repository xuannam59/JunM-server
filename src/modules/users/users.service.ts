import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthRegisterDto } from '@/auth/dto/request-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashPasswordHelper } from '@/helpers/hash.helper';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async register(registerDto: AuthRegisterDto) {
    const { username, email, password, confirmPassword } = registerDto;

    const exist = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (exist) throw new BadRequestException('Email already exists');
    if (password !== confirmPassword) throw new BadRequestException('Password and confirm password do not match');

    const hashPassword = await hashPasswordHelper(password);

    const user = new User({
      username,
      email,
      password_hash: hashPassword,
    });

    await this.userRepository.save(user);
    delete user.password_hash;

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      }
    });
    return user;
  }

  async findByRefreshToken(refresh_token: string) {
    const user = await this.userRepository.findOne({
      where: {
        refresh_token
      }
    });

    return user;
  }

  async updateRefreshToken(user_id: string, refresh_token: string) {
    await this.userRepository.update(user_id, {
      refresh_token
    })
  }
}
