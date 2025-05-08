import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "@/modules/users/entities/user.entity";
import { Artist } from "./artist.entity";

@Entity('follows')
export class Follow {
    @PrimaryColumn()
    user_id: string;

    @PrimaryColumn()
    artist_id: string;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    follow_at: Date;

    @ManyToOne(() => User, (user) => user.follows)
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Artist, (artist) => artist.follows)
    @JoinColumn({ name: "artist_id" })
    artist: Artist;
}