import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { CATEGORY_MODEL } from "../database/database.constants";
import { CategoryModel } from "../database/model/category.model";
import { from, map, mergeMap, Observable } from "rxjs";

@Injectable()
export class AdminService {
  constructor(
    @Inject(CATEGORY_MODEL) private categoryModel: CategoryModel
  ) {

  }

  addCategory(category: string): Observable<boolean> {
    return from(this.categoryModel.exists({ category: category })).pipe(
      mergeMap((res) => {
        if (res) {
          throw new ConflictException("Category had already added!");
        } else {
          return from(this.categoryModel.create({ category: category })).pipe(
            map((category) => {
              return category != null;
            })
          );
        }

      })
    );
  }
}
