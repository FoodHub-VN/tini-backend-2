"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseSchema = void 0;
const mongoose_1 = require("mongoose");
const PurchaseSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.SchemaTypes.ObjectId, ref: "User" },
    enterprise: { type: mongoose_1.SchemaTypes.ObjectId, ref: "Enterprise" },
    date: mongoose_1.SchemaTypes.Date,
    premium: { type: mongoose_1.SchemaTypes.ObjectId, ref: "Premium" },
}, { timestamps: true });
exports.PurchaseSchema = PurchaseSchema;
//# sourceMappingURL=purchase-history.model.js.map