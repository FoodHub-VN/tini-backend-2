"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSchema = void 0;
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    owner: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'User'
    },
    title: mongoose_1.SchemaTypes.String,
    image: [mongoose_1.SchemaTypes.Mixed],
    content: mongoose_1.SchemaTypes.String,
    hashtag: [mongoose_1.SchemaTypes.String],
    upVotedBy: [{
            type: mongoose_1.SchemaTypes.ObjectId,
            ref: 'User',
        }],
    downVotedBy: [{
            type: mongoose_1.SchemaTypes.ObjectId,
            ref: 'User',
        }],
    numView: mongoose_1.SchemaTypes.Number,
    comment: [{
            type: mongoose_1.SchemaTypes.ObjectId,
            ref: 'Comment',
        }],
    visitedTime: mongoose_1.SchemaTypes.Number,
}, {
    timestamps: true,
});
exports.PostSchema = PostSchema;
//# sourceMappingURL=post.model.js.map