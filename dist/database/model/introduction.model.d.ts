import { Document, Model, Schema, Types } from "mongoose";
interface Introduction extends Document {
    readonly service: Types.ObjectId;
    readonly content: string;
}
declare type IntroductionModel = Model<Introduction>;
declare const IntroductionSchema: Schema<Document<any, any, any>, Model<Document<any, any, any>, any, any>, undefined, {}>;
export { Introduction, IntroductionSchema, IntroductionModel };
