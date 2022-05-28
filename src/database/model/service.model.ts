import { Document, Model, Schema, SchemaTypes } from "mongoose";
import { Address } from "./user.model";
import { Introduction, IntroductionModel } from "./introduction.model";
import { CommentModel } from "./comment.model";
import { NotificationModel } from "./notification.model";
import { ScheduleHistoryModel } from "./schedule-history.model";
import { PurchaseModel } from "./purchase-history.model";
import { ScheduleModel } from "./schedule";
import { FileUploaded } from "../../upload/interface/upload.interface";
import { ScoreModel } from "./scores.model";

interface Service extends Document {
   name: string;
   avatar: FileUploaded | undefined;
   images: FileUploaded[] | undefined;
   enterprise: string;
   address: Address;
   email: string;
   phone: string;
   rankingPoint: number;
   openTime: string;
   closeTime: string;
   maxPrice: number;
   minPrice: number;
   imgCmtCount: number;
   textCmtCount: number;
   category: string;
   introduction: string;
   shortIntroduction: string;
   cmtScore: number;
   blogScore: number;
  starPoint: number;
  enableSchedule: boolean;
  scheduleAllowedPerHour: number;
}

type ServiceModel = Model<Service>;

const ServiceSchema = new Schema<Service>({
  name: {
    type: SchemaTypes.String,
  },
  avatar: SchemaTypes.Mixed,
  images: [SchemaTypes.Mixed],
  enterprise: {type: SchemaTypes.ObjectId, ref: 'Enterprise' },
  address: SchemaTypes.Mixed,
  email: SchemaTypes.String,
  phone: SchemaTypes.String,
  rankingPoint: SchemaTypes.Number,
  openTime: SchemaTypes.String,
  closeTime: SchemaTypes.String,
  maxPrice: SchemaTypes.Number,
  minPrice: SchemaTypes.Number,
  imgCmtCount: SchemaTypes.Number,
  textCmtCount: SchemaTypes.Number,
  introduction: SchemaTypes.String,
  shortIntroduction: SchemaTypes.String,
  category: {type: SchemaTypes.ObjectId, ref: 'Category'},
  cmtScore: SchemaTypes.Number,
  blogScore: SchemaTypes.Number,
  starPoint: SchemaTypes.Number,
  enableSchedule: SchemaTypes.Boolean,
  scheduleAllowedPerHour: SchemaTypes.Number
}, { timestamps: true });

ServiceSchema.index({name: 'text'});
ServiceSchema.post<Service>("remove", async function(service) {

  //delete introduction
  const intro = await this.model<IntroductionModel>("Introduction").findOne({ service: this._id }).exec();
  if(intro){
    await intro.remove();
  }

  //delete comment
  const comments = await this.model<CommentModel>("Comment").find({ service: this._id }).exec();
  comments && await Promise.all(comments.map((comment) => {
    return comment.remove();
  }));

  //delete notification

  const notifications = await this.model<NotificationModel>("Notification").find({ service: this._id }).exec();
  notifications && await Promise.all(notifications.map((noti) => {
    return noti.remove();
  }));

  //delete order history
  const scheduleHistories = await this.model<ScheduleHistoryModel>("ScheduleHistory").find({ service: this._id }).exec();
  scheduleHistories && await Promise.all(scheduleHistories.map((schedule) => {
    return schedule.remove();
  }));


  //delete premium
  const premiumHistory = await this.model<PurchaseModel>("Purchase").find({ service: this._id }).exec();
  premiumHistory && await Promise.all(premiumHistory.map((purchase) => {
    return purchase.remove();
  }));

  //delete schedule
  const schedules = await this.model<ScheduleModel>("Schedule").find({ service: this._id }).exec();
  schedules&&await Promise.all(schedules.map((schedule) => {
    return schedule.remove();
  }));

  //delete scores
  const scores = await this.model<ScoreModel>("Score").find({ service: this._id }).exec();
  scores&&await Promise.all(scores.map((score) => {
    return score.remove();
  }));
  return;
});

export { Service, ServiceSchema, ServiceModel };