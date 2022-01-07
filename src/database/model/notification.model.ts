import { Document, Model, Schema, SchemaTypes } from "mongoose";

interface Notification extends Document {
  content: string;
  date: Date;
}

type NotificationModel = Model<Notification>;

const NotificationSchema = new Schema({
  content: SchemaTypes.String,
  date: SchemaTypes.Date
}, { timestamps: true });

export { Notification, NotificationModel, NotificationSchema };