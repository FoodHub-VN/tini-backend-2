import { Document, Model, Schema, SchemaTypes } from "mongoose";

interface Purchase extends Document {
  readonly user: string;
  readonly enterprise: string;
  readonly date: Date;
  readonly premium: string;
}

type PurchaseModel = Model<Purchase>;

const PurchaseSchema = new Schema({
  user: { type: SchemaTypes.ObjectId, ref: "User" },
  enterprise: { type: SchemaTypes.ObjectId, ref: "Enterprise" },
  date: SchemaTypes.Date,
  premium: { type: SchemaTypes.ObjectId, ref: "Premium" },
}, { timestamps: true });

export { Purchase, PurchaseModel, PurchaseSchema };