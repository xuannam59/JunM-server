import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Playlist } from "./playlist.entity";
import { Song } from "@/modules/songs/entities/song.entity";

@Entity("playlist_songs")
export class PlaylistSong {
    @PrimaryColumn()
    playlist_id: string;

    @PrimaryColumn()
    song_id: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    added_at: Date;

    @ManyToOne(() => Playlist, (playlist) => playlist.playlistSongs)
    @JoinColumn({ name: "playlist_id" })
    playlist: Playlist;

    @ManyToOne(() => Song, (song) => song.playlistSongs)
    @JoinColumn({ name: "song_id" })
    song: Song

    constructor(partial: Partial<PlaylistSong>) {
        Object.assign(this, partial);
    }
}