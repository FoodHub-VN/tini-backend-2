import { Document, Model, Schema, SchemaTypes } from "mongoose";

interface Premium extends Document {
  readonly name: string;
  readonly level: number;
  readonly pointBonus: number;
  readonly price: number;
}

type PremiumModel = Model<Premium>;

const PremiumSchema = new Schema({
  name: SchemaTypes.String,
  level: SchemaTypes.Number,
  pointBonus: SchemaTypes.Number,
  price: SchemaTypes.Number
}, { timestamps: true });

export { Premium, PremiumModel, PremiumSchema };