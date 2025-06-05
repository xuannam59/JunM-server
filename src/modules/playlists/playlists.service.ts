import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { IUser } from '@/interfaces/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { In, Like, Repository } from 'typeorm';
import { replaceSlug } from '@/helpers/replaceSlug.helper';
import { PlaylistSong } from './entities/playlist-song.entity';

@Injectable()
export class PlaylistsService {
    constructor(
        @InjectRepository(Playlist) private playlistRepository: Repository<Playlist>,
        @InjectRepository(PlaylistSong) private playlistSongRepository: Repository<PlaylistSong>,
    ) { }
    async create(createPlaylistDto: CreatePlaylistDto, user: IUser) {
        const { title, is_public, songs } = createPlaylistDto;
        const newPlaylist = new Playlist({
            user_id: user.user_id,
            title,
            is_public,
            slug: replaceSlug(title),
        });

        const playlist = await this.playlistRepository.save(newPlaylist);

        if (songs && songs.length > 0) {
            const playlistSongs = songs.map((song_id) => ({
                playlist_id: playlist.playlist_id,
                song_id,
                added_at: new Date(),
            }));

            await this.playlistSongRepository
                .createQueryBuilder()
                .insert()
                .into(PlaylistSong)
                .values(playlistSongs)
                .execute();
        }

        return playlist;
    }

    async findAll(query: Record<string, string>) {
        const params = new URLSearchParams(query);
        const current = +params.get('current') || 1;
        const pageSize = +params.get('pageSize') || 10;
        const skip = (current - 1) * pageSize;
        const sort = params.get('sort') || '-created_at';
        const searchText = params.get('search') || '';
        const user_id = params.get('user_id') || '';

        const column = sort.startsWith('-') ? sort.slice(1) : sort;
        const order = sort.startsWith('-') ? 'DESC' : 'ASC';

        let filter: any = {};

        if (searchText) {
            filter.slug = Like(`%${searchText}%`);
        }

        if (user_id) {
            filter.user_id = user_id;
        }

        const queryBuilder = this.playlistRepository
            .createQueryBuilder('playlist')
            .leftJoin("playlist.playlistSongs", "playlistSong")
            .leftJoin("playlist.user", "user")
            .leftJoin("playlistSong.song", "song")
            .leftJoin("song.artist", "artist")
            .leftJoin("song.likes", "like")
            .select([
                'playlist',
                'user.user_id',
                'user.username',
                'user.full_name',
                'playlistSong.song_id',
                'song',
                'artist.artist_id',
                'artist.artist_name',
                'artist.avatar',
                'like.user_id',
            ])
            .orderBy(`playlist.${column}`, order)
            .skip(skip)
            .take(pageSize)
            .where(filter);

        const [playlists, totalItems] = await queryBuilder.getManyAndCount();

        return {
            meta: {
                current: current,
                pageSize: pageSize,
                totalItems
            },
            result: playlists.map(playlist => ({
                ...playlist,
                playlistSongs: playlist.playlistSongs.map(playlistSong => ({
                    song: {
                        ...playlistSong.song,
                        likes: playlistSong.song.likes.map(like => like.user_id)
                    }
                }))
            }))
        }
    }

    async findOne(id: string) {
        const playlist = await this.playlistRepository
            .createQueryBuilder('playlist')
            .leftJoin("playlist.playlistSongs", "playlistSong")
            .leftJoin("playlist.user", "user")
            .leftJoin("playlistSong.song", "song")
            .leftJoin("song.artist", "artist")
            .leftJoin("song.likes", "like")
            .select([
                'playlist',
                'user.user_id',
                'user.username',
                'user.full_name',
                'playlistSong.song_id',
                'song',
                'artist.artist_id',
                'artist.artist_name',
                'artist.avatar',
                'like.user_id',
            ])
            .where({ playlist_id: id })
            .getOne();

        if (!playlist) {
            throw new BadRequestException(`Playlist with id ${id} not found`);
        }

        return {
            ...playlist,
            playlistSongs: playlist.playlistSongs.map(playlistSong => ({
                song: {
                    ...playlistSong.song,
                    likes: playlistSong.song.likes.map(like => like.user_id)
                }
            }))
        };
    }

    async update(id: string, updatePlaylistDto: UpdatePlaylistDto) {
        const { title, is_public, songs } = updatePlaylistDto;
        const existingPlaylist = await this.playlistSongRepository.find({
            where: { playlist_id: id },
            select: ["song_id"]
        });

        if (!existingPlaylist) {
            throw new BadRequestException(`Playlist with id ${id} not found`);
        }

        await this.playlistRepository.update({ playlist_id: id }, { title, is_public, slug: replaceSlug(title) });

        const existingPlaylistSongIds = existingPlaylist.map((song) => song.song_id);
        const notExistingPlaylistSongs = existingPlaylistSongIds.filter((song) => !songs.includes(song));
        const newPlaylistSongs = songs.filter((song) => !existingPlaylistSongIds.includes(song));

        if (notExistingPlaylistSongs.length > 0) {
            await this.playlistSongRepository.delete({
                playlist_id: id,
                song_id: In(notExistingPlaylistSongs)
            });
        }

        if (newPlaylistSongs.length > 0) {
            const playlistSongs = newPlaylistSongs.map((song_id) => ({
                playlist_id: id,
                song_id,
                added_at: new Date(),
            }));
            await this.playlistSongRepository
                .createQueryBuilder()
                .insert()
                .into(PlaylistSong)
                .values(playlistSongs)
                .execute();
        }

        return "Updated successfully";
    }

    async remove(id: string) {
        const existingPlaylist = await this.playlistRepository.findOne({ where: { playlist_id: id } });
        if (!existingPlaylist) {
            throw new BadRequestException(`Playlist with id ${id} not found`);
        }

        await this.playlistSongRepository.delete({
            playlist_id: id,
        });

        await this.playlistRepository.delete({ playlist_id: id });

        return "Deleted successfully";
    }
}
