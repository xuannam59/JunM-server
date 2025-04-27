import { IsNotEmpty } from "class-validator";

export class CreateArtistDto {
    @IsNotEmpty()
    artist_name: string;

    @IsNotEmpty()
    avatar: string;
}
