"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PremiumSchema = void 0;
const mongoose_1 = require("mongoose");
const PremiumSchema = new mongoose_1.Schema({
    name: mongoose_1.SchemaTypes.String,
    level: mongoose_1.SchemaTypes.Number,
    pointBonus: mongoose_1.SchemaTypes.Number,
    price: mongoose_1.SchemaTypes.Number
}, { timestamps: true });
exports.PremiumSchema = PremiumSchema;
//# sourceMappingURL=premium.model.js.map