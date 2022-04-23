"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategorySchema = void 0;
const mongoose_1 = require("mongoose");
const CategorySchema = new mongoose_1.Schema({
    category: String,
}, { timestamps: true });
exports.CategorySchema = CategorySchema;
CategorySchema.post('remove', async function () {
    const serviceModel = await this.model("Category").find({ category: this._id }).exec();
    await Promise.all(serviceModel.map((service) => {
        return service.remove();
    }));
    return;
});
//# sourceMappingURL=category.model.js.map