"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantSchema = void 0;
const mongoose_1 = require("mongoose");
const dish_model_1 = require("./dish.model");
const MerchantSchema = new mongoose_1.Schema({
    merchantName: mongoose_1.SchemaTypes.String,
    location: {
        type: {
            type: mongoose_1.SchemaTypes.String,
        },
        coordinates: [mongoose_1.SchemaTypes.Number, mongoose_1.SchemaTypes.Number],
    },
    dishes: [dish_model_1.DishSchema],
}, {
    timestamps: true
});
exports.MerchantSchema = MerchantSchema;
//# sourceMappingURL=merchant.model.js.map