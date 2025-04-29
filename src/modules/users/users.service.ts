import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthRegisterDto } from '@/auth/dto/request-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashPasswordHelper } from '@/helpers/hash.helper';
import { IGoogleUser } from '@/interfaces/user.interface';
import { generateRandomString } from '@/helpers/generate.helper';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async findAll(query: Record<string, string>) {
        const params = new URLSearchParams(query);
        const current = +params.get('current') || 1;
        const pageSize = +params.get('pageSize') || 10;
        const skip = (current - 1) * pageSize;
        const sort = params.get('sort') || '-created_at';
        const searchText = params.get('search') || '';

        const column = sort.startsWith('-') ? sort.slice(1) : sort;
        const order = sort.startsWith('-') ? 'DESC' : 'ASC';


        let filter: any = { is_deleted: false }

        if (searchText) {
            const searchFields = ['username', 'full_name', 'email'];
            filter = searchFields.map(field => ({
                [field]: Like(`%${searchText}%`),
                is_deleted: false
            }));
        }

        const users = await this.userRepository.find({
            where: filter,
            take: pageSize,
            skip,
            order: {
                role: 'ASC',
                [column]: order,
            },
            select: ["user_id", "username", "email", "avatar",
                "full_name", "number_phone", "role", "google_id",
                "is_blocked", "blocked_at", "is_deleted",
                "created_at", "updated_at", "deleted_at"]
        })

        const totalItems = await this.userRepository.count({ where: filter });

        return {
            meta: {
                current: current,
                pageSize: pageSize,
                totalItems
            },
            result: users
        }
    }

    async updateUser(user_id: string, updateUserDto: UpdateUserDto) {
        const { username, full_name, avatar, number_phone, role, is_blocked } = updateUserDto

        const existUser = await this.userRepository.findOne({
            where: {
                user_id
            }
        });

        if (!existUser) throw new BadRequestException("Not found user!");

        if (avatar !== existUser.avatar) {
            this.cloudinaryService.deleteFile(existUser.avatar);
        }

        await this.userRepository.update(
            { user_id },
            {
                username, full_name, avatar,
                number_phone, role, is_blocked
            }
        );

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
