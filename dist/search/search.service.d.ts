import { Post, PostModel } from "../database/model/post.model";
import { User, UserModel } from "../database/model/user.model";
import { Merchant, MerchantModel } from "../database/model/merchant.model";
import { Dish } from "../database/model/dish.model";
export declare class SearchService {
    private readonly merchantModel;
    private readonly userModel;
    private readonly postModel;
    constructor(merchantModel: MerchantModel, userModel: UserModel, postModel: PostModel);
    fetchManyUsersWithName(customerName: string, limit: number): Promise<User[]>;
    fetchUserWithUsername(id: number): Promise<User>;
    fetchBestDishesContainingKeywords(keywords: string, limit: number): Promise<Dish[]>;
    fetchBestPostsContainingKeywords(keywords: string, limit: number): Promise<Post[]>;
    fetchMerchantsNearLatLng(lat: number, lng: number, radius: number): Promise<Merchant[]>;
    fetchFoodUsingFoodMatcher(lat: number, lng: number, radius: number): Promise<Dish[]>;
}
