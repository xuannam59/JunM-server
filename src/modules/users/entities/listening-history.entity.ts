import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Song } from "@/modules/songs/entities/song.entity";
import { Video } from "@/modules/video/entities/video.entity";  
@Entity("listening_histories")
export class ListeningHistory {
    @PrimaryGeneratedColumn()
    history_id: number;

   @ManyToOne(() => User , (user) => user.listeningHistories)
   user: User;

   @ManyToOne(() => Song , (song) => song.listeningHistory)
   song: Song;

   @ManyToOne(() => Video , (video) => video.listeningHistories)
    video: Video;

   @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
   listened_at: Date;
}