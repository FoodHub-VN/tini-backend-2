import { Document, Model, Schema, SchemaTypes } from "mongoose";
import { Address } from "./user.model";

interface Service extends Document {
  readonly name: string;
  readonly avatar: string;
  readonly enterprise: string;
  readonly address: Address;
  readonly email: string;
  readonly phone: number;
  readonly type: string;
  readonly rankingPoint: number;
  readonly openTime: Date;
  readonly closeTime: Date;
  readonly maxPrice: number;
  readonly minPrice: number;
  readonly imgCmtCount: number;
  readonly textCmtCount: number;
}

type ServiceModel = Model<Service>;

const ServiceSchema = new Schema<Service>({
  name: SchemaTypes.String,
  avatar: SchemaTypes.String,
  enterprise: SchemaTypes.ObjectId,
  address: SchemaTypes.Mixed,
  email: SchemaTypes.String,
  phone: SchemaTypes.Number,
  type: SchemaTypes.String,
  rankingPoint: SchemaTypes.Number,
  openTime: SchemaTypes.Date,
  closeTime: SchemaTypes.Date,
  maxPrice: SchemaTypes.Number,
  minPrice: SchemaTypes.Number,
  imgCmtCount: SchemaTypes.Number,
  textCmtCount: SchemaTypes.Number
}, { timestamps: true });

export { Service, ServiceSchema, ServiceModel };