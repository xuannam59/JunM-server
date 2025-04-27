import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { replaceSlug } from '@/helpers/replaceSlug.helper';
import { IUser } from '@/interfaces/user.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
    constructor(
        @InjectRepository(Artist) private artistRepository: Repository<Artist>,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async create(createArtistDto: CreateArtistDto, user: IUser) {
        const artist = new Artist({
            ...createArtistDto,
            slug: replaceSlug(createArtistDto.artist_name),
            posted_by: user.user_id
        });

        await this.artistRepository.save(artist);
        return artist;
    }

    async findAll(query: Record<string, string>) {
        const params = new URLSearchParams(query);
        const current = +params.get('current') || 1;
        const pageSize = +params.get('pageSize') || 10;
        const skip = (current - 1) * pageSize;
        const sort = params.get('sort') || '-created_at';
        const searchText = params.get('search') || '';

        const column = sort.startsWith('-') ? sort.slice(1) : sort;
        const order = sort.startsWith('-') ? 'DESC' : 'ASC';


        let filter: any = {}

        if (searchText) {
            filter.slug = Like(`%${searchText}%`);
        }

        const users = await this.artistRepository.find({
            where: filter,
            take: pageSize,
            skip,
            order: {
                [column]: order,
            },
            relations: {
                follows: true,
                songs: true,
                albums: true,
                videos: true,
            }
        })

        const totalItems = await this.artistRepository.count({ where: filter });

        return {
            meta: {
                current: current,
                pageSize: pageSize,
                totalItems
            },
            result: users
        }
    }

    async update(id: string, updateArtistDto: UpdateArtistDto) {
        const result = await this.artistRepository.update(
            { artist_id: id },
            {
                ...updateArtistDto,
                slug: replaceSlug(updateArtistDto.artist_name)
            }
        )

        if (result.affected === 0) {
            throw new BadRequestException("Artist not found");
        }

        return "Artist updated successfully"
    }

    async remove(id: string) {
        const artist = await this.artistRepository.findOne({
            where: { artist_id: id },
        });
        if (artist.avatar)
            this.cloudinaryService.deleteFile(artist.avatar);

        if (!artist) {
            throw new BadRequestException("Artist not found");
        }

        await this.artistRepository.delete({ artist_id: id });

        return "Artist deleted successfully";
    }
}
