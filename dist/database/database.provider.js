"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbProviders = void 0;
const database_constants_1 = require("./database.constants");
const mongodb_config_1 = require("../config/mongodb.config");
const mongoose_1 = require("mongoose");
const user_model_1 = require("./model/user.model");
const post_model_1 = require("./model/post.model");
const comment_model_1 = require("./model/comment.model");
const merchant_model_1 = require("./model/merchant.model");
exports.dbProviders = [
    {
        provide: database_constants_1.DB_CONNECTION,
        useFactory: (dbConfig) => {
            return (0, mongoose_1.createConnection)(dbConfig.uri, { dbName: 'nestjs-test' });
        },
        inject: [mongodb_config_1.default.KEY]
    },
    {
        provide: database_constants_1.USER_MODEL,
        useFactory: (conn) => {
            return conn.model("User", user_model_1.UserSchema, "users");
        },
        inject: [database_constants_1.DB_CONNECTION]
    },
    {
        provide: database_constants_1.POST_MODEL,
        useFactory: (conn) => {
            return conn.model("Post", post_model_1.PostSchema, "posts");
        },
        inject: [database_constants_1.DB_CONNECTION]
    },
    {
        provide: database_constants_1.COMMENT_MODEL,
        useFactory: (conn) => {
            return conn.model("Comment", comment_model_1.CommentSchema, "comments");
        },
        inject: [database_constants_1.DB_CONNECTION]
    },
    {
        provide: database_constants_1.MERCHANT_MODEL,
        useFactory: (conn) => {
            return conn.model("Merchant", merchant_model_1.MerchantSchema, "merchants");
        },
        inject: [database_constants_1.DB_CONNECTION]
    },
];
//# sourceMappingURL=database.provider.js.map