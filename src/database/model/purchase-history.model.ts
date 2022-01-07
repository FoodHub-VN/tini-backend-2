import { Document, Model, Schema, SchemaTypes } from "mongoose";

interface Purchase extends Document {
  readonly user: string;
  readonly enterprise: string;
  readonly date: Date;
  readonly premium: string;
}

type PurchaseModel = Model<Purchase>;

const PurchaseSchema = new Schema({
  user: SchemaTypes.ObjectId,
  enterprise: SchemaTypes.ObjectId,
  date: SchemaTypes.Date,
  premium: SchemaTypes.ObjectId
}, { timestamps: true });

export { Purchase, PurchaseModel, PurchaseSchema };