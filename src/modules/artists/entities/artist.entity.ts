import { Album } from "@/modules/albums/entities/album.entity";
import { Song } from "@/modules/songs/entities/song.entity";
import { User } from "@/modules/users/entities/user.entity";
import { Video } from "@/modules/video/entities/video.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Artist {
    @PrimaryGeneratedColumn("uuid")
    artist_id: string

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "user_id" })
    users: User;

    @Column()
    artist_name: string;

    @Column({ nullable: true })
    avatar_url: string;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date;

    @OneToMany(() => Song, (song) => song.artist)
    songs: Song[];

    @OneToMany(() => Album, (album) => album.artist)
    albums: Album[];

    @OneToMany(() => Video, (video) => video.artist)
    videos: Video[];
}
