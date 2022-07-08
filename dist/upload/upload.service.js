"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadService = void 0;
const common_1 = require("@nestjs/common");
const aws_sdk_1 = require("aws-sdk");
const config_1 = require("@nestjs/config");
const bucketS3 = "foodhub-pro";
let FileUploadService = class FileUploadService {
    constructor(configService) {
        this.configService = configService;
        this.s3 = null;
    }
    async upload(file, isPublic = true) {
        try {
            const { originalname } = file;
            const fileName = Date.now().toString() + "_" + originalname;
            const res = await this.uploadS3(file.buffer, bucketS3, fileName, isPublic);
            return { url: res.Location, key: res.Key };
        }
        catch (err) {
            throw err;
        }
    }
    async delete(key) {
        try {
            await this.deleteS3(bucketS3, key);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    async deleteMulti(keys) {
        try {
            await this.deleteS3Multi(bucketS3, keys);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    async uploadS3(file, bucket, name, isPublic = true) {
        const s3 = this.getS3();
        const params = {
            Bucket: bucket,
            Key: String(name),
            Body: file,
            ACL: isPublic ? "public-read" : "private"
        };
        return new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
                if (err) {
                    reject(err.message);
                }
                resolve(data);
            });
        });
    }
    async deleteS3(bucket, key) {
        const params = {
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
    async deleteS3Multi(bucket, keys) {
        const mapDelete = keys.map(k => ({ Key: k }));
        const params = {
            Bucket: bucket,
            Delete: {
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
            try {
                this.s3 = new aws_sdk_1.S3({
                    accessKeyId: this.configService.get("AWS_ACCESS_KEY_ID"),
                    secretAccessKey: this.configService.get("AWS_SECRET_ACCESS_KEY")
                });
            }
            catch (e) {
                console.log("Loi", e);
            }
        }
        return this.s3;
    }
};
FileUploadService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FileUploadService);
exports.FileUploadService = FileUploadService;
//# sourceMappingURL=upload.service.js.map