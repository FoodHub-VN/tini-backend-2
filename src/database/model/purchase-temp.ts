import { Document, Model, Schema, SchemaTypes } from "mongoose";

interface PurchaseTemp extends Document {
  readonly enterprise: string;
  readonly code: string;
  readonly premium: string;
}

type PurchaseTempModel = Model<PurchaseTemp>;

const PurchaseTempSchema = new Schema({
  enterprise: { type: SchemaTypes.ObjectId, ref: "Enterprise" },
  premium: SchemaTypes.String,
  code: SchemaTypes.String
}, { timestamps: true });

export { PurchaseTemp, PurchaseTempModel, PurchaseTempSchema };