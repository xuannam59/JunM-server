import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
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
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Song , (song) => song.likes)
    @JoinColumn({ name: "song_id" })
    song: Song;
}