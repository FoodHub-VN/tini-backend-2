import { BadRequestException, Controller, Get, HttpStatus, Query, Req, Res } from "@nestjs/common";
import { SearchService } from "./search.service";
import { Response } from "express";
import { from, map, Observable } from "rxjs";
import { Filter } from "./interface/filter.interface";
import { AuthenticatedRequest } from "../auth/interface/authenticated-request.interface";
import { UserPrincipal } from "../auth/interface/user-principal";

@Controller("search")
export class SearchController {
  constructor(
    private readonly searchService: SearchService
  ) {
  }

  @Get()
  search(@Res() res: Response,
         @Query("text") searchText: string,
         @Query("category") category: string,
         @Query("quan") quan: string,
         @Query("huyen") huyen: string,
         @Query('page') page: number,
         @Query('rating') rating: number,
         @Req() req: AuthenticatedRequest<UserPrincipal>
  ): Observable<Response> {
    let filter: Filter = {};
    category && (filter.category = category.toString());
    quan && (filter.quan = quan.toString());
    huyen && (filter.huyen = huyen.toString());
    rating && rating!==-1 && (filter.rating = rating);
    return from(this.searchService.deepSearch(searchText, filter, page))
      .pipe(
        map((services) => {
          if (services) {
            return res.status(HttpStatus.OK).send({
              searchText: searchText,
              ...services
            });
          } else {
            throw new BadRequestException();
            }
          })
        )
  }
}
