import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {

    private detectResourceType(mimeType: string): 'image' | 'video' | 'auto' {
        if (mimeType.startsWith('image/')) return 'image';
        if (mimeType.startsWith('video/')) return 'video';
        if (mimeType.startsWith('audio/')) return 'video'; // Cloudinary xử lý audio như video
        return 'auto';
    }

    private getTransformations(resourceType: string) {
        if (resourceType === 'image') {
            return [
                { crop: 'scale' },
                { fetch_format: 'auto' },
                { quality: 'auto' },
            ];
        }

        if (resourceType === 'video') {
            return [
                { fetch_format: 'auto' },
                { quality: 'auto' },
                { video_codec: 'auto' },
                { audio_codec: 'aac' },
                { width: 1280, crop: 'limit' }, // Scale video/audio nếu quá lớn
            ];
        }

        return undefined;
    }

    uploadFile(
        file: Express.Multer.File,
        folderName: string
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        const originalName = file.originalname.split('.')[0];
        const uniqueFilename = `${originalName}-${Date.now()}`;

        const resourceType = this.detectResourceType(file.mimetype);

        return new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                folder: folderName ?? "default",
                public_id: uniqueFilename,
                resource_type: resourceType,
                transformation: this.getTransformations(resourceType),
            },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    async deleteFile(publicId: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve, reject) => {
            cloudinary.uploader.destroy(
                publicId,
                { resource_type: 'auto' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );
        });
    }

}