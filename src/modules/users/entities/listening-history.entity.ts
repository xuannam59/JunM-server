import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Song } from "@/modules/songs/entities/song.entity";
import { Video } from "@/modules/video/entities/video.entity";
@Entity("listening_histories")
export class ListeningHistory {
    @PrimaryGeneratedColumn("uuid")
    history_id: string;

    @Column({ name: "user_id" })
    user_id: string;

    @Column({ name: "song_id", nullable: true })
    song_id: string;

    @Column({ name: "video_id", nullable: true })
    video_id: string;

    @Column({ default: 1 })
    count_listened: number;

    @ManyToOne(() => User, (user) => user.listeningHistories)
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Song, (song) => song.listeningHistory)
    @JoinColumn({ name: "song_id" })
    song: Song;

    @ManyToOne(() => Video, (video) => video.listeningHistories)
    @JoinColumn({ name: "video_id" })
    video: Video;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date;

    constructor(partial: Partial<ListeningHistory>) {
        Object.assign(this, partial);
    }
}