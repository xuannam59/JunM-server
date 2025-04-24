import { Album } from "@/modules/albums/entities/album.entity";
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

    @Column({ nullable: true })
    duration: number;

    @Column()
    file_url: string;

    @Column({ type: "date", nullable: true })
    release_date: Date;

    @Column({ nullable: true })
    genre: string;

    @ManyToOne(() => Artist, (artist) => artist.songs)
    @JoinColumn({ name: "artist_id" })
    artist: Artist;

    @ManyToOne(() => Album, (album) => album.songs)
    @JoinColumn({ name: "album_id" })
    album: Album;

    @Column()
    slug: string

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @Column({ nullable: true })
    posted_by: string;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date;

    @OneToMany(() => Like, (like) => like.song)
    likes: Like[];

    @OneToMany(() => PlaylistSong, (playlistSong) => playlistSong.song)
    playlistSongs: PlaylistSong[];

    @OneToMany(() => ListeningHistory, (listeningHistory) => listeningHistory.song)
    listeningHistory: ListeningHistory[];
}
