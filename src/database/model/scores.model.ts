import { Document, Model, Schema, SchemaTypes } from "mongoose";

interface Score extends Document {
  readonly service: string;
  readonly scores: Array<number>;
  readonly userRate: string;
  readonly commentId: string;
}

type ScoreModel = Model<Score>;

const ScoreSchema = new Schema<Score>({
  service: { type: SchemaTypes.ObjectId, ref: "Service" },
  userRate: { type: SchemaTypes.ObjectId, ref: "User" },
  scores: [SchemaTypes.Number],
  commentId: {type: SchemaTypes.ObjectId, ref: "Score"}
}, { timestamps: true });



export { Score, ScoreModel, ScoreSchema };