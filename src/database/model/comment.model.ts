import { Document, Model, Schema, SchemaTypes } from "mongoose";

interface Comment extends Document {
  readonly user: string;
  readonly service: string;
  readonly rating: number;
  readonly content: string;
  readonly title: string;
  readonly image: string;
  readonly numOfLike: number;
  readonly userLiked: Array<string>;
}

type CommentModel = Model<Comment>;

const CommentSchema = new Schema<Comment>({
  user: SchemaTypes.ObjectId,
  service: SchemaTypes.ObjectId,
  rating: SchemaTypes.Number,
  content: SchemaTypes.String,
  title: SchemaTypes.String,
  image: SchemaTypes.String,
  numOfLike: SchemaTypes.Number,
  userLiked: [SchemaTypes.ObjectId]
}, {timestamps: true});

export { Comment, CommentModel, CommentSchema };