import { User } from "@/modules/users/entities/user.entity";

export interface IUser extends Omit<User, "password_hash"> { }