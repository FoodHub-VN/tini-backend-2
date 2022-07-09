import { Document, Schema, SchemaTypes } from 'mongoose';

interface Dish extends Document {
  readonly dishName: string;
  readonly description: string;
  readonly cost: number;
}

const DishSchema = new Schema<Dish>({
  dishName: SchemaTypes.String,
  description: SchemaTypes.String,
  cost: SchemaTypes.Number,
}, {
  timestamps: true,
});

export {
  Dish,
  DishSchema,
};
