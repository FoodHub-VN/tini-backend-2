import { Injectable, Scope } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { ConfigService } from "@nestjs/config";
import { ManagedUpload } from "aws-sdk/lib/s3/managed_upload";
import {
  DeleteObjectOutput,
  DeleteObjectRequest,
  DeleteObjectsRequest, ObjectIdentifier,
  ObjectIdentifierList
} from "aws-sdk/clients/s3";
import { FileUploaded } from "./interface/upload.interface";
import SendData = ManagedUpload.SendData;

const bucketS3 = "bk-service";

@Injectable({scope: Scope.REQUEST})
export class FileUploadService {
  private s3: S3 = null;

  constructor(
    private readonly configService: ConfigService
  ) {
  }

  async upload(file: Express.Multer.File, isPublic = true): Promise<FileUploaded> {
    try {
      const { originalname } = file;
      const fileName = Date.now().toString() + "_" + originalname;
      const res: SendData = await this.uploadS3(file.buffer, bucketS3, fileName, isPublic);
      return { url: res.Location, key: res.Key } as FileUploaded;
    } catch (err) {
      throw err;
    }
  }

  async delete(key: string): Promise<any> {
    try {
      await this.deleteS3(bucketS3, key);
      return true;
    } catch (err) {
      throw err;
    }
  }


  async deleteMulti(keys: string[]): Promise<any> {
    try {
      await this.deleteS3Multi(bucketS3, keys);
      return true;
    } catch (err) {
      throw err;
    }
  }

  async uploadS3(file: Buffer, bucket, name, isPublic = true): Promise<SendData> {
    const s3 = this.getS3();
    const params: S3.Types.PutObjectRequest = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: isPublic ? "public-read" : "private"
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data: SendData) => {
        if (err) {
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  async deleteS3(bucket: string, key: string): Promise<DeleteObjectOutput> {
    const params: DeleteObjectRequest = {
      Bucket: bucket,
      Key: key
    };
    const s3 = this.getS3();
    return new Promise((resolve, reject) => {
      s3.deleteObject(params, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }


  async deleteS3Multi(bucket: string, keys: string[]): Promise<DeleteObjectOutput> {
    const mapDelete: ObjectIdentifierList = keys.map(k => ({Key: k}));
    const params: DeleteObjectsRequest = {
      Bucket: bucket,
      Delete:{
        Objects: mapDelete
      }
    };
    const s3 = this.getS3();
    return new Promise((resolve, reject) => {
      s3.deleteObjects(params, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }
  getS3() {
    if (this.s3 == null) {
      this.s3 = new S3({
        accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY_ID"),
        secretAccessKey: this.configService.get<string>("AWS_SECRET_ACCESS_KEY")
      });
    }
    return this.s3;
  }

}