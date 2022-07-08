import {BadRequestException, Body, Controller, HttpStatus, Post, Res} from '@nestjs/common';
import {SearchService} from "./search.service";
import {SearchUserByNameDto} from "./dto/search-user-by-name.dto";
import {SearchUserByIdDto} from "./dto/search-user-by-id.dto";
import {SearchPostByKeywordsDto} from "./dto/search-post-by-keywords.dto";
import {Response} from "express";

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {
    }

    @Post('/user/by-name')
    async searchUserByName(@Res() res: Response,
                           @Body() req: SearchUserByNameDto) {
        try {
            const users = await this.searchService.fetchManyUsersWithName(req.name, req.limit || 5);
            return res.status(HttpStatus.OK).send({users});
        } catch (e) {
            throw new BadRequestException();
        }
    }

    @Post('/user/by-id')
    async searchUserById(@Res() res: Response,
                         @Body() req: SearchUserByIdDto) {
        try {
            const user = await this.searchService.fetchUserWithUsername(req.id);
            return res.status(HttpStatus.OK).send({user: [user]});
        } catch (e) {
            throw new BadRequestException();
        }
    }

    @Post('/post/by-keyword')
    async searchPostByKeyword(@Res() res: Response,
                              @Body() req: SearchPostByKeywordsDto) {
        try {
            const posts = await this.searchService.fetchBestPostsContainingKeywords(req.keywords, req.limit || 5);
            return res.status(HttpStatus.OK).send({posts});
        } catch (e) {
            throw new BadRequestException();
        }
    }

    @Post('/vendor/by-lat-lng')
    async searchVendorByLatLng() {
        return "hello";
    }
}
