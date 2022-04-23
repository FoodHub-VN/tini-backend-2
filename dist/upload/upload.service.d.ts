/// <reference types="multer" />
/// <reference types="node" />
import { S3 } from "aws-sdk";
import { ConfigService } from "@nestjs/config";
import { ManagedUpload } from "aws-sdk/lib/s3/managed_upload";
import { DeleteObjectOutput } from "aws-sdk/clients/s3";
import { FileUploaded } from "./interface/upload.interface";
import SendData = ManagedUpload.SendData;
export declare class FileUploadService {
    private readonly configService;
    private s3;
    constructor(configService: ConfigService);
    upload(file: Express.Multer.File, isPublic?: boolean): Promise<FileUploaded>;
    delete(key: string): Promise<any>;
    deleteMulti(keys: string[]): Promise<any>;
    uploadS3(file: Buffer, bucket: any, name: any, isPublic?: boolean): Promise<SendData>;
    deleteS3(bucket: string, key: string): Promise<DeleteObjectOutput>;
    deleteS3Multi(bucket: string, keys: string[]): Promise<DeleteObjectOutput>;
    getS3(): S3;
}
