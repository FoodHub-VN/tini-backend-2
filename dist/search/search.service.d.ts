import { Service, ServiceModel } from "../database/model/service.model";
import { IntroductionModel } from "../database/model/introduction.model";
import { Observable } from "rxjs";
import { Filter } from "./interface/filter.interface";
export declare class SearchService {
    private serviceModel;
    private introductionModel;
    constructor(serviceModel: ServiceModel, introductionModel: IntroductionModel);
    quickSearch(textSearch: string): Observable<any>;
    deepSearch(textSearch: string, filter: Filter): Promise<Service[]>;
}
