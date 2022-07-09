"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantSchema = void 0;
const mongoose_1 = require("mongoose");
const MerchantSchema = new mongoose_1.Schema({
    merchantName: mongoose_1.SchemaTypes.String,
    location: {
        type: {
            type: mongoose_1.SchemaTypes.String,
        },
        coordinates: [mongoose_1.SchemaTypes.Number, mongoose_1.SchemaTypes.Number],
    },
}, {
    timestamps: true
});
exports.MerchantSchema = MerchantSchema;
//# sourceMappingURL=merchant.model.js.map