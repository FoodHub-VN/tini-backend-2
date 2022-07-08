import { Post, PostModel } from "../database/model/post.model";
import { User, UserModel } from "../database/model/user.model";
export declare class SearchService {
    private userModel;
    private postModel;
    constructor(userModel: UserModel, postModel: PostModel);
    fetchManyUsersWithName(customerName: string, limit: number): Promise<User[]>;
    fetchUserWithUsername(id: string): Promise<User>;
    fetchBestPostsContainingKeywords(keywords: string, limit: number): Promise<Post[]>;
    fetchVendorsNearLatLng(lat: number, lng: number, radius: number): Promise<User[]>;
}
