import {Inject, Injectable} from '@nestjs/common';
import {POST_MODEL, USER_MODEL} from "../database/database.constants";
import {Post, PostModel} from "../database/model/post.model";
import {User, UserModel} from "../database/model/user.model";


@Injectable()
export class SearchService {
    constructor(@Inject(USER_MODEL) private userModel: UserModel,
                @Inject(POST_MODEL) private postModel: PostModel
    ) {
    }

    async fetchManyUsersWithName(customerName: string, limit: number): Promise<User[]> {
        return this.userModel.find({customerName}, {_id: 0}).limit(limit).exec();
    }

    async fetchUserWithUsername(id: string): Promise<User> {
        return this.userModel.findOne({id}, {_id: 0}).exec();
    }

    async fetchBestPostsContainingKeywords(keywords: string, limit: number): Promise<Post[]> {
        return this.postModel
            .find({$text: {$search: keywords}},
                {_id: 0})
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
                },
                {_id: 0})
            .exec();
    }
}
