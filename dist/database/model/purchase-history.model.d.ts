import { Document, Model, Schema } from "mongoose";
interface Purchase extends Document {
    readonly enterprise: string;
    readonly date: Date;
    readonly premium: string;
    readonly transactionNo: string;
}
declare type PurchaseModel = Model<Purchase>;
declare const PurchaseSchema: Schema<Document<any, any, any>, Model<Document<any, any, any>, any, any>, undefined, {}>;
export { Purchase, PurchaseModel, PurchaseSchema };
