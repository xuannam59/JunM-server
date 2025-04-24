import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsEmail, isNotEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    username: string

    @IsOptional()
    @IsString()
    full_name: string;

    @IsOptional()
    @IsString()
    avatar: string;

    @IsOptional()
    @IsString()
    number_phone: string;

    @IsString()
    @IsNotEmpty()
    role: string;

    @IsBoolean()
    @IsNotEmpty()
    is_blocked: boolean;
}
