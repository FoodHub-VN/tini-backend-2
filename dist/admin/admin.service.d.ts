import { CategoryModel } from "../database/model/category.model";
import { Observable } from "rxjs";
export declare class AdminService {
    private categoryModel;
    constructor(categoryModel: CategoryModel);
    addCategory(category: string): Observable<boolean>;
}
