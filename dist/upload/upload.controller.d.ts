/// <reference types="multer" />
import { FileUploadService } from './upload.service';
import { Response } from 'express';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: FileUploadService);
    upload(file: Express.Multer.File, res: Response): Promise<Response>;
}
