import { Document, Model, Schema, SchemaTypes, Types } from "mongoose";

interface Introduction extends Document {
  readonly service: Types.ObjectId;
  readonly content: string;
}

type IntroductionModel = Model<Introduction>;

const IntroductionSchema = new Schema({
  service: SchemaTypes.ObjectId,
  content: SchemaTypes.String
}, { timestamps: true });

export { Introduction, IntroductionSchema, IntroductionModel };