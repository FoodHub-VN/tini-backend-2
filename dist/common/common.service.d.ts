import { Category, CategoryModel } from "../database/model/category.model";
import { Observable } from "rxjs";
export declare class CommonService {
    private categoryModel;
    constructor(categoryModel: CategoryModel);
    getCategories(): Observable<Category[]>;
}
