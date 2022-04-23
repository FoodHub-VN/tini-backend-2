import { Document, Model, Schema } from "mongoose";
import { Observable } from "rxjs";
import { FileUploaded } from "../../upload/interface/upload.interface";
export interface Address extends Object {
    province: string;
    district: string;
    village: string;
    detail: string;
}
interface User extends Document {
    comparePassword(password: string): Observable<boolean>;
    readonly username: string;
    readonly email: string;
    readonly phone: string;
    readonly gender: "male" | "female";
    readonly birthday: Date;
    readonly address: Address;
    readonly password: string;
    readonly fullName: string;
    readonly followedService: Array<any>;
    readonly avatar: FileUploaded | null;
}
declare type UserModel = Model<User>;
declare const UserSchema: Schema<User, Model<User, any, any>, undefined, {}>;
declare function comparePasswordMethod(password: string): Observable<boolean>;
export { User, UserSchema, UserModel, comparePasswordMethod };
