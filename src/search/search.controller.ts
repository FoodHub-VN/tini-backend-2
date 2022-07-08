import {Controller, Post} from '@nestjs/common';
import {SearchService} from "./search.service";

@Controller('search')
export class SearchController {
    constructor(private readonly searchService:SearchService) {
    }

    @Post('test')
    test(){
        return "hello";
    }
}
