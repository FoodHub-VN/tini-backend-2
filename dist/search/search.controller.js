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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const search_service_1 = require("./search.service");
const search_user_by_name_dto_1 = require("./dto/search-user-by-name.dto");
const search_user_by_id_dto_1 = require("./dto/search-user-by-id.dto");
const search_post_by_keywords_dto_1 = require("./dto/search-post-by-keywords.dto");
const search_vendor_by_lat_lng_dto_1 = require("./dto/search-vendor-by-lat-lng.dto");
let SearchController = class SearchController {
    constructor(searchService) {
        this.searchService = searchService;
    }
    async searchUserByName(res, req) {
        try {
            const users = await this.searchService.fetchManyUsersWithName(req.name, req.limit || 5);
            return res.status(common_1.HttpStatus.OK).send({ users });
        }
        catch (e) {
            throw new common_1.BadRequestException();
        }
    }
    async searchUserById(res, req) {
        try {
            const user = await this.searchService.fetchUserWithUsername(req.id);
            return res.status(common_1.HttpStatus.OK).send({ user: [user] });
        }
        catch (e) {
            throw new common_1.BadRequestException();
        }
    }
    async searchPostByKeyword(res, req) {
        try {
            const posts = await this.searchService.fetchBestPostsContainingKeywords(req.keywords, req.limit || 5);
            return res.status(common_1.HttpStatus.OK).send({ posts });
        }
        catch (e) {
            throw new common_1.BadRequestException();
        }
    }
    async searchVendorByLatLng(res, req) {
        try {
            const posts = await this.searchService.fetchVendorsNearLatLng(req.lat, req.lng, req.radius);
            return res.status(common_1.HttpStatus.OK).send({ posts });
        }
        catch (e) {
            throw new common_1.BadRequestException();
        }
    }
};
__decorate([
    (0, common_1.Post)('/user/by-name'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, search_user_by_name_dto_1.SearchUserByNameDto]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "searchUserByName", null);
__decorate([
    (0, common_1.Post)('/user/by-id'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, search_user_by_id_dto_1.SearchUserByIdDto]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "searchUserById", null);
__decorate([
    (0, common_1.Post)('/post/by-keyword'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, search_post_by_keywords_dto_1.SearchPostByKeywordsDto]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "searchPostByKeyword", null);
__decorate([
    (0, common_1.Post)('/vendor/by-lat-lng'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, search_vendor_by_lat_lng_dto_1.SearchVendorByLatLngDto]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "searchVendorByLatLng", null);
SearchController = __decorate([
    (0, common_1.Controller)('search'),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchController);
exports.SearchController = SearchController;
//# sourceMappingURL=search.controller.js.map