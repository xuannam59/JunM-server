import { detectResourceType, detectResourceTypeFromUrl, getPublicIdFromUrl, getTransformations } from '@/helpers/cloudinary.helper';
import { replaceSlug } from '@/helpers/replaceSlug.helper';
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
    uploadFile(
        file: Express.Multer.File,
        folderName: string
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        const originalName = file.originalname.split('.')[0];
        const uniqueFilename = `${replaceSlug(originalName)}-${Date.now()}`;

        const resourceType = detectResourceType(file.mimetype);

        return new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                folder: folderName ?? "default",
                public_id: uniqueFilename,
                resource_type: resourceType,
                transformation: getTransformations(resourceType),
            },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    async deleteFile(url: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        const publicId = getPublicIdFromUrl(url);
        const resourceType = detectResourceTypeFromUrl(url);

        return new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve, reject) => {
            cloudinary.uploader.destroy(
                publicId,
                { resource_type: resourceType },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );
        });
    }

}