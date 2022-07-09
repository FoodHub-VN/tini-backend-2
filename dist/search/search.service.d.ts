import { Post, PostModel } from "../database/model/post.model";
import { User, UserModel } from "../database/model/user.model";
export declare class SearchService {
    private readonly userModel;
    private readonly postModel;
    constructor(userModel: UserModel, postModel: PostModel);
    fetchManyUsersWithName(customerName: string, limit: number): Promise<User[]>;
    fetchUserWithUsername(id: number): Promise<User>;
    fetchBestPostsContainingKeywords(keywords: string, limit: number): Promise<Post[]>;
    fetchVendorsNearLatLng(lat: number, lng: number, radius: number): Promise<User[]>;
}
