import { Document, Model, Schema, SchemaTypes, Types } from "mongoose";

interface Introduction extends Document {
  readonly service: Types.ObjectId;
  readonly content: string;
}

type IntroductionModel = Model<Introduction>;

const IntroductionSchema = new Schema({
  service: { type: SchemaTypes.ObjectId, ref: "Service" },
  content: {
    type: SchemaTypes.String,
    text: true
  }
}, { timestamps: true });

export { Introduction, IntroductionSchema, IntroductionModel };