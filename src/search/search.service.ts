import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { INTRODUCTION_MODEL, SERVICE_MODEL } from "../database/database.constants";
import { Service, ServiceModel } from "../database/model/service.model";
import { IntroductionModel } from "../database/model/introduction.model";
import { from, Observable } from "rxjs";
import { Filter } from "./interface/filter.interface";
import { Address } from "../database/model/user.model";
import { FilterQuery, Types } from "mongoose";

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
        .sort({ score: { $meta: "textScore" } })
        .populate("category")
        .exec()
      );
    }
    else{
      return from(this.serviceModel.find().populate("category").exec());
    }

  }

  async deepSearch(textSearch: string, filter: Filter){
    if(filter.category && !Types.ObjectId.isValid(filter.category)){
      throw new NotFoundException("Category not found: " + filter.category);
    }
    try {
      let services: Array<Service> = [];
      let condition: any = {};

      filter.category && (condition['category'] = Types.ObjectId(filter.category));
      filter.quan && (condition['address.district'] = filter.quan);
      filter.huyen && (condition['address.village'] = filter.huyen);


      console.log(condition);
      if (textSearch && textSearch.length > 0) {
        services = await this.serviceModel.find({
          $text: {
            $search: textSearch
          },
          ...condition
        }).populate("category").exec();
      } else {
        console.log(condition);
        services = await this.serviceModel.find({ ...condition } , null).populate("category").exec();
      }
      return services;
    }
    catch (e) {
      console.log(e);
      throw e;
    }
  }
}
