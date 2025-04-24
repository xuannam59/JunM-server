import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthRegisterDto } from '@/auth/dto/request-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashPasswordHelper } from '@/helpers/hash.helper';
import { IGoogleUser } from '@/interfaces/user.interface';
import { generateRandomString } from '@/helpers/generate.helper';
@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    async findAll(query: Record<string, string>) {
        let filter = {}
        let order: 'ASC' | 'DESC' = "ASC";
        let column = "created_at";
        if (query.sort) {
            if (query.sort.startsWith("-")) {
                order = "DESC";
                column = query.sort.substring(1);
            } else {
                column = query.sort;
            }
        }
        const defaultCurrent = query.current ?? 1;
        const defaultPageSize = query.pageSize ?? 10;

        const totalItems = await this.userRepository.count(filter);
        const skip = (+defaultCurrent - 1) * +defaultPageSize;


        const users = await this.userRepository.find({
            where: filter,
            take: +defaultPageSize,
            skip,
            order: {
                role: "ASC",
                [column]: order
            },
            select: ["user_id", "username", "email", "avatar",
                "full_name", "number_phone", "role", "google_id",
                "is_blocked", "blocked_at", "is_deleted",
                "created_at", "updated_at", "deleted_at"
            ]
        })

        return {
            meta: {
                current: defaultCurrent,
                pageSize: defaultPageSize,
                totalItems
            },
            result: users.map(({ password_hash, ...rest }) => rest)
        }
    }


    async updateUser(user_id: string, updateUserDto: UpdateUserDto) {
        const { username, full_name, avatar, number_phone, role, is_blocked } = updateUserDto

        const result = await this.userRepository.update(
            { user_id },
            {
                username, full_name, avatar,
                number_phone, role, is_blocked
            }
        )

        if (result.affected === 0) {
            throw new BadRequestException("Not found user!");
        }

        return "Update user successfully!";
    }

    async removeUser(user_id: string) {
        const result = await this.userRepository.update(
            { user_id },
            {
                is_deleted: true,
                deleted_at: new Date()
            }
        )

        if (result.affected === 0)
            throw new BadRequestException("Not found user");

        return `Delete user successfully!`;
    }

    async register(registerDto: AuthRegisterDto) {
        const { username, email, password, confirmPassword } = registerDto;

        const exist = await this.userRepository.findOne({
            where: [
                { email },
                { username },
            ],
        });

        if (exist) throw new BadRequestException('Email or Username already exists');
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

    async findUserBy(criteria: { email?: string, refresh_token?: string, user_id?: string }) {
        const user = await this.userRepository.findOne({
            where: criteria
        });

        return user;
    }

    async updateRefreshToken(user_id: string, refresh_token: string) {
        await this.userRepository.update(user_id, {
            refresh_token
        })
    }

    async findOrCreateUser(googleUser: IGoogleUser) {
        const { google_id, email, full_name, avatar } = googleUser;
        const existUser = await this.userRepository.findOne({
            where: {
                email
            }
        });
        if (!existUser) {
            const password_hash = await hashPasswordHelper(generateRandomString(9));
            const newUser = new User({ google_id, email, full_name, avatar, password_hash });
            return this.userRepository.save(newUser);
        }
        return existUser;
    }
}
