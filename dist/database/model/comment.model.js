"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentSchema = void 0;
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.SchemaTypes.ObjectId, ref: "User" },
    service: { type: mongoose_1.SchemaTypes.ObjectId, ref: "Service" },
    rating: mongoose_1.SchemaTypes.Number,
    content: {
        type: mongoose_1.SchemaTypes.String,
        text: true
    },
    title: {
        type: mongoose_1.SchemaTypes.String,
        text: true
    },
    images: [mongoose_1.SchemaTypes.Mixed],
    numOfLike: mongoose_1.SchemaTypes.Number,
    userLiked: [{ type: mongoose_1.SchemaTypes.ObjectId, ref: "User" }]
}, { timestamps: true });
exports.CommentSchema = CommentSchema;
//# sourceMappingURL=comment.model.js.map