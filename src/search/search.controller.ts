import {Body, Controller, Get, Post} from '@nestjs/common';
import {SearchService} from "./search.service";
import {SearchUserByNameDto} from "./dto/search-user-by-name.dto";
import {SearchUserByIdDto} from "./dto/search-user-by-id.dto";
import {User} from "../database/model/user.model";
import {SearchPostByKeywordsDto} from "./dto/search-post-by-keywords.dto";

@Controller('search')
export class SearchController {
    constructor(private readonly searchService:SearchService) {
    }

    @Post('/user/by-name')
    async searchUserByName(@Body() req: SearchUserByNameDto): Promise<User[]>{
        return await this.searchService.fetchManyUsersWithName(req.name, req.limit || 5);
    }

    @Post('/user/by-id')
    async searchUserById(@Body() req: SearchUserByIdDto): Promise<User>{
        return await this.searchService.fetchUserWithUsername(req.id);
    }

    @Post('/post/by-keyword')
    async searchPostByKeyword(@Body() req: SearchPostByKeywordsDto) {
        return await this.searchService.fetchBestPostsContainingKeywords(req.keywords, req.limit || 5);
    }

    @Post('/vendor/by-lat-lng')
    async searchVendorByLatLng(){
        return "hello";
    }
}
