import { Artist } from "@/modules/artists/entities/artist.entity";
import { PlaylistSong } from "@/modules/playlists/entities/playlist-song.entity";
import { ListeningHistory } from "@/modules/users/entities/listening-history.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Like } from "./like.entity";

@Entity("songs")
export class Song {
    @PrimaryGeneratedColumn("uuid")
    song_id: string;

    @Column()
    title: string;

    @Column()
    file_url: string;

    @Column()
    thumbnail_url: string;

    @Column({ nullable: true, default: 0 })
    listens: number;

    @Column({ nullable: true })
    durations: number;

    @Column({ type: "date", nullable: true })
    release_date: Date;

    @Column({ type: "nvarchar", length: 5000 })
    lyrics: string;

    @Column({ nullable: true })
    genre: string;

    @Column({ name: "artist_id" })
    artist_id: string;

    @ManyToOne(() => Artist, (artist) => artist.songs)
    @JoinColumn({ name: "artist_id" })
    artist: Artist;

    @Column()
    slug: string

    @Column({ nullable: true })
    posted_by: string;

    @Column({ default: false })
    is_deleted: boolean;

    @Column({ type: "datetime", nullable: true })
    deleted_at: Date;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date;

    @OneToMany(() => Like, (like) => like.song)
    likes: Like[];

    @OneToMany(() => PlaylistSong, (playlistSong) => playlistSong.song)
    playlistSongs: PlaylistSong[];

    @OneToMany(() => ListeningHistory, (listeningHistory) => listeningHistory.song)
    listeningHistory: ListeningHistory[];

    constructor(partial: Partial<Song>) {
        Object.assign(this, partial);
    }
}
