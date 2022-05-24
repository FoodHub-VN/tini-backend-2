import { Category, CategoryModel } from "../database/model/category.model";
import { Observable } from "rxjs";
import { EnterpriseModel } from '../database/model/enterprise.model';
export declare class CommonService {
    private categoryModel;
    private enterpriseModel;
    constructor(categoryModel: CategoryModel, enterpriseModel: EnterpriseModel);
    getCategories(): Observable<Category[]>;
    getEnterpriseInfo(enterpriseId: string): Promise<import("../database/model/enterprise.model").Enterprise>;
}
