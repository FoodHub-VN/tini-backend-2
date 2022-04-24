"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreSchema = void 0;
const mongoose_1 = require("mongoose");
const ScoreSchema = new mongoose_1.Schema({
    service: { type: mongoose_1.SchemaTypes.ObjectId, ref: "Service" },
    userRate: { type: mongoose_1.SchemaTypes.ObjectId, ref: "User" },
    scores: [mongoose_1.SchemaTypes.Number],
    commentId: { type: mongoose_1.SchemaTypes.ObjectId, ref: "Score" }
}, { timestamps: true });
exports.ScoreSchema = ScoreSchema;
//# sourceMappingURL=scores.model.js.map