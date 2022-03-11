import {
    CATEGORY_MODEL,
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
import { CategorySchema } from "./model/category.model";

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
            return conn.model<CommentModel>("Comment", CommentSchema, "comments");
        },
        inject: [DB_CONNECTION]
    },
    {
        provide: ENTERPRISE_MODEL,
        useFactory: (conn: Connection) => {
            return conn.model<EnterpriseModel>("Enterprise", EnterpriseSchema, "enterprises");
        },
        inject: [DB_CONNECTION]
    },
    {
        provide: INTRODUCTION_MODEL,
        useFactory: (conn: Connection) => {
            return conn.model<IntroductionModel>("Introduction", IntroductionSchema, "introductions");
        },
        inject: [DB_CONNECTION]
    },
    {
        provide: NOTIFICATION_MODEL,
        useFactory: (conn: Connection) => {
            return conn.model<NotificationModel>("Notification", NotificationSchema, "notidications");
        },
        inject: [DB_CONNECTION]
    },
    {
        provide: PREMIUM_MODEL,
        useFactory: (conn: Connection) => {
            return conn.model<PremiumModel>("Premium", PremiumSchema, "premiums");
        },
        inject: [DB_CONNECTION]
    },
    {
        provide: PURCHASE_MODEL,
        useFactory: (conn: Connection) => {
            return conn.model<PurchaseModel>("Purchase", PurchaseSchema, "purchaseds");
        },
        inject: [DB_CONNECTION]
    },
    {
        provide: SCHEDULE_MODEL,
        useFactory: (conn: Connection) => {
            return conn.model<ScheduleModel>("Schedule", ScheduleSchema, "schedules");
        },
        inject: [DB_CONNECTION]
    },
    {
        provide: SCHEDULE_HISTORY_MODEL,
        useFactory: (conn: Connection) => {
            return conn.model<ScheduleHistoryModel>("ScheduleHistory", ScheduleHistorySchema, "schedule_historys");
        },
        inject: [DB_CONNECTION]
    },
    {
        provide: SERVICE_MODEL,
        useFactory: (conn: Connection)=>{
            return conn.model<ServiceModel>("Service", ServiceSchema, "services");
        },
        inject: [DB_CONNECTION]
    },
    {
        provide: CATEGORY_MODEL,
        useFactory: (conn: Connection)=>{
            return conn.model<ServiceModel>("Category", CategorySchema, "categories");
        },
        inject: [DB_CONNECTION]
    }


];