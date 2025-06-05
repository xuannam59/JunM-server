import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateListeningHistoryDto {

    @IsOptional()
    song_id: string;

    @IsOptional()
    video_id: string;
}