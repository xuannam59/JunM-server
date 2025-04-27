import { BadGatewayException, Injectable } from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Injectable()
export class AppService {
  constructor(private readonly cloudinaryService: CloudinaryService) { }

  getHello(): string {
    return 'Hello World!';
  }

  // [POST] 
  async uploadFile(file: Express.Multer.File, folderName: string) {
    try {
      const link = await this.cloudinaryService.uploadFile(file, folderName);
      return {
        fileUpload: link.secure_url,
        publicId: link.public_id,
      };
    } catch (error) {
      throw new BadGatewayException("Error unable to upload file");
    }
  }

  // [DELETE]
  async deleteFile(fileUrl: string) {
    try {
      const result = await this.cloudinaryService.deleteFile(fileUrl);
      return {
        result,
      };
    } catch (error) {
      throw new BadGatewayException("Error unable to delete file");
    }
  }
}
