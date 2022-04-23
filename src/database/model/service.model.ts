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
}

type ServiceModel = Model<Service>;

const ServiceSchema = new Schema<Service>({
  name: {
    type: SchemaTypes.String,
    text: true
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
}, { timestamps: true });


ServiceSchema.post<Service>("remove", async function(service) {

  //delete introduction
  const intro = await this.model<IntroductionModel>("Introduction").findOne({ service: this._id }).exec();
  await intro.remove();

  //delete comment
  const comments = await this.model<CommentModel>("Comment").find({ service: this._id }).exec();
  await Promise.all(comments.map((comment) => {
    return comment.remove();
  }));

  //delete notification

  const notifications = await this.model<NotificationModel>("Notification").find({ service: this._id }).exec();
  await Promise.all(notifications.map((noti) => {
    return noti.remove();
  }));

  //delete order history
  const scheduleHistories = await this.model<ScheduleHistoryModel>("ScheduleHistory").find({ service: this._id }).exec();
  await Promise.all(scheduleHistories.map((schedule) => {
    return schedule.remove();
  }));


  //delete premium
  const premiumHistory = await this.model<PurchaseModel>("Purchase").find({ service: this._id }).exec();
  await Promise.all(premiumHistory.map((purchase) => {
    return purchase.remove();
  }));

  //delete schedule
  const schedules = await this.model<ScheduleModel>("Schedule").find({ service: this._id }).exec();
  await Promise.all(schedules.map((schedule) => {
    return schedule.remove();
  }));

  //delete scores
  const scores = await this.model<ScoreModel>("Score").find({ service: this._id }).exec();
  await Promise.all(scores.map((score) => {
    return score.remove();
  }));
  return;
});

export { Service, ServiceSchema, ServiceModel };