import {BadRequestException, Body, Controller, HttpStatus, Post, Res} from '@nestjs/common';
import {SearchService} from "./search.service";
import {SearchUserByNameDto} from "./dto/search-user-by-name.dto";
import {SearchUserByIdDto} from "./dto/search-user-by-id.dto";
import {Response} from "express";
import {SearchVendorByLatLngDto} from "./dto/search-vendor-by-lat-lng.dto";
import {SearchByKeywordsDto} from "./dto/search-by-keywords.dto";

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {
    }

    @Post('/by-keywords')
    async searchByKeywords(@Res() res: Response,
                           @Body() req: SearchByKeywordsDto) {
        try {
            const users = await this.searchService.fetchManyUsersWithName(req.keywords, req.limit || 5);
            const posts = await this.searchService.fetchBestPostsContainingKeywords(req.keywords, req.limit || 5);
            const dishes = await this.searchService.fetchBestDishesContainingKeywords(req.keywords, req.limit || 5);
            return res.status(HttpStatus.OK).send({users, posts, dishes});
        } catch (e) {
            throw new BadRequestException();
        }
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
                              @Body() req: SearchByKeywordsDto) {
        try {
            const posts = await this.searchService.fetchBestPostsContainingKeywords(req.keywords, req.limit || 5);
            return res.status(HttpStatus.OK).send({posts});
        } catch (e) {
            throw new BadRequestException();
        }
    }

    @Post('/merchant/by-lat-lng')
    async searchMerchantByLatLng(@Res() res: Response,
                                 @Body() req: SearchVendorByLatLngDto) {
        try {
            const merchants = await this.searchService.fetchMerchantsNearLatLng(req.lat, req.lng, req.radius);
            return res.status(HttpStatus.OK).send({merchants});
        } catch (e) {
            throw new BadRequestException();
        }
    }

    @Post('/food-matcher')
    async searchFoodUsingFoodMatcher(@Res() res: Response,
                                     @Body() req: SearchVendorByLatLngDto) {
        try {
            const dishes = await this.searchService.fetchFoodUsingFoodMatcher(req.lat, req.lng, req.radius);
            return res.status(HttpStatus.OK).send({dishes});
        } catch (e) {
            throw new BadRequestException();
        }
    }
}
