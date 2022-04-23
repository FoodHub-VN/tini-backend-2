import { Document, Model, Schema } from "mongoose";
import { Observable } from "rxjs";
import { Address } from "./user.model";
import { FileUploaded } from "../../upload/interface/upload.interface";
interface Enterprise extends Document {
    comparePassword(password: string): Observable<boolean>;
    username: string;
    password: string;
    fullName: string;
    address: Address;
    email: string;
    phone: string;
    premium: string;
    avatar: FileUploaded;
}
declare type EnterpriseModel = Model<Enterprise>;
declare const EnterpriseSchema: Schema<Enterprise, Model<Enterprise, any, any>, undefined, {}>;
export { Enterprise, EnterpriseSchema, EnterpriseModel };
