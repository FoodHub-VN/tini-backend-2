import { Document, Model, Schema, SchemaTypes, Types } from "mongoose";
import { NotiType } from "../../shared/NotiType.type";

interface Notification extends Document {
  user: string;
  service: string;
  content: string;
  type: NotiType;
  extraData: string[];
  hadRead: boolean;
  date: number;
}

type NotificationModel = Model<Notification>;

const NotificationSchema = new Schema({
  user: { type: Types.ObjectId, ref: "User" },
  service: { type: Types.ObjectId, ref: "Service" },
  hadRead: SchemaTypes.Boolean,
  content: SchemaTypes.String,
  type: SchemaTypes.Number,
  extraData: [SchemaTypes.String],
  date: SchemaTypes.Number
}, { timestamps: true });

export { Notification, NotificationModel, NotificationSchema };