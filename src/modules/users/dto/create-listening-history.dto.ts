import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateListeningHistoryDto {

    @IsNotEmpty()
    user_id: string;

    @IsOptional()
    song_id: string;

    @IsOptional()
    video_id: string;
}