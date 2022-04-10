import { Document, Model, Schema, SchemaTypes } from "mongoose";

interface Score extends Document {
  readonly service: string;
  readonly scores: Array<number>;
  readonly userRate: string;
}

type ScoreModel = Model<Score>;

const ScoreSchema = new Schema<Score>({
  service: { type: SchemaTypes.ObjectId, ref: "Service" },
  userRate: { type: SchemaTypes.ObjectId, ref: "User" },
  scores: [SchemaTypes.Number]
}, { timestamps: true });



export { Score, ScoreModel, ScoreSchema };