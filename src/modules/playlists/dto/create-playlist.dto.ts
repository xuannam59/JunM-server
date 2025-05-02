import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePlaylistDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    is_public: boolean;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    songs: string[];
}
