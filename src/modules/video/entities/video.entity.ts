import { Artist } from "@/modules/artists/entities/artist.entity";
import { ListeningHistory } from "@/modules/users/entities/listening-history.entity";
import { Song } from "@/modules/songs/entities/song.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("videos")
export class Video {
    @PrimaryGeneratedColumn()
    video_id: number;
    
    @Column()
    title: string;

    @ManyToOne(() => Song , {nullable: true})
    song: Song;

    @ManyToOne(() => Artist , (artist) => artist.videos)
    artist: Artist;
    
    @Column()
    file_url: string;

    @Column()
    duration: number;

    @Column({type: "date", nullable: true})
    release_date: Date;
    
    @Column()
    view_count: number;   

    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    created_at: Date;

    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    updated_at: Date;

    @ManyToMany(() => ListeningHistory , (listeningHistory) => listeningHistory.video)
    listeningHistories: ListeningHistory[];
}
