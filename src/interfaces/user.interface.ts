import { User } from "@/modules/users/entities/user.entity";

export interface IUser extends Omit<User, "password_hash"> { }

export interface IGoogleUser {
    google_id: string;
    email: string;
    full_name: string;
    avatar: string;
}