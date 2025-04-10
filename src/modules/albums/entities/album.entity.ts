import { Artist } from "@/modules/artists/entities/artist.entity";import { Song } from "@/modules/songs/entities/song.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("albums")
export class Album {
    @PrimaryGeneratedColumn()
    album_id: number;

    @Column()
    title: string;

    @ManyToOne(() => Artist, (artist) => artist.albums)
    artist: Artist;
  
    @Column({nullable: true})
    cover_url: string;

    @Column({ type: "date", nullable: true })
    release_date: Date;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date;

    @OneToMany(() => Song, (song) => song.album)
    songs: Song[];
}
