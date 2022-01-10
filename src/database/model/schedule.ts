import { Document, Model, Schema, SchemaTypes } from "mongoose";

interface Schedule extends Document {
  readonly user: string;
  readonly service: string;
  readonly timeServe: Date;
}

type ScheduleModel = Model<Schedule>;

const ScheduleSchema = new Schema({
  user: SchemaTypes.ObjectId,
  service: SchemaTypes.ObjectId,
  timeServe: SchemaTypes.Date
}, { timestamps: true });
export { Schedule, ScheduleModel, ScheduleSchema };