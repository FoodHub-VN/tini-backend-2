import { Document, Model, Schema } from "mongoose";
interface Category extends Document {
    readonly category: string;
}
declare type CategoryModel = Model<Category>;
declare const CategorySchema: Schema<Category, Model<Category, any, any>, undefined, {}>;
export { Category, CategorySchema, CategoryModel };
