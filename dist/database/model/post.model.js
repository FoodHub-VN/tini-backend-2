"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSchema = void 0;
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    owner: {
        type: mongoose_1.SchemaTypes.Number,
        ref: 'User'
    },
    title: {
        type: mongoose_1.SchemaTypes.String,
        text: true
    },
    content: {
        type: mongoose_1.SchemaTypes.String,
        text: true
    },
    images: [mongoose_1.SchemaTypes.String],
    hashtag: [mongoose_1.SchemaTypes.String],
    upVotedBy: [{
            type: mongoose_1.SchemaTypes.Number,
            ref: 'User',
        }],
    downVotedBy: [{
            type: mongoose_1.SchemaTypes.Number,
            ref: 'User',
        }],
    numView: mongoose_1.SchemaTypes.Number,
    comment: [{
            type: mongoose_1.SchemaTypes.ObjectId,
            ref: 'Comment',
        }],
    visitedTime: mongoose_1.SchemaTypes.Number,
    rating: mongoose_1.SchemaTypes.Number,
    lat: mongoose_1.SchemaTypes.String,
    lng: mongoose_1.SchemaTypes.String,
    locationName: mongoose_1.SchemaTypes.String,
    locationId: mongoose_1.SchemaTypes.String
}, {
    timestamps: true,
});
exports.PostSchema = PostSchema;
//# sourceMappingURL=post.model.js.map