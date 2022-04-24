"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseTempSchema = void 0;
const mongoose_1 = require("mongoose");
const PurchaseTempSchema = new mongoose_1.Schema({
    enterprise: { type: mongoose_1.SchemaTypes.ObjectId, ref: "Enterprise" },
    premium: mongoose_1.SchemaTypes.String,
    code: mongoose_1.SchemaTypes.String
}, { timestamps: true });
exports.PurchaseTempSchema = PurchaseTempSchema;
//# sourceMappingURL=purchase-temp.js.map