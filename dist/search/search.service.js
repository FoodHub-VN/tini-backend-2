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
const rxjs_1 = require("rxjs");
const mongoose_1 = require("mongoose");
const DOWN = [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, 2, 4, 6, 8];
const UP = [Number.MAX_SAFE_INTEGER, 2, 4, 6, 8, Number.MAX_SAFE_INTEGER];
let SearchService = class SearchService {
    constructor(serviceModel, introductionModel) {
        this.serviceModel = serviceModel;
        this.introductionModel = introductionModel;
    }
    quickSearch(textSearch) {
        const result = [];
        if (textSearch && textSearch.length > 2) {
            return (0, rxjs_1.from)(this.serviceModel
                .find({
                $text: {
                    $search: textSearch,
                },
            }, { score: { $meta: 'textScore' } })
                .sort({ rankingPoint: 'desc' })
                .populate(['category', 'enterprise'])
                .exec());
        }
        else {
            return (0, rxjs_1.from)(this.serviceModel.find().populate(['category', 'enterprise']).sort({ rankingPoint: 'desc' }).exec());
        }
    }
    async deepSearch(textSearch, filter, page) {
        if (filter.category && !mongoose_1.Types.ObjectId.isValid(filter.category)) {
            throw new common_1.NotFoundException('Category not found: ' + filter.category);
        }
        try {
            let services = [];
            let condition = {};
            let resultPerPage = 12;
            page = page || 1;
            filter.category && (condition['category'] = mongoose_1.Types.ObjectId(filter.category));
            filter.quan && (condition['address.district'] = filter.quan);
            filter.huyen && (condition['address.village'] = filter.huyen);
            let down = 0;
            let up = 0;
            if (!filter.rating || filter.rating === -1) {
                down = 0;
                up = 0;
            }
            else {
                down = filter.rating;
                up = filter.rating;
            }
            let totalPage = 1;
            if (textSearch && textSearch.length > 0) {
                if (!filter.rating || filter.rating === -1) {
                    services = await this.serviceModel.find({
                        $text: {
                            $search: textSearch,
                        },
                        $or: [
                            Object.assign({ rankingPoint: {
                                    $gte: DOWN[down],
                                    $lte: UP[up],
                                } }, condition),
                            Object.assign({ rankingPoint: null }, condition)
                        ]
                    }).sort({ rankingPoint: 'desc' })
                        .skip((page - 1) * resultPerPage)
                        .limit(resultPerPage)
                        .populate(['category', 'enterprise'])
                        .exec();
                    totalPage = await this.serviceModel.find({
                        $text: {
                            $search: textSearch,
                        },
                        $or: [
                            Object.assign({ rankingPoint: {
                                    $gte: DOWN[down],
                                    $lte: UP[up],
                                } }, condition),
                            Object.assign({ rankingPoint: null }, condition)
                        ]
                    }).countDocuments().exec() / resultPerPage;
                }
                else {
                    services = await this.serviceModel.find(Object.assign({ $text: {
                            $search: textSearch,
                        }, rankingPoint: {
                            $gte: DOWN[down],
                            $lte: UP[up],
                            $ne: null,
                        } }, condition)).sort({ rankingPoint: 'desc' })
                        .skip((page - 1) * resultPerPage)
                        .limit(resultPerPage)
                        .populate(['category', 'enterprise'])
                        .exec();
                    totalPage = await this.serviceModel.find(Object.assign({ $text: {
                            $search: textSearch,
                        }, rankingPoint: {
                            $gte: DOWN[down],
                            $lte: UP[up],
                            $ne: null,
                        } }, condition)).countDocuments().exec() / resultPerPage;
                }
            }
            else {
                if (!filter.rating || filter.rating === -1) {
                    services = await this.serviceModel.find({
                        $or: [
                            Object.assign({ rankingPoint: {
                                    $gte: DOWN[down],
                                    $lte: UP[up],
                                } }, condition),
                            Object.assign({ rankingPoint: null }, condition)
                        ],
                    }, null)
                        .sort({ rankingPoint: 'desc' })
                        .skip((page - 1) * resultPerPage).limit(resultPerPage)
                        .populate(['category', 'enterprise'])
                        .exec();
                    totalPage = await this.serviceModel.find({
                        $or: [
                            Object.assign({ rankingPoint: {
                                    $gte: DOWN[down],
                                    $lte: UP[up],
                                } }, condition),
                            Object.assign({ rankingPoint: null }, condition)
                        ],
                    }, null)
                        .countDocuments()
                        .exec() / resultPerPage;
                }
                else {
                    services = await this.serviceModel.find(Object.assign({ rankingPoint: {
                            $gte: DOWN[down],
                            $lte: UP[up],
                            $ne: null,
                        } }, condition), null)
                        .sort({ rankingPoint: 'desc' })
                        .skip((page - 1) * resultPerPage).limit(resultPerPage)
                        .populate(['category', 'enterprise'])
                        .exec();
                    totalPage = await this.serviceModel.find(Object.assign({ rankingPoint: {
                            $gte: DOWN[down],
                            $lte: UP[up],
                            $ne: null,
                        } }, condition), null)
                        .countDocuments()
                        .exec() / resultPerPage;
                }
            }
            return { services, totalPage: Math.ceil(totalPage), page };
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
};
SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_constants_1.SERVICE_MODEL)),
    __param(1, (0, common_1.Inject)(database_constants_1.INTRODUCTION_MODEL)),
    __metadata("design:paramtypes", [Object, Object])
], SearchService);
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map