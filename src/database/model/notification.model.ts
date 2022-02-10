import { Document, Model, Schema, SchemaTypes, Types } from "mongoose";

interface Notification extends Document {
  user: string;
  service: string;
  content: string;
  date: Date;
}

type NotificationModel = Model<Notification>;

const NotificationSchema = new Schema({
  user: { type: Types.ObjectId, ref: "User" },
  service: { type: Types.ObjectId, ref: "Service" },
  content: SchemaTypes.String,
  date: SchemaTypes.Date
}, { timestamps: true });

export { Notification, NotificationModel, NotificationSchema };