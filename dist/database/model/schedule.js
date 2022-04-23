"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleSchema = void 0;
const mongoose_1 = require("mongoose");
const ScheduleSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.SchemaTypes.ObjectId, ref: "User" },
    service: { type: mongoose_1.SchemaTypes.ObjectId, ref: "Service" },
    timeServe: mongoose_1.SchemaTypes.Date
}, { timestamps: true });
exports.ScheduleSchema = ScheduleSchema;
//# sourceMappingURL=schedule.js.map