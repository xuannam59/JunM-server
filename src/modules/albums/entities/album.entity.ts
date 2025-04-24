import { Artist } from "@/modules/artists/entities/artist.entity";
import { Song } from "@/modules/songs/entities/song.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("albums")
export class Album {
    @PrimaryGeneratedColumn("uuid")
    album_id: string;

    @Column()
    title: string;

    @ManyToOne(() => Artist, (artist) => artist.albums)
    @JoinColumn({ name: "artist_id" })
    artist: Artist;

    @Column({ nullable: true })
    cover_url: string;

    @Column({ type: "date", nullable: true })
    release_date: Date;

    @Column()
    slug: string;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date;

    @OneToMany(() => Song, (song) => song.album)
    songs: Song[];
}
