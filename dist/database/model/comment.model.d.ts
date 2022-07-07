import { Document, Model, Schema } from 'mongoose';
interface Comment extends Document {
    readonly owner: string;
    readonly title: string;
    readonly content: string;
    readonly timeComment: number;
}
declare type CommentModel = Model<Comment>;
declare const CommentSchema: Schema<Comment, Model<Comment, any, any>, undefined, {}>;
export { Comment, CommentModel, CommentSchema, };
