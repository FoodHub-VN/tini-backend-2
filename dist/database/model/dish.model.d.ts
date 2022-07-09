import { Document, Schema } from 'mongoose';
interface Dish extends Document {
    readonly dishName: string;
    readonly imageUrl: string;
    readonly description: string;
    readonly cost: number;
}
declare const DishSchema: Schema<Dish, import("mongoose").Model<Dish, any, any>, undefined, {}>;
export { Dish, DishSchema, };
