import { Controller, HttpStatus, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './upload.service';
import { Response } from 'express';
import { ApiBody, ApiConsumes, ApiProperty } from '@nestjs/swagger';

@Controller()
export class UploadController {
  constructor(private readonly uploadService: FileUploadService) {
  }
  @Post('/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Res() res:Response): Promise<Response>{
    try{
      let fileUploaded = await this.uploadService.upload(file);
      return res.status(HttpStatus.OK).send(fileUploaded);
    }
    catch (e){
      throw e;
    }
  }
}
