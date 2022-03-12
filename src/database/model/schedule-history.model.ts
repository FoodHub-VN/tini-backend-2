import { Document, Model, Schema, SchemaTypes, Types } from "mongoose";

interface ScheduleHistory extends Document {
  user: Types.ObjectId;
  service: Types.ObjectId;
  date: Date;
  hasRating: boolean;
}

type ScheduleHistoryModel = Model<ScheduleHistory>;

const ScheduleHistorySchema = new Schema({
  user: { type: SchemaTypes.ObjectId, ref: "User" },
  service: { type: SchemaTypes.ObjectId, ref: "Service" },
  date: SchemaTypes.Date,
  hasRating: SchemaTypes.Boolean
}, { timestamps: true });

export { ScheduleHistory, ScheduleHistoryModel, ScheduleHistorySchema };
