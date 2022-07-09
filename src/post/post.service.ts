import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { POST_MODEL } from '../database/database.constants';
import { Post, PostModel } from '../database/model/post.model';
import { PostUploadDto } from './dto/post-upload.dto';
import { FileUploadService } from '../upload/upload.service';
import { AuthReqInterface } from '../auth/interface/auth-req.interface';

@Injectable()
export class PostService {
  constructor(@Inject(POST_MODEL) private postModel: PostModel,
              private readonly uploadService: FileUploadService
              ) {
  }

  async uploadPost(body: PostUploadDto, req: AuthReqInterface): Promise<any> {
    try{
      // let promise: Array<Promise<FileUploaded>> = [];
      // let imageUploadeds: Array<FileUploaded> = [];
      // if(_images.length > 0) {
      //   _images.map(image => {
      //     promise.push(this.uploadService.upload(image));
      //   })
      //   imageUploadeds = await Promise.all<FileUploaded>(promise);
      // }
      // let {images, ..._body} = body;
      await this.postModel.create({owner: req.user.customer_id, ...body});
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

  async upVote(req: AuthReqInterface, postId: string){
    try {
      let post: Post = await this.postModel.findOne({ _id: postId });
      if (!post) {
        throw new NotFoundException('Post not found!');
      }
      var update: any = {};
      let isDirty = false;

      if (post.downVotedBy.includes(req.user.customer_id)) {
        update.downVotedBy = post.downVotedBy.filter((e) => e != req.user.customer_id);
        isDirty = true;
      }
      if (!post.upVotedBy.includes(req.user.customer_id)) {
        update.upVotedBy = post.upVotedBy || [];
        update.upVotedBy.push(req.user.customer_id);
        isDirty = true;
      }

      if (isDirty) {
        return await this.postModel.findOneAndUpdate({ _id: postId }, { ...update }, { new: true, lean: true }).exec();
      }
      return post;
    } catch (e) {
      throw  e;
    }
  }

  async downVote(req: AuthReqInterface, postId: string){
    try {
      let post: Post = await this.postModel.findOne({ _id: postId });
      if (!post) {
        throw new NotFoundException('Post not found!');
      }
      var update: any = {};
      let isDirty = false;

      if (post.upVotedBy.includes(req.user.customer_id)) {
        update.upVotedBy = post.upVotedBy.filter((e) => e != req.user.customer_id);
        isDirty = true;
      }
      if (!post.downVotedBy.includes(req.user.customer_id)) {
        update.downVotedBy = post.downVotedBy || [];
        update.downVotedBy.push(req.user.customer_id);
        isDirty = true;
      }

      if (isDirty) {
        return await this.postModel.findOneAndUpdate({ _id: postId }, { ...update }, { new: true, lean: true }).exec();
      }
      return post;
    } catch (e) {
      throw  e;
    }
  }
}
