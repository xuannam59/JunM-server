import { Album } from "@/modules/albums/entities/album.entity";
import { Song } from "@/modules/songs/entities/song.entity";
import { Video } from "@/modules/video/entities/video.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Follow } from "./follow.entity";

@Entity()
export class Artist {
    @PrimaryGeneratedColumn("uuid")
    artist_id: string

    @Column()
    artist_name: string;

    @Column({ nullable: true })
    avatar: string;

    @Column()
    posted_by: string;

    @Column()
    slug: string;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date;

    @OneToMany(() => Follow, (follow) => follow.artist)
    follows: Follow[];

    @OneToMany(() => Song, (song) => song.artist)
    songs: Song[];

    @OneToMany(() => Album, (album) => album.artist)
    albums: Album[];

    @OneToMany(() => Video, (video) => video.artist)
    videos: Video[];

    constructor(artist: Partial<Artist>) {
        Object.assign(this, artist)
    }
}
