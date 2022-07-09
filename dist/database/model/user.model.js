"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    _id: Number,
    customerName: mongoose_1.SchemaTypes.String,
    post: [{
            type: mongoose_1.SchemaTypes.ObjectId,
            ref: 'Post'
        }],
    favoritePost: [{
            type: mongoose_1.SchemaTypes.ObjectId,
            ref: 'Post'
        }],
    likePost: [{
            type: mongoose_1.SchemaTypes.ObjectId,
            ref: 'Post'
        }]
}, {
    timestamps: true
});
exports.UserSchema = UserSchema;
//# sourceMappingURL=user.model.js.map