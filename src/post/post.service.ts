import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { POST_MODEL } from '../database/database.constants';
import { PostModel } from '../database/model/post.model';
import { PostUploadDto } from './dto/post-upload.dto';
import { FileUploadService } from '../upload/upload.service';
import { FileUploaded } from '../upload/interface/upload.interface';
import { AuthReqInterface } from '../auth/interface/auth-req.interface';

@Injectable()
export class PostService {
  constructor(@Inject(POST_MODEL) private postModel: PostModel,
              private readonly uploadService: FileUploadService
              ) {
  }

  async uploadPost(body: PostUploadDto, _images: Array<Express.Multer.File>, req: AuthReqInterface): Promise<any> {
    try{
      let promise: Array<Promise<FileUploaded>> = [];
      let imageUploadeds: Array<FileUploaded> = [];
      if(_images.length > 0) {
        _images.map(image => {
          promise.push(this.uploadService.upload(image));
        })
        imageUploadeds = await Promise.all<FileUploaded>(promise);
      }
      let {images, ..._body} = body;
      await this.postModel.create({owner: req.user.customer_id, ..._body, images: imageUploadeds});
      return;
    }
    catch (e){
      console.log(e);
      throw new BadRequestException("Wrong!!");
    }

    // let fileUploadeds: Array<FileUploaded> = await this.uploadService.upload(images);
    // this.uploadService.upload()
  }

  async getAllPost(): Promise<any>{
    let posts = await this.postModel.find().populate(['owner']).exec();
    return posts;
  }
}
