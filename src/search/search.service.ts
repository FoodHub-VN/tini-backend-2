import {Inject, Injectable} from '@nestjs/common';
import {POST_MODEL, USER_MODEL} from "../database/database.constants";
import {Post, PostModel} from "../database/model/post.model";
import {User, UserModel} from "../database/model/user.model";


@Injectable()
export class SearchService {
    constructor(@Inject(USER_MODEL) private readonly userModel: UserModel,
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

    async fetchVendorsNearLatLng(lat: number, lng: number, radius: number): Promise<User[]> {
        return this.userModel
            .find({
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [lng, lat]
                        },
                        $maxDistance: radius,
                    },
                })
            .exec();
    }
}
