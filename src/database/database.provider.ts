import {
    CATEGORY_MODEL,
    COMMENT_MODEL,
    DB_CONNECTION,
    ENTERPRISE_MODEL,
    INTRODUCTION_MODEL,
    NOTIFICATION_MODEL,
    PREMIUM_MODEL,
    PURCHASE_MODEL, PURCHASE_TEMP_MODEL,
    SCHEDULE_HISTORY_MODEL,
    SCHEDULE_MODEL, SCORE_MODEL,
    SERVICE_MODEL,
    USER_MODEL
} from "./database.constants";
import { ConfigType } from "@nestjs/config";
import mongodbConfig from "../config/mongodb.config";
import { Connection, createConnection } from "mongoose";
import { User, UserSchema } from "./model/user.model";

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

];