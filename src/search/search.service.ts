import {Inject, Injectable} from '@nestjs/common';
import {MERCHANT_MODEL, POST_MODEL, USER_MODEL} from "../database/database.constants";
import {Post, PostModel} from "../database/model/post.model";
import {User, UserModel} from "../database/model/user.model";
import {Merchant, MerchantModel} from "../database/model/merchant.model";
import {Dish} from "../database/model/dish.model";


@Injectable()
export class SearchService {
    constructor(@Inject(MERCHANT_MODEL) private readonly merchantModel: MerchantModel,
                @Inject(USER_MODEL) private readonly userModel: UserModel,
                @Inject(POST_MODEL) private readonly postModel: PostModel
    ) {
    }

    async fetchManyUsersWithName(customerName: string, limit: number): Promise<User[]> {
        return this.userModel.find({customerName}).limit(limit).exec();
    }

    async fetchUserWithUsername(id: number): Promise<User> {
        return this.userModel.findById(id).exec();
    }

    async fetchBestPostsContainingKeywords(keywords: string, limit: number): Promise<Post[]> {
        return this.postModel
            .find({$text: {$search: keywords}})
            .sort({score: {$meta: "textScore"}})
            .limit(limit)
            .exec();
    }

    async fetchMerchantsNearLatLng(lat: number, lng: number, radius: number): Promise<Merchant[]> {
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

    async fetchFoodUsingFoodMatcher(lat: number, lng: number, radius: number): Promise<Dish[]> {
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
}
