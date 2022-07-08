import { Document, Model, Schema } from 'mongoose';
interface User extends Document {
    readonly customerId: string;
    readonly customerName: string;
}
declare type UserModel = Model<User>;
declare const UserSchema: Schema<User, Model<User, any, any>, undefined, {}>;
export { User, UserSchema, UserModel, };
