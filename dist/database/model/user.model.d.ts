import { Document, Model, Schema } from 'mongoose';
interface User extends Document {
    readonly _id: number;
    readonly customerName: string;
    readonly post: string[];
    readonly favoritePost: string[];
    readonly likePost: string[];
}
declare type UserModel = Model<User>;
declare const UserSchema: Schema<User, Model<User, any, any>, undefined, {}>;
export { User, UserSchema, UserModel, };
