"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceSchema = void 0;
const mongoose_1 = require("mongoose");
const ServiceSchema = new mongoose_1.Schema({
    name: {
        type: mongoose_1.SchemaTypes.String,
    },
    avatar: mongoose_1.SchemaTypes.Mixed,
    images: [mongoose_1.SchemaTypes.Mixed],
    enterprise: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'Enterprise' },
    address: mongoose_1.SchemaTypes.Mixed,
    email: mongoose_1.SchemaTypes.String,
    phone: mongoose_1.SchemaTypes.String,
    rankingPoint: mongoose_1.SchemaTypes.Number,
    openTime: mongoose_1.SchemaTypes.String,
    closeTime: mongoose_1.SchemaTypes.String,
    maxPrice: mongoose_1.SchemaTypes.Number,
    minPrice: mongoose_1.SchemaTypes.Number,
    imgCmtCount: mongoose_1.SchemaTypes.Number,
    textCmtCount: mongoose_1.SchemaTypes.Number,
    introduction: mongoose_1.SchemaTypes.String,
    shortIntroduction: mongoose_1.SchemaTypes.String,
    category: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'Category' },
}, { timestamps: true });
exports.ServiceSchema = ServiceSchema;
ServiceSchema.index({ name: 'text' });
ServiceSchema.post("remove", async function (service) {
    const intro = await this.model("Introduction").findOne({ service: this._id }).exec();
    await intro.remove();
    const comments = await this.model("Comment").find({ service: this._id }).exec();
    await Promise.all(comments.map((comment) => {
        return comment.remove();
    }));
    const notifications = await this.model("Notification").find({ service: this._id }).exec();
    await Promise.all(notifications.map((noti) => {
        return noti.remove();
    }));
    const scheduleHistories = await this.model("ScheduleHistory").find({ service: this._id }).exec();
    await Promise.all(scheduleHistories.map((schedule) => {
        return schedule.remove();
    }));
    const premiumHistory = await this.model("Purchase").find({ service: this._id }).exec();
    await Promise.all(premiumHistory.map((purchase) => {
        return purchase.remove();
    }));
    const schedules = await this.model("Schedule").find({ service: this._id }).exec();
    await Promise.all(schedules.map((schedule) => {
        return schedule.remove();
    }));
    const scores = await this.model("Score").find({ service: this._id }).exec();
    await Promise.all(scores.map((score) => {
        return score.remove();
    }));
    return;
});
//# sourceMappingURL=service.model.js.map