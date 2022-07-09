"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DishSchema = void 0;
const mongoose_1 = require("mongoose");
const DishSchema = new mongoose_1.Schema({
    dishName: mongoose_1.SchemaTypes.String,
    imageUrl: mongoose_1.SchemaTypes.String,
    description: mongoose_1.SchemaTypes.String,
    cost: mongoose_1.SchemaTypes.Number,
}, {
    timestamps: true,
});
exports.DishSchema = DishSchema;
//# sourceMappingURL=dish.model.js.map