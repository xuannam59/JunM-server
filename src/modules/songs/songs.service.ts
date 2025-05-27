import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { IUser } from '@/interfaces/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './entities/song.entity';
import { Like, Repository } from 'typeorm';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { replaceSlug } from '@/helpers/replaceSlug.helper';
import * as LikeSong from './entities/like.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class SongsService {
    constructor(
        @InjectRepository(Song) private songRepository: Repository<Song>,
        @InjectRepository(Like) private likeRepository: Repository<LikeSong.Like>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    async create(createSongDto: CreateSongDto, user: IUser) {
        const newSong = new Song({
            ...createSongDto,
            slug: replaceSlug(createSongDto.title),
            posted_by: user.user_id,
        });

        await this.songRepository.save(newSong);
        return newSong;
    }


    async findDetail(song_id: string) {
        const cacheKey = `song:${song_id}`;

        // Kiểm tra cache
        const cachedSongs = await this.cacheManager.get(cacheKey);
        if (cachedSongs) {
            return cachedSongs;
        }

        const song = await this.songRepository.findOne({
            where: { song_id },
            relations: {
                artist: true,
                likes: true,
            }
        });
        if (!song) throw new BadRequestException('Song not found');

        await this.cacheManager.set(cacheKey, song);
        return song;
    }

    async findAll(query: Record<string, string>) {
        const params = new URLSearchParams(query);

        const current = +params.get('current') || 1;
        const pageSize = +params.get('pageSize') || 10;
        const skip = (current - 1) * pageSize;
        const sort = params.get('sort') || '-created_at';
        const searchText = params.get('search') || '';
        const artist_id = params.get('artist_id') || '';
        const genre = params.get('genre') || '';
        const random = params.get('random') === "true";

        const column = sort.startsWith('-') ? sort.slice(1) : sort;
        const order = sort.startsWith('-') ? 'DESC' : 'ASC';


        let filter: any = {};

        if (searchText) {
            filter.slug = Like(`%${searchText}%`);
        }

        if (artist_id) {
            filter.artist_id = artist_id;
        }

        if (genre) {
            filter.genre = genre;
        }

        const queryBuilder = this.songRepository
            .createQueryBuilder('song')
            .leftJoinAndSelect('song.artist', 'artist')
            .leftJoinAndSelect('song.likes', 'likes')
            .where(filter)

        if (random) {
            queryBuilder.orderBy('RAND()').take(pageSize);
        } else {
            queryBuilder.orderBy(`song.${column}`, order).skip(skip).take(pageSize);
        }

        const [songs, totalItems] = await Promise.all([
            queryBuilder.getMany(),
            this.songRepository.count({ where: filter }),
        ]);

        return {
            meta: {
                current: current,
                pageSize: pageSize,
                totalItems
            },
            result: songs
        }
    }

    async update(id: string, updateSongDto: UpdateSongDto) {
        const song = await this.songRepository.findOne({
            where: { song_id: id },
        });

        if (!song) throw new BadRequestException('Song not found');

        if (song.thumbnail_url !== updateSongDto.thumbnail_url) {
            this.cloudinaryService.deleteFile(song.thumbnail_url);
        }

        if (song.file_url !== updateSongDto.file_url) {
            this.cloudinaryService.deleteFile(song.file_url);
        }

        await this.songRepository.update(
            { song_id: id },
            {
                ...updateSongDto,
                slug: replaceSlug(updateSongDto.title),
            }
        );

        return "Update song successfully";
    }

    async remove(id: string) {
        const result = await this.songRepository.update(
            { song_id: id },
            {
                is_deleted: true,
                deleted_at: new Date(),
            }
        );

        if (result.affected === 0)
            throw new BadRequestException('Song not found');

        return "Delete song successfully";
    }

    async toggleLike(user_id: string, song_id: string) {
        const song = await this.songRepository.findOne({
            where: { song_id },
            relations: {
                likes: true
            }
        });

        if (!song) throw new BadRequestException('Song not found');

        const existLike = song.likes.find(like => like.user_id === user_id);
        if (existLike) {
            await this.likeRepository.delete({
                user_id,
                song_id
            });
            return "Unlike song successfully";
        }

        const newLike = new LikeSong.Like({
            user_id,
            song_id,
            liked_at: new Date()
        });
        await this.likeRepository.save(newLike);
        return "Like song successfully";
    }
}
