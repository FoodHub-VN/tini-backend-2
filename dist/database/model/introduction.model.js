"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntroductionSchema = void 0;
const mongoose_1 = require("mongoose");
const IntroductionSchema = new mongoose_1.Schema({
    service: { type: mongoose_1.SchemaTypes.ObjectId, ref: "Service" },
    content: {
        type: mongoose_1.SchemaTypes.String,
        text: true
    }
}, { timestamps: true });
exports.IntroductionSchema = IntroductionSchema;
//# sourceMappingURL=introduction.model.js.map