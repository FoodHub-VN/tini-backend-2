import { Document, Model, Schema, Types } from "mongoose";
interface Schedule extends Document {
    readonly user: Types.ObjectId;
    readonly service: Types.ObjectId;
    readonly timeServe: Date;
}
declare type ScheduleModel = Model<Schedule>;
declare const ScheduleSchema: Schema<Document<any, any, any>, Model<Document<any, any, any>, any, any>, undefined, {}>;
export { Schedule, ScheduleModel, ScheduleSchema };
