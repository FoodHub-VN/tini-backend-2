import { Document, Model, Schema } from "mongoose";
interface Premium extends Document {
    readonly name: string;
    readonly level: number;
    readonly pointBonus: number;
    readonly price: number;
}
declare type PremiumModel = Model<Premium>;
declare const PremiumSchema: Schema<Document<any, any, any>, Model<Document<any, any, any>, any, any>, undefined, {}>;
export { Premium, PremiumModel, PremiumSchema };
