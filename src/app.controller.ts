import { Body, Controller, Get, HttpStatus, ParseFilePipeBuilder, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { ResponseMessage } from './decorators/customize';
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get()
    @ResponseMessage("Get Hello World")
    getHello(): string {
        return this.appService.getHello();
    }

    @Post('file/upload')
    @ResponseMessage("Upload file")
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: /^(jpg|jpeg|image\/jpeg|png|image\/png|gif|txt|pdf|application\/pdf|doc|docx|application\/msword|text\/plain|)$/i,
                })
                .addMaxSizeValidator({
                    maxSize: 10 * 1024 * 1024, // 10MB
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
                }),
        ) file: Express.Multer.File,
        @Body('folder-name') folderName: string
    ) {
        return this.appService.uploadFile(file, folderName);
    }

    @Post('file/delete')
    @ResponseMessage("Delete file")
    deleteFile(@Body('fileUrl') fileUrl: string) {
        return this.appService.deleteFile(fileUrl);
    }
}
