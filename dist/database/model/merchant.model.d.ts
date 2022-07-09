import { Document, Model, Schema } from 'mongoose';
import { Dish } from "./dish.model";
interface Merchant extends Document {
    readonly merchantName: string;
    readonly location: {
        type: string;
        coordinates: [number, number];
    };
    readonly dishes: Dish[];
}
declare type MerchantModel = Model<Merchant>;
declare const MerchantSchema: Schema<Merchant, Model<Merchant, any, any>, undefined, {}>;
export { Merchant, MerchantSchema, MerchantModel, };
