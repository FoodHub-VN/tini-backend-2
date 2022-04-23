"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSchema = void 0;
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Types.ObjectId, ref: "User" },
    service: { type: mongoose_1.Types.ObjectId, ref: "Service" },
    hadRead: mongoose_1.SchemaTypes.Boolean,
    content: mongoose_1.SchemaTypes.String,
    type: mongoose_1.SchemaTypes.Number,
    extraData: [mongoose_1.SchemaTypes.String],
    date: mongoose_1.SchemaTypes.Number
}, { timestamps: true });
exports.NotificationSchema = NotificationSchema;
//# sourceMappingURL=notification.model.js.map