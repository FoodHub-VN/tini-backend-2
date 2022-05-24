import { Inject, Injectable } from "@nestjs/common";
import { CATEGORY_MODEL, ENTERPRISE_MODEL } from '../database/database.constants';
import { Category, CategoryModel } from "../database/model/category.model";
import { from, Observable } from "rxjs";
import { EnterpriseModel } from '../database/model/enterprise.model';
import { Types } from 'mongoose';

@Injectable()
export class CommonService {
  constructor(
    @Inject(CATEGORY_MODEL) private categoryModel: CategoryModel,
    @Inject(ENTERPRISE_MODEL) private enterpriseModel: EnterpriseModel

  ) {
  }

  getCategories():Observable<Category[]>{
    return from(this.categoryModel.find().exec());
  }

  async getEnterpriseInfo(enterpriseId: string){
    let enterprise = await this.enterpriseModel.findOne({_id: Types.ObjectId(enterpriseId)}).exec();
    return enterprise;
  }
}
