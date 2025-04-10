import { User } from "@/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PlaylistSong } from "./playlist-song.entity";

@Entity("playlists")
export class Playlist {
    @PrimaryGeneratedColumn()
    playlist_id: number;

    @ManyToOne(() => User, (user) => user.playlists, { nullable: false })
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column()
    title: string;

    @Column({ default: false })
    is_public: boolean;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date;

    @OneToMany(() => PlaylistSong, (playlistSong) => playlistSong.playlist, { nullable: true })
    playlistSongs: PlaylistSong[];
}
