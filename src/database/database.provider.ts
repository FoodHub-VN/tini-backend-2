import {COMMENT_MODEL, DB_CONNECTION, MERCHANT_MODEL, POST_MODEL, USER_MODEL} from './database.constants';
import { ConfigType } from '@nestjs/config';
import mongodbConfig from '../config/mongodb.config';
import { Connection, createConnection } from 'mongoose';
import { User, UserSchema } from './model/user.model';
import { Post, PostSchema } from './model/post.model';
import { CommentSchema } from './model/comment.model';
import {Merchant, MerchantSchema} from "./model/merchant.model";

export const dbProviders = [
    {
        provide: DB_CONNECTION,
        useFactory: (dbConfig: ConfigType<typeof mongodbConfig>): any => {
            return createConnection(dbConfig.uri, {dbName:'nestjs-test'});
        },
        inject: [mongodbConfig.KEY]
    },
    {
        provide: USER_MODEL,
        useFactory: (conn: Connection) => {
            return conn.model<User>("User", UserSchema, "users");
        },
        inject: [DB_CONNECTION]
    },
    {
        provide: POST_MODEL,
        useFactory: (conn: Connection) => {
            return conn.model<Post>("Post", PostSchema, "posts");
        },
        inject: [DB_CONNECTION]
    },
    {
        provide: COMMENT_MODEL,
        useFactory: (conn: Connection) => {
            return conn.model<Comment>("Comment", CommentSchema, "comments");
        },
        inject: [DB_CONNECTION]
    },
    {
        provide: MERCHANT_MODEL,
        useFactory: (conn: Connection) => {
            return conn.model<Merchant>("Merchant", MerchantSchema, "merchants");
        },
        inject: [DB_CONNECTION]
    },
];