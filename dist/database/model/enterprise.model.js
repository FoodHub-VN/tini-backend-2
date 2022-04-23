"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseSchema = void 0;
const mongoose_1 = require("mongoose");
const rxjs_1 = require("rxjs");
const bcrypt_1 = require("bcrypt");
const EnterpriseSchema = new mongoose_1.Schema({
    username: mongoose_1.SchemaTypes.String,
    password: { type: mongoose_1.SchemaTypes.String, select: false },
    fullName: mongoose_1.SchemaTypes.String,
    address: mongoose_1.SchemaTypes.Mixed,
    email: mongoose_1.SchemaTypes.String,
    phone: mongoose_1.SchemaTypes.String,
    premium: mongoose_1.SchemaTypes.String,
    avatar: mongoose_1.SchemaTypes.Mixed
}, { timestamps: true });
exports.EnterpriseSchema = EnterpriseSchema;
async function preSaveHook(next) {
    if (!this.isModified("password"))
        return next();
    const password = await (0, bcrypt_1.hash)(this.password, 12);
    this.set("password", password);
    next();
}
EnterpriseSchema.pre("save", preSaveHook);
function comparePasswordMethod(password) {
    return (0, rxjs_1.from)((0, bcrypt_1.compare)(password, this.password));
}
EnterpriseSchema.methods.comparePassword = comparePasswordMethod;
//# sourceMappingURL=enterprise.model.js.map