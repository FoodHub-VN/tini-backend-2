import { Document, Model, Schema, SchemaTypes } from "mongoose";
import { Address } from "./user.model";
import { Inject } from "@nestjs/common";
import { INTRODUCTION_MODEL } from "../database.constants";
import { Introduction, IntroductionModel } from "./introduction.model";

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
  enterprise: {type: SchemaTypes.ObjectId, ref: 'Enterprise' },
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

async function preDeleteHook(next) {
  // const conn = this.mongooseCollection.conn;
  // const introModel = conn.models['Introduction'];
  console.log(this.model);
  next();
  // introModel.find({service: }).exec().then((res)=>{
  //   console.log(res);
  // })
}

ServiceSchema.pre<Service>('remove',async function(next) {
  const intro = await this.model<IntroductionModel>("Introduction").findOne({ service: this._id }).exec();
  await intro.remove();
  return next();
});
export { Service, ServiceSchema, ServiceModel };