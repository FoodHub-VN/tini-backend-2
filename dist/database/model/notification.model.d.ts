import { Document, Model, Schema } from "mongoose";
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
declare type NotificationModel = Model<Notification>;
declare const NotificationSchema: Schema<Document<any, any, any>, Model<Document<any, any, any>, any, any>, undefined, {}>;
export { Notification, NotificationModel, NotificationSchema };
