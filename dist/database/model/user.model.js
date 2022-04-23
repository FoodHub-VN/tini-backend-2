"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePasswordMethod = exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
const rxjs_1 = require("rxjs");
const bcrypt_1 = require("bcrypt");
const UserSchema = new mongoose_1.Schema({
    username: mongoose_1.SchemaTypes.String,
    email: mongoose_1.SchemaTypes.String,
    password: { type: mongoose_1.SchemaTypes.String, select: false },
    fullName: mongoose_1.SchemaTypes.String,
    phone: mongoose_1.SchemaTypes.String,
    gender: mongoose_1.SchemaTypes.String,
    birthday: mongoose_1.SchemaTypes.Date,
    address: mongoose_1.SchemaTypes.Mixed,
    followedService: [{ type: mongoose_1.SchemaTypes.ObjectId, ref: 'Service' }],
    avatar: {
        type: mongoose_1.SchemaTypes.Mixed,
    }
}, {
    timestamps: true
});
exports.UserSchema = UserSchema;
async function preSaveHook(next) {
    if (!this.isModified('password'))
        return next();
    const password = await (0, bcrypt_1.hash)(this.password, 12);
    this.set("password", password);
    next();
}
async function postDeleteHook(user) {
    const comments = this.model;
}
UserSchema.pre("save", preSaveHook);
UserSchema.post("remove", async function (user) {
    const comments = await this.model("Comment").find({ user: this._id }).exec();
    await Promise.all(comments.map((comment) => {
        return comment.remove();
    }));
    const notis = await this.model("Notification").find({ user: this._id }).exec();
    await Promise.all(notis.map((noti) => {
        return noti.remove();
    }));
    const scheduleHistories = await this.model("ScheduleHistory").find({ user: this._id }).exec();
    await Promise.all(scheduleHistories.map((scheduleHistory) => {
        return scheduleHistory.remove();
    }));
    const purchaseHistories = await this.model("Purchase").find({ user: this._id }).exec();
    await Promise.all(purchaseHistories.map((purchaseHistory) => {
        return purchaseHistory.remove();
    }));
    const schedules = await this.model("Schedule").find({ user: this._id }).exec();
    await Promise.all(schedules.map((schedule) => {
        return schedule.remove();
    }));
    return;
});
function comparePasswordMethod(password) {
    return (0, rxjs_1.from)((0, bcrypt_1.compare)(password, this.password));
}
exports.comparePasswordMethod = comparePasswordMethod;
UserSchema.methods.comparePassword = comparePasswordMethod;
//# sourceMappingURL=user.model.js.map