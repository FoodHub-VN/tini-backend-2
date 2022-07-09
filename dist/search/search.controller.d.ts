import { SearchService } from "./search.service";
import { SearchUserByNameDto } from "./dto/search-user-by-name.dto";
import { SearchUserByIdDto } from "./dto/search-user-by-id.dto";
import { Response } from "express";
import { SearchVendorByLatLngDto } from "./dto/search-vendor-by-lat-lng.dto";
import { SearchByKeywordsDto } from "./dto/search-by-keywords.dto";
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    searchByKeywords(res: Response, req: SearchByKeywordsDto): Promise<Response<any, Record<string, any>>>;
    searchUserByName(res: Response, req: SearchUserByNameDto): Promise<Response<any, Record<string, any>>>;
    searchUserById(res: Response, req: SearchUserByIdDto): Promise<Response<any, Record<string, any>>>;
    searchPostByKeyword(res: Response, req: SearchByKeywordsDto): Promise<Response<any, Record<string, any>>>;
    searchMerchantByLatLng(res: Response, req: SearchVendorByLatLngDto): Promise<Response<any, Record<string, any>>>;
    searchFoodUsingFoodMatcher(res: Response, req: SearchVendorByLatLngDto): Promise<Response<any, Record<string, any>>>;
}
