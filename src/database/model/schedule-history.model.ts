import { Document, Model, Schema, SchemaTypes } from "mongoose";

interface ScheduleHistory extends Document {
  user: string;
  service: string;
  date: Date;
  hasRating: boolean;
}

type ScheduleHistoryModel = Model<ScheduleHistory>;

const ScheduleHistorySchema = new Schema({
  user: SchemaTypes.ObjectId,
  service: SchemaTypes.ObjectId,
  date: SchemaTypes.Date,
  hasRating: SchemaTypes.Boolean
}, { timestamps: true });

export { ScheduleHistory, ScheduleHistoryModel, ScheduleHistorySchema };
