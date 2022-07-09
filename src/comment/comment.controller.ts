import {BadRequestException, Body, Controller, HttpStatus, Post, Req, Res, UseGuards} from '@nestjs/common';
import {CommentService} from "./comment.service";
import {Response} from "express";
import {GetAllCommentDto} from "./dto/get-all-comment.dto";
import {Types} from "mongoose";
import {PostCommentDto} from "./dto/post-comment.dto";
import {TiniGuard} from "../auth/guard/tini.guard";
import {ApiBearerAuth} from "@nestjs/swagger";
import {AuthReqInterface} from "../auth/interface/auth-req.interface";


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

    @UseGuards(TiniGuard)
    @ApiBearerAuth()
    @Post('post/post-comment')
    async postComment(@Res() res: Response,
                      @Req() req: AuthReqInterface,
                      @Body() body: PostCommentDto) {
        try {
            await this.commentService.createComment(req.user.customer_id, body.postId, body.title, body.content);
            return res.status(HttpStatus.OK).send();
        } catch (e) {
            throw new BadRequestException();
        }
    }
}
