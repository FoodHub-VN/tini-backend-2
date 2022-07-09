import { ConfigType } from '@nestjs/config';
import mongodbConfig from '../config/mongodb.config';
import { Connection } from 'mongoose';
import { User } from './model/user.model';
import { Post } from './model/post.model';
import { Merchant } from "./model/merchant.model";
export declare const dbProviders: ({
    provide: string;
    useFactory: (dbConfig: ConfigType<typeof mongodbConfig>) => any;
    inject: string[];
} | {
    provide: string;
    useFactory: (conn: Connection) => import("mongoose").Model<User, {}, {}>;
    inject: string[];
} | {
    provide: string;
    useFactory: (conn: Connection) => import("mongoose").Model<Post, {}, {}>;
    inject: string[];
} | {
    provide: string;
    useFactory: (conn: Connection) => import("mongoose").Model<Comment, {}, {}>;
    inject: string[];
} | {
    provide: string;
    useFactory: (conn: Connection) => import("mongoose").Model<Merchant, {}, {}>;
    inject: string[];
})[];
