import { Document, Model, Schema, SchemaTypes } from 'mongoose';
import {Dish, DishSchema} from "./dish.model";

interface Merchant extends Document {
    readonly merchantName: string;
    readonly locationAddress: string;
    readonly location: {
        type: string,
        coordinates: [number, number],
    };
    readonly dishes: Dish[],
}

type MerchantModel = Model<Merchant>;

const MerchantSchema = new Schema<Merchant>({
    merchantName: SchemaTypes.String,
    locationAddress: SchemaTypes.String,
    location: {
        type: {
            type : SchemaTypes.String,
        },
        coordinates: [SchemaTypes.Number, SchemaTypes.Number],
    },
    dishes: [DishSchema],
}, {
    timestamps: true
});

export {
    Merchant,
    MerchantSchema,
    MerchantModel,
};
