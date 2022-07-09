import {Inject, Injectable} from '@nestjs/common';
import {MERCHANT_MODEL, POST_MODEL, USER_MODEL} from "../database/database.constants";
import {Post, PostModel} from "../database/model/post.model";
import {User, UserModel} from "../database/model/user.model";
import {Merchant, MerchantModel} from "../database/model/merchant.model";


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
}
