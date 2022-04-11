import { Inject, Injectable } from "@nestjs/common";
import { INTRODUCTION_MODEL, SERVICE_MODEL } from "../database/database.constants";
import { ServiceModel } from "../database/model/service.model";
import { IntroductionModel } from "../database/model/introduction.model";
import { from, Observable } from "rxjs";

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
}
