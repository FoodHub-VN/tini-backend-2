import { Document, Model, Schema } from "mongoose";
import { Address } from "./user.model";
import { FileUploaded } from "../../upload/interface/upload.interface";
interface Service extends Document {
    name: string;
    avatar: FileUploaded | undefined;
    images: FileUploaded[] | undefined;
    enterprise: string;
    address: Address;
    email: string;
    phone: string;
    rankingPoint: number;
    openTime: string;
    closeTime: string;
    maxPrice: number;
    minPrice: number;
    imgCmtCount: number;
    textCmtCount: number;
    category: string;
    introduction: string;
    shortIntroduction: string;
}
declare type ServiceModel = Model<Service>;
declare const ServiceSchema: Schema<Service, Model<Service, any, any>, undefined, {}>;
export { Service, ServiceSchema, ServiceModel };
