import {
    COMMENT_MODEL,
    DB_CONNECTION,
    ENTERPRISE_MODEL,
    INTRODUCTION_MODEL,
    NOTIFICATION_MODEL,
    PREMIUM_MODEL,
    PURCHASE_MODEL,
    SCHEDULE_HISTORY_MODEL,
    SCHEDULE_MODEL,
    SERVICE_MODEL,
    USER_MODEL
} from "./database.constants";
import { ConfigType } from "@nestjs/config";
import mongodbConfig from "../config/mongodb.config";
import { Connection, createConnection } from "mongoose";
import { User, UserSchema } from "./model/user.model";
import { CommentModel, CommentSchema } from "./model/comment.model";
import { EnterpriseModel, EnterpriseSchema } from "./model/enterprise.model";
import { IntroductionModel, IntroductionSchema } from "./model/introduction.model";
import { NotificationModel, NotificationSchema } from "./model/notification.model";
import { PremiumModel, PremiumSchema } from "./model/premium.model";
import { PurchaseModel, PurchaseSchema } from "./model/purchase-history.model";
import { ScheduleModel, ScheduleSchema } from "./model/schedule";
import { ScheduleHistoryModel, ScheduleHistorySchema } from "./model/schedule-history.model";
import { ServiceModel, ServiceSchema } from "./model/service.model";

export const dbProviders = [
    {
        provide: DB_CONNECTION,
        useFactory: (dbConfig: ConfigType<typeof mongodbConfig>): Connection => {
            return createConnection(dbConfig.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
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
        provide: COMMENT_MODEL,
        useFactory: (conn: Connection) => {
            return conn.model<CommentModel>("CommentModel", CommentSchema, "comments");
        },
        inject: [DB_CONNECTION]
    },
    {
        provide: ENTERPRISE_MODEL,
        useFactory: (conn: Connection) => {
            return conn.model<EnterpriseModel>("EnterpriseModel", EnterpriseSchema, "enterprises");
        },
        inject: [DB_CONNECTION]
    },
    {
        provide: INTRODUCTION_MODEL,
        useFactory: (conn: Connection) => {
            return conn.model<IntroductionModel>("IntroductionModel", IntroductionSchema, "introductions");
        },
        inject: [DB_CONNECTION]
    },
    {
        provide: NOTIFICATION_MODEL,
        useFactory: (conn: Connection) => {
            return conn.model<NotificationModel>("NotificationModel", NotificationSchema, "notidications");
        },
        inject: [DB_CONNECTION]
    },
    {
        provide: PREMIUM_MODEL,
        useFactory: (conn: Connection) => {
            return conn.model<PremiumModel>("PremiumModel", PremiumSchema, "premiums");
        },
        inject: [DB_CONNECTION]
    },
    {
        provide: PURCHASE_MODEL,
        useFactory: (conn: Connection) => {
            return conn.model<PurchaseModel>("PurchaseModel", PurchaseSchema, "purchaseds");
        },
        inject: [DB_CONNECTION]
    },
    {
        provide: SCHEDULE_MODEL,
        useFactory: (conn: Connection) => {
            return conn.model<ScheduleModel>("ScheduleModel", ScheduleSchema, "schedules");
        },
        inject: [DB_CONNECTION]
    },
    {
        provide: SCHEDULE_HISTORY_MODEL,
        useFactory: (conn: Connection) => {
            return conn.model<ScheduleHistoryModel>("ScheduleHistoryModel", ScheduleHistorySchema, "schedule_historys");
        },
        inject: [DB_CONNECTION]
    },
    {
        provide: SERVICE_MODEL,
        useFactory: (conn: Connection)=>{
            return conn.model<ServiceModel>("ServiceModel", ServiceSchema, "services");
        },
        inject: [DB_CONNECTION]
    }


];