import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateSongDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    file_url: string;

    @IsNotEmpty()
    thumbnail_url: string;

    @IsNotEmpty()
    durations: number;

    @IsNotEmpty()
    release_date: Date;

    @IsNotEmpty()
    lyrics: string

    @IsNotEmpty()
    genre: string

    @IsNotEmpty()
    artist_id: string

    @IsOptional()
    album_id: string
}
