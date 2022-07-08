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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const database_constants_1 = require("../database/database.constants");
let SearchService = class SearchService {
    constructor(userModel, postModel) {
        this.userModel = userModel;
        this.postModel = postModel;
    }
    async fetchManyUsersWithName(customerName, limit) {
        return this.userModel.find({ customerName }, { _id: 0 }).limit(limit).exec();
    }
    async fetchUserWithUsername(id) {
        return this.userModel.findOne({ id }, { _id: 0 }).exec();
    }
    async fetchBestPostsContainingKeywords(keywords, limit) {
        return this.postModel
            .find({ $text: { $search: keywords } }, { _id: 0 })
            .sort({ score: { $meta: "textScore" } })
            .limit(limit)
            .exec();
    }
    async fetchVendorsNearLatLng(lat, lng, radius) {
        return this.userModel
            .find({
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [lng, lat]
                },
                $maxDistance: radius,
            },
        }, { _id: 0 })
            .exec();
    }
};
SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_constants_1.USER_MODEL)),
    __param(1, (0, common_1.Inject)(database_constants_1.POST_MODEL)),
    __metadata("design:paramtypes", [Object, Object])
], SearchService);
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map