import { Document, Model, Schema, SchemaTypes } from "mongoose";

interface Purchase extends Document {
  readonly enterprise: string;
  readonly date: Date;
  readonly premium: string;
  readonly transactionNo: string;
}

type PurchaseModel = Model<Purchase>;

const PurchaseSchema = new Schema({
  enterprise: { type: SchemaTypes.ObjectId, ref: "Enterprise" },
  date: SchemaTypes.Date,
  premium:  SchemaTypes.String,
  transactionNo: SchemaTypes.String
}, { timestamps: true });

export { Purchase, PurchaseModel, PurchaseSchema };