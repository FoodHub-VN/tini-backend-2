import { Document, Model, Schema } from "mongoose";
interface Score extends Document {
    readonly service: string;
    readonly scores: Array<number>;
    readonly userRate: string;
}
declare type ScoreModel = Model<Score>;
declare const ScoreSchema: Schema<Score, Model<Score, any, any>, undefined, {}>;
export { Score, ScoreModel, ScoreSchema };
