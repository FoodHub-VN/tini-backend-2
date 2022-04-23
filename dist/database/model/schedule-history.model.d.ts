import { Document, Model, Schema, Types } from "mongoose";
interface ScheduleHistory extends Document {
    user: Types.ObjectId;
    service: Types.ObjectId;
    date: Date;
    hasRating: boolean;
}
declare type ScheduleHistoryModel = Model<ScheduleHistory>;
declare const ScheduleHistorySchema: Schema<Document<any, any, any>, Model<Document<any, any, any>, any, any>, undefined, {}>;
export { ScheduleHistory, ScheduleHistoryModel, ScheduleHistorySchema };
