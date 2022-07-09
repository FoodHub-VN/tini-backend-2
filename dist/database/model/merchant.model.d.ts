import { Document, Model, Schema } from 'mongoose';
interface Merchant extends Document {
    readonly merchantName: string;
    readonly location: {
        type: string;
        coordinates: [number, number];
    };
}
declare type MerchantModel = Model<Merchant>;
declare const MerchantSchema: Schema<Merchant, Model<Merchant, any, any>, undefined, {}>;
export { Merchant, MerchantSchema, MerchantModel, };
