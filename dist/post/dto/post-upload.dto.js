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
exports.PostUploadDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const mongoose_1 = require("mongoose");
class PostUploadDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PostUploadDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], PostUploadDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PostUploadDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Date,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PostUploadDto.prototype, "openTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Date,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PostUploadDto.prototype, "closeTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: mongoose_1.Types.ObjectId,
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PostUploadDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: false,
    }),
    __metadata("design:type", Number)
], PostUploadDto.prototype, "maxPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: false,
    }),
    __metadata("design:type", Number)
], PostUploadDto.prototype, "minPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        return JSON.parse(value);
    }),
    (0, class_transformer_1.Type)(() => Array),
    __metadata("design:type", Array)
], PostUploadDto.prototype, "removeImg", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        required: false,
    }),
    __metadata("design:type", String)
], PostUploadDto.prototype, "introduction", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        required: false,
    }),
    __metadata("design:type", String)
], PostUploadDto.prototype, "shortIntroduction", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        required: true,
    }),
    __metadata("design:type", Boolean)
], PostUploadDto.prototype, "enableSchedule", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
    }),
    __metadata("design:type", Number)
], PostUploadDto.prototype, "scheduleAllowedPerHour", void 0);
exports.PostUploadDto = PostUploadDto;
//# sourceMappingURL=post-upload.dto.js.map