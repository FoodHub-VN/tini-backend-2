import { Document, Model, Schema, SchemaTypes } from "mongoose";
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

type CommentModel = Model<Comment>;

const CommentSchema = new Schema<Comment>({
  user: { type: SchemaTypes.ObjectId, ref: "User" },
  service: { type: SchemaTypes.ObjectId, ref: "Service" },
  rating: SchemaTypes.Number,
  content: {
    type: SchemaTypes.String,
    text: true
  },
  title: {
    type: SchemaTypes.String,
    text: true
  },
  images: [SchemaTypes.Mixed],
  numOfLike: SchemaTypes.Number,
  userLiked: [{ type: SchemaTypes.ObjectId, ref: "User" }]
}, {timestamps: true});

export { Comment, CommentModel, CommentSchema };