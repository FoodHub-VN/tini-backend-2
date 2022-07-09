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
        return this.userModel.findById(id, {_id: 1, customerName: 1, post: 1}).exec();
    }

    async fetchBestDishesContainingKeywords(keywords: string, limit: number): Promise<Dish[]> {
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

                dishes.push({dish, score});
            }
        }

        dishes.sort((a, b) => b.score - a.score);
        return dishes.slice(0, limit);
    }

    async fetchBestPostsContainingKeywords(keywords: string, limit: number): Promise<Post[]> {
        const posts: any[] = await this.postModel.find();
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
