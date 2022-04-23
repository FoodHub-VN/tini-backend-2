"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbProviders = void 0;
const database_constants_1 = require("./database.constants");
const mongodb_config_1 = require("../config/mongodb.config");
const mongoose_1 = require("mongoose");
const user_model_1 = require("./model/user.model");
const comment_model_1 = require("./model/comment.model");
const enterprise_model_1 = require("./model/enterprise.model");
const introduction_model_1 = require("./model/introduction.model");
const notification_model_1 = require("./model/notification.model");
const premium_model_1 = require("./model/premium.model");
const purchase_history_model_1 = require("./model/purchase-history.model");
const schedule_1 = require("./model/schedule");
const schedule_history_model_1 = require("./model/schedule-history.model");
const service_model_1 = require("./model/service.model");
const category_model_1 = require("./model/category.model");
const scores_model_1 = require("./model/scores.model");
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
        provide: database_constants_1.COMMENT_MODEL,
        useFactory: (conn) => {
            return conn.model("Comment", comment_model_1.CommentSchema, "comments");
        },
        inject: [database_constants_1.DB_CONNECTION]
    },
    {
        provide: database_constants_1.ENTERPRISE_MODEL,
        useFactory: (conn) => {
            return conn.model("Enterprise", enterprise_model_1.EnterpriseSchema, "enterprises");
        },
        inject: [database_constants_1.DB_CONNECTION]
    },
    {
        provide: database_constants_1.INTRODUCTION_MODEL,
        useFactory: (conn) => {
            return conn.model("Introduction", introduction_model_1.IntroductionSchema, "introductions");
        },
        inject: [database_constants_1.DB_CONNECTION]
    },
    {
        provide: database_constants_1.NOTIFICATION_MODEL,
        useFactory: (conn) => {
            return conn.model("Notification", notification_model_1.NotificationSchema, "notifications");
        },
        inject: [database_constants_1.DB_CONNECTION]
    },
    {
        provide: database_constants_1.PREMIUM_MODEL,
        useFactory: (conn) => {
            return conn.model("Premium", premium_model_1.PremiumSchema, "premiums");
        },
        inject: [database_constants_1.DB_CONNECTION]
    },
    {
        provide: database_constants_1.PURCHASE_MODEL,
        useFactory: (conn) => {
            return conn.model("Purchase", purchase_history_model_1.PurchaseSchema, "purchaseds");
        },
        inject: [database_constants_1.DB_CONNECTION]
    },
    {
        provide: database_constants_1.SCHEDULE_MODEL,
        useFactory: (conn) => {
            return conn.model("Schedule", schedule_1.ScheduleSchema, "schedules");
        },
        inject: [database_constants_1.DB_CONNECTION]
    },
    {
        provide: database_constants_1.SCHEDULE_HISTORY_MODEL,
        useFactory: (conn) => {
            return conn.model("ScheduleHistory", schedule_history_model_1.ScheduleHistorySchema, "schedule_historys");
        },
        inject: [database_constants_1.DB_CONNECTION]
    },
    {
        provide: database_constants_1.SERVICE_MODEL,
        useFactory: (conn) => {
            return conn.model("Service", service_model_1.ServiceSchema, "services");
        },
        inject: [database_constants_1.DB_CONNECTION]
    },
    {
        provide: database_constants_1.CATEGORY_MODEL,
        useFactory: (conn) => {
            return conn.model("Category", category_model_1.CategorySchema, "categories");
        },
        inject: [database_constants_1.DB_CONNECTION]
    },
    {
        provide: database_constants_1.SCORE_MODEL,
        useFactory: (conn) => {
            return conn.model("Score", scores_model_1.ScoreSchema, "scores");
        },
        inject: [database_constants_1.DB_CONNECTION]
    }
];
//# sourceMappingURL=database.provider.js.map