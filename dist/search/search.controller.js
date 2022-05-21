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
const rxjs_1 = require("rxjs");
let SearchController = class SearchController {
    constructor(searchService) {
        this.searchService = searchService;
    }
    search(res, searchText, category, quan, huyen, page, rating, req) {
        let filter = {};
        category && (filter.category = category.toString());
        quan && (filter.quan = quan.toString());
        huyen && (filter.huyen = huyen.toString());
        rating && rating !== -1 && (filter.rating = rating);
        return (0, rxjs_1.from)(this.searchService.deepSearch(searchText, filter, page))
            .pipe((0, rxjs_1.map)((services) => {
            if (services) {
                return res.status(common_1.HttpStatus.OK).send(Object.assign({ searchText: searchText }, services));
            }
            else {
                throw new common_1.BadRequestException();
            }
        }));
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)("text")),
    __param(2, (0, common_1.Query)("category")),
    __param(3, (0, common_1.Query)("quan")),
    __param(4, (0, common_1.Query)("huyen")),
    __param(5, (0, common_1.Query)('page')),
    __param(6, (0, common_1.Query)('rating')),
    __param(7, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, Number, Number, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], SearchController.prototype, "search", null);
SearchController = __decorate([
    (0, common_1.Controller)("search"),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchController);
exports.SearchController = SearchController;
//# sourceMappingURL=search.controller.js.map