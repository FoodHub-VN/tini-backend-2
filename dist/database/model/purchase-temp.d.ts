import { Document, Model, Schema } from "mongoose";
interface PurchaseTemp extends Document {
    readonly enterprise: string;
    readonly code: string;
    readonly premium: string;
}
declare type PurchaseTempModel = Model<PurchaseTemp>;
declare const PurchaseTempSchema: Schema<Document<any, any, any>, Model<Document<any, any, any>, any, any>, undefined, {}>;
export { PurchaseTemp, PurchaseTempModel, PurchaseTempSchema };
