import { ConfigType } from "@nestjs/config";
import mongodbConfig from "../config/mongodb.config";
import { Connection } from "mongoose";
import { User } from "./model/user.model";
import { CommentModel } from "./model/comment.model";
import { EnterpriseModel } from "./model/enterprise.model";
import { IntroductionModel } from "./model/introduction.model";
import { NotificationModel } from "./model/notification.model";
import { PremiumModel } from "./model/premium.model";
import { PurchaseModel } from "./model/purchase-history.model";
import { ScheduleModel } from "./model/schedule";
import { ScheduleHistoryModel } from "./model/schedule-history.model";
import { ServiceModel } from "./model/service.model";
import { ScoreModel } from "./model/scores.model";
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
    useFactory: (conn: Connection) => import("mongoose").Model<CommentModel, {}, {}>;
    inject: string[];
} | {
    provide: string;
    useFactory: (conn: Connection) => import("mongoose").Model<EnterpriseModel, {}, {}>;
    inject: string[];
} | {
    provide: string;
    useFactory: (conn: Connection) => import("mongoose").Model<IntroductionModel, {}, {}>;
    inject: string[];
} | {
    provide: string;
    useFactory: (conn: Connection) => import("mongoose").Model<NotificationModel, {}, {}>;
    inject: string[];
} | {
    provide: string;
    useFactory: (conn: Connection) => import("mongoose").Model<PremiumModel, {}, {}>;
    inject: string[];
} | {
    provide: string;
    useFactory: (conn: Connection) => import("mongoose").Model<PurchaseModel, {}, {}>;
    inject: string[];
} | {
    provide: string;
    useFactory: (conn: Connection) => import("mongoose").Model<ScheduleModel, {}, {}>;
    inject: string[];
} | {
    provide: string;
    useFactory: (conn: Connection) => import("mongoose").Model<ScheduleHistoryModel, {}, {}>;
    inject: string[];
} | {
    provide: string;
    useFactory: (conn: Connection) => import("mongoose").Model<ServiceModel, {}, {}>;
    inject: string[];
} | {
    provide: string;
    useFactory: (conn: Connection) => import("mongoose").Model<ScoreModel, {}, {}>;
    inject: string[];
})[];
