import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Song } from "./song.entity";
import { User } from "@/modules/users/entities/user.entity";

@Entity('likes')
export class Like {
    @PrimaryColumn()
    user_id: number;

    @PrimaryColumn()
    song_id: number;  
     
    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    liked_at: Date;

    @ManyToOne(() => User , (user) => user.likes)
    user: User;

    @ManyToOne(() => Song , (song) => song.likes)
    song: Song;
}