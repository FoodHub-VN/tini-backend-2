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
    constructor(merchantModel, userModel, postModel) {
        this.merchantModel = merchantModel;
        this.userModel = userModel;
        this.postModel = postModel;
    }
    async fetchManyUsersWithName(customerName, limit) {
        return this.userModel.find({ customerName }).limit(limit).exec();
    }
    async fetchUserWithUsername(id) {
        return this.userModel.findById(id, { _id: 1, customerName: 1, post: 1 }).exec();
    }
    async fetchBestDishesContainingKeywords(keywords, limit) {
        const merchants = await this.merchantModel.find();
        const setKeyword = new Set(keywords.split(/\s/).map(s => s.toLowerCase()));
        const dishes = [];
        for (let merchant of merchants) {
            for (let dish of merchant.dishes) {
                let score = 0;
                for (let keyword of setKeyword) {
                    if (dish.dishName.includes(keyword))
                        score += dish.dishName.length;
                }
                const dishDescriptiveWords = dish.description.split(/\s/).map(s => s.toLowerCase());
                for (let keyword of setKeyword) {
                    score += 0.1 * Math.max(0, ...dishDescriptiveWords.filter(word => word.includes(keyword)).map(word => word.length));
                }
                dishes.push({ dish, score });
            }
        }
        dishes.sort((a, b) => b.score - a.score);
        return dishes.slice(0, limit);
    }
    async fetchBestPostsContainingKeywords(keywords, limit) {
        const posts = await this.postModel.find();
        const setKeyword = new Set(keywords.split(/\s/).map(s => s.toLowerCase()));
        for (let post of posts) {
            let score = 0;
            for (let keyword of setKeyword) {
                if (post.title.includes(keyword))
                    score += post.title.length;
            }
            const dishDescriptiveWords = post.content.split(/\s/).map(s => s.toLowerCase());
            for (let keyword of setKeyword) {
                score += 0.1 * Math.max(0, ...dishDescriptiveWords.filter(word => word.includes(keyword)).map(word => word.length));
            }
            post._score = score;
        }
        posts.sort((a, b) => b._score - a._score);
        return posts.slice(0, limit);
    }
    async fetchMerchantsNearLatLng(lat, lng, radius) {
        return this.merchantModel
            .find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat],
                    },
                    $maxDistance: radius,
                },
            }
        })
            .exec();
    }
    async fetchFoodUsingFoodMatcher(lat, lng, radius) {
        const merchants = await this.fetchMerchantsNearLatLng(lat, lng, radius);
        const dishes = merchants.map(merchant => merchant.dishes).flat();
        const results = [];
        for (let i = Math.min(dishes.length, 10); i > 0; i--) {
            const idx = Math.floor(Math.random() * dishes.length);
            const temp = dishes[idx];
            dishes[idx] = dishes[dishes.length - 1];
            dishes[dishes.length - 1] = temp;
            results.push(dishes.pop());
        }
        return results;
    }
};
SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_constants_1.MERCHANT_MODEL)),
    __param(1, (0, common_1.Inject)(database_constants_1.USER_MODEL)),
    __param(2, (0, common_1.Inject)(database_constants_1.POST_MODEL)),
    __metadata("design:paramtypes", [Object, Object, Object])
], SearchService);
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map