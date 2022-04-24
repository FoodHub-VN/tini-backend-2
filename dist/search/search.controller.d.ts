import { SearchService } from "./search.service";
import { Response } from "express";
import { Observable } from "rxjs";
import { AuthenticatedRequest } from "../auth/interface/authenticated-request.interface";
import { UserPrincipal } from "../auth/interface/user-principal";
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(res: Response, searchText: string, category: string, quan: string, huyen: string, req: AuthenticatedRequest<UserPrincipal>): Observable<Response>;
}
