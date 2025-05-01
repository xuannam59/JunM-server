import { Artist } from "@/modules/artists/entities/artist.entity";
import { ListeningHistory } from "@/modules/users/entities/listening-history.entity";
import { Song } from "@/modules/songs/entities/song.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("videos")
export class Video {
    @PrimaryGeneratedColumn("uuid")
    video_id: string;

    @Column()
    title: string;

    @Column({ name: "song_id" })
    song_id: string;

    @Column({ name: "artist_id" })
    artist_id: string;

    @Column()
    video_url: string;

    @Column({ type: "date", nullable: true })
    release_date: Date;

    @Column()
    posted_by: string;

    @Column()
    slug: string;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    updated_at: Date;

    @ManyToOne(() => Song, { nullable: true })
    @JoinColumn({ name: "song_id" })
    song: Song;

    @ManyToOne(() => Artist, (artist) => artist.videos)
    @JoinColumn({ name: "artist_id" })
    artist: Artist;

    @ManyToMany(() => ListeningHistory, (listeningHistory) => listeningHistory.video)
    listeningHistories: ListeningHistory[];

    constructor(partial: Partial<Video>) {
        Object.assign(this, partial);
    }
}
