import { Document, Model, Schema, SchemaTypes } from 'mongoose';

interface Comment extends Document {
  readonly owner: number;
  readonly content: string;
  readonly timeComment: number;
}

type CommentModel = Model<Comment>;

const CommentSchema = new Schema<Comment>({
  owner: {
    type: SchemaTypes.Number,
    ref: 'User'
  },
  post: {
    type: SchemaTypes.ObjectId,
    ref: 'Post'
  },
  content: SchemaTypes.String,
  timeComment: SchemaTypes.Number,
}, {
  timestamps: true,
});

export {
  Comment,
  CommentModel,
  CommentSchema,
};
