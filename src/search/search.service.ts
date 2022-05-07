import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { INTRODUCTION_MODEL, SERVICE_MODEL } from "../database/database.constants";
import { Service, ServiceModel } from "../database/model/service.model";
import { IntroductionModel } from "../database/model/introduction.model";
import { from, Observable } from "rxjs";
import { Filter } from "./interface/filter.interface";
import { Types } from "mongoose";

@Injectable()
export class SearchService {
  constructor(
    @Inject(SERVICE_MODEL) private serviceModel: ServiceModel,
    @Inject(INTRODUCTION_MODEL) private introductionModel: IntroductionModel
  ) {
  }
  quickSearch(textSearch: string): Observable<any> {
    const result: Array<any> = [];
    if(textSearch && textSearch.length > 2) {
      return from(this.serviceModel
        .find({
            $text: {
              $search: textSearch
            }
          },
          { score: { $meta: "textScore" } })
        .sort({rankingPoint: 'desc'})
        .populate("category")
        .exec()
      );
    }
    else{
      return from(this.serviceModel.find().populate("category").sort({rankingPoint: 'desc'}).exec());
    }

  }

  async deepSearch(textSearch: string, filter: Filter, page: number|undefined){
    if(filter.category && !Types.ObjectId.isValid(filter.category)){
      throw new NotFoundException("Category not found: " + filter.category);
    }
    try {
      let services: Array<Service> = [];
      let condition: any = {};
      let resultPerPage = 12;
      page = page || 1;
      filter.category && (condition['category'] = Types.ObjectId(filter.category));
      filter.quan && (condition['address.district'] = filter.quan);
      filter.huyen && (condition['address.village'] = filter.huyen);

      let totalPage = 1;
      if (textSearch && textSearch.length > 0) {
        services = await this.serviceModel.find({
          $text: {
            $search: textSearch
          }
          ,
          ...condition
        }).sort({rankingPoint: 'desc'})
          .skip((page-1)*resultPerPage)
          .limit(resultPerPage)
          .populate("category")
          .exec();
        totalPage = await this.serviceModel.find({
          $text: {
            $search: textSearch
          },
          ...condition
        }).countDocuments().exec() / resultPerPage;
      } else {
        services = await this.serviceModel.find({ ...condition } , null).sort({rankingPoint: 'desc'}).skip((page-1)*resultPerPage).limit(resultPerPage).populate("category").exec();
        totalPage = await this.serviceModel.find({ ...condition } , null).countDocuments().exec() / resultPerPage;
      }
      return { services, totalPage: Math.ceil(totalPage), page };
    }
    catch (e) {
      console.log(e);
      throw e;
    }
  }
}
