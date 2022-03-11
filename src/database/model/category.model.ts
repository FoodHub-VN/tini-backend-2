import { Document, Model, Schema, SchemaTypes } from "mongoose";
import { ServiceModel } from "./service.model";

interface Category extends Document {
  readonly category: string;
}

type CategoryModel = Model<Category>;

const CategorySchema = new Schema<Category>({
  category: String,
}, {timestamps: true});

CategorySchema.post<Category>('remove', async function() {
  const serviceModel = await this.model<ServiceModel>("Category").find({category: this._id}).exec();
  await Promise.all(serviceModel.map((service)=>{
    return service.remove();
  }))
  return;
})

export { Category, CategorySchema, CategoryModel };