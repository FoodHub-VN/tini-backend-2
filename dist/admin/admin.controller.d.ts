import { Response } from "express";
import { AdminService } from "./admin.service";
import { Observable } from "rxjs";
import { AddCategoryDto } from "./dto/add-category.dto";
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    addCategory(data: AddCategoryDto, res: Response): Observable<Response>;
}
