"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentSchema = void 0;
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    owner: {
        type: mongoose_1.SchemaTypes.Number,
        ref: 'User'
    },
    post: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'Post'
    },
    title: mongoose_1.SchemaTypes.String,
    content: mongoose_1.SchemaTypes.String,
    timeComment: mongoose_1.SchemaTypes.Number,
}, {
    timestamps: true,
});
exports.CommentSchema = CommentSchema;
//# sourceMappingURL=comment.model.js.map