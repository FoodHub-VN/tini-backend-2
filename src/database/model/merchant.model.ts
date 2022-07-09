import { Document, Model, Schema, SchemaTypes } from 'mongoose';

interface Merchant extends Document {
    readonly merchantName: string;
    readonly location: {
        type: string,
        coordinates: [number, number],
    };
}

type MerchantModel = Model<Merchant>;

const MerchantSchema = new Schema<Merchant>({
    merchantName: SchemaTypes.String,
    location: {
        type: {
            type : SchemaTypes.String,
        },
        coordinates: [SchemaTypes.Number, SchemaTypes.Number],
    },
}, {
    timestamps: true
});

export {
    Merchant,
    MerchantSchema,
    MerchantModel,
};
