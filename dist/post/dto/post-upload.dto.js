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
class PostUploadDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Array,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], PostUploadDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PostUploadDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PostUploadDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Array,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], PostUploadDto.prototype, "hashtag", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PostUploadDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostUploadDto.prototype, "lat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostUploadDto.prototype, "lng", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostUploadDto.prototype, "locationName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostUploadDto.prototype, "locationId", void 0);
exports.PostUploadDto = PostUploadDto;
//# sourceMappingURL=post-upload.dto.js.map