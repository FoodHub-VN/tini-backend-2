"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    customerId: mongoose_1.SchemaTypes.String,
    customerName: mongoose_1.SchemaTypes.String
}, {
    timestamps: true,
});
exports.UserSchema = UserSchema;
//# sourceMappingURL=user.model.js.map