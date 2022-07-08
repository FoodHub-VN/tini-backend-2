import { SearchService } from "./search.service";
import { SearchUserByNameDto } from "./dto/search-user-by-name.dto";
import { SearchUserByIdDto } from "./dto/search-user-by-id.dto";
import { SearchPostByKeywordsDto } from "./dto/search-post-by-keywords.dto";
import { Response } from "express";
import { SearchVendorByLatLngDto } from "./dto/search-vendor-by-lat-lng.dto";
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    searchUserByName(res: Response, req: SearchUserByNameDto): Promise<Response<any, Record<string, any>>>;
    searchUserById(res: Response, req: SearchUserByIdDto): Promise<Response<any, Record<string, any>>>;
    searchPostByKeyword(res: Response, req: SearchPostByKeywordsDto): Promise<Response<any, Record<string, any>>>;
    searchVendorByLatLng(res: Response, req: SearchVendorByLatLngDto): Promise<Response<any, Record<string, any>>>;
}
