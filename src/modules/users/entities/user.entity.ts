import { Playlist } from "@/modules/playlists/entities/playlist.entity";
import { ListeningHistory } from "./listening-history.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Like } from "@/modules/songs/entities/like.entity";
import { Follow } from "@/modules/artists/entities/follow.entity";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    user_id: string;

    @Column({ unique: true, nullable: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    google_id: string

    @Column({ select: false })
    password_hash: string;

    @Column({ nullable: true })
    full_name: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({ nullable: true })
    number_phone: string;

    @Column({ default: "USER" })
    role: string

    @Column({ type: "varchar", nullable: true, length: 500, select: false })
    refresh_token: string;

    @Column({ type: "boolean", default: false })
    is_deleted: boolean;

    @Column({ type: "datetime", nullable: true })
    deleted_at: Date;

    @Column({ type: "boolean", default: false })
    is_blocked: boolean;

    @Column({ type: "datetime", nullable: true })
    blocked_at: Date;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date;

    @OneToMany(() => Playlist, (playlist) => playlist.user, { nullable: true })
    playlists: Playlist[];

    @OneToMany(() => Follow, (follow) => follow.user)
    follows: Follow[];


    @OneToMany(() => ListeningHistory, (listeningHistory) => listeningHistory.user, { nullable: true })
    listeningHistories: ListeningHistory[];

    @OneToMany(() => Like, (like) => like.user, { nullable: true })
    likes: Like[];

    constructor(user: Partial<User>) {
        Object.assign(this, user)
    }
}