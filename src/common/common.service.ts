import { Inject, Injectable } from "@nestjs/common";
import { CATEGORY_MODEL } from "../database/database.constants";
import { Category, CategoryModel } from "../database/model/category.model";
import { from, Observable } from "rxjs";

@Injectable()
export class CommonService {
  constructor(
    @Inject(CATEGORY_MODEL) private categoryModel: CategoryModel
  ) {
  }

  getCategories():Observable<Category[]>{
    return from(this.categoryModel.find().exec());
  }
}
