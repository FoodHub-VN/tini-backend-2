import {BadRequestException, Body, Controller, HttpStatus, Post, Res} from '@nestjs/common';
import {CommentService} from "./comment.service";
import {Response} from "express";
import {GetAllCommentDto} from "./dto/get-all-comment.dto";
import {Types} from "mongoose";


@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {
    }

    @Post('post/get-all-comment')
    async getAllComments(@Res() res: Response,
                         @Body() req: GetAllCommentDto) {
        try {
            const comments = await Promise.all(await this.commentService.fetchManyComments(req.id, req.limit || 5));
            return res.status(HttpStatus.OK).send({
                post: req.id,
                comments,
            });
        } catch (e) {
            throw new BadRequestException();
        }
    }

}
