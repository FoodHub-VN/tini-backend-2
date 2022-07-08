import { Document, Model, Schema } from 'mongoose';
import { FileUploaded } from '../../upload/interface/upload.interface';
interface Post extends Document {
    readonly owner: string;
    readonly title: string;
    readonly content: string;
    readonly images: FileUploaded[];
    readonly hashtag: string[];
    readonly upVotedBy: string[];
    readonly downVotedBy: string[];
    readonly numView: number;
    readonly comment: string[];
    readonly visitedTime: number;
}
declare type PostModel = Model<Post>;
declare const PostSchema: Schema<Post, Model<Post, any, any>, undefined, {}>;
export { Post, PostModel, PostSchema, };
