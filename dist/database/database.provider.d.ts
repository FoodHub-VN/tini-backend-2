import { ConfigType } from "@nestjs/config";
import mongodbConfig from "../config/mongodb.config";
import { Connection } from "mongoose";
import { User } from "./model/user.model";
export declare const dbProviders: ({
    provide: string;
    useFactory: (dbConfig: ConfigType<typeof mongodbConfig>) => any;
    inject: string[];
} | {
    provide: string;
    useFactory: (conn: Connection) => import("mongoose").Model<User, {}, {}>;
    inject: string[];
})[];
