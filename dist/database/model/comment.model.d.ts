import { Document, Model, Schema } from "mongoose";
import { FileUploaded } from "../../upload/interface/upload.interface";
interface Comment extends Document {
    readonly user: string;
    readonly service: string;
    readonly rating: number;
    readonly content: string;
    readonly title: string;
    readonly images: FileUploaded[] | undefined;
    readonly numOfLike: number;
    readonly userLiked: Array<string>;
}
declare type CommentModel = Model<Comment>;
declare const CommentSchema: Schema<Comment, Model<Comment, any, any>, undefined, {}>;
export { Comment, CommentModel, CommentSchema };
