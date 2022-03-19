import { BadRequestException, Body, Controller, Get, HttpStatus, NotFoundException, Query, Res } from "@nestjs/common";
import { SearchService } from "./search.service";
import { QuickSearchDto } from "./quick-search.dto";
import { Response } from "express";
import { delay, from, map, Observable } from "rxjs";
import { Public } from "../auth/guard/public.guard.decorator";

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService
  ) {
  }

  @Get()
  quickSearch(@Query('text') searchText, @Res() res: Response): Observable<Response> {
      return from(this.searchService.quickSearch(searchText))
        .pipe(
          map((services)=>{
            if(services){
              return res.status(HttpStatus.OK).send({
                searchText: searchText,
                services: services
              })
            }
            else{
              throw new BadRequestException();
            }
          })
        )
  }
}
