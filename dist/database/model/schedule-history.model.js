"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleHistorySchema = void 0;
const mongoose_1 = require("mongoose");
const ScheduleHistorySchema = new mongoose_1.Schema({
    user: { type: mongoose_1.SchemaTypes.ObjectId, ref: "User" },
    service: { type: mongoose_1.SchemaTypes.ObjectId, ref: "Service" },
    date: mongoose_1.SchemaTypes.Date,
    hasRating: mongoose_1.SchemaTypes.Boolean
}, { timestamps: true });
exports.ScheduleHistorySchema = ScheduleHistorySchema;
//# sourceMappingURL=schedule-history.model.js.map