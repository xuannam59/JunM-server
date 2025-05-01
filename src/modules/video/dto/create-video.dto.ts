import { IsNotEmpty } from "class-validator";

export class CreateVideoDto {
    @IsNotEmpty()
    video_url: string;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    song_id: string;

    @IsNotEmpty()
    artist_id: string;

    @IsNotEmpty()
    release_date: Date;
}
