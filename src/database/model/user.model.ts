import {Document, Model, Schema, SchemaType, SchemaTypes} from "mongoose";
import {from, Observable} from "rxjs";
import {hash, compare} from "bcrypt";
import {RolesType} from "../../shared/roles-type.enum";

export interface Address extends Object{
    readonly province: number;
    readonly district: number;
    readonly village: number;
    readonly detail: string;
}
interface User extends Document {
    comparePassword(password: string): Observable<boolean>;
    readonly username: string;
    readonly email: string;
    readonly phone: number;
    readonly gender: "male" | "female";
    readonly birthday: Date;
    readonly address: Address;
    readonly password: string;
    readonly firstname: string;
    readonly lastname: string;
    readonly followedService: Array<any>;
}

type UserModel = Model<User>;

const UserSchema = new Schema<User>({
    username: SchemaTypes.String,
    email: SchemaTypes.String,
    password: SchemaTypes.String,
    firstname: SchemaTypes.String,
    lastname: SchemaTypes.String,
    phone: SchemaTypes.Number,
    gender: SchemaTypes.String,
    birthday: SchemaTypes.Date,
    address: SchemaTypes.Mixed,
    followedService: [SchemaTypes.ObjectId]
}, {
    timestamps: true
});

async function preSaveHook(next) {
    // Only run this function if password was modified
    if (!this.isModified('password')) return next();

    // Hash the password
    const password = await hash(this.password, 12);
    this.set('password', password);

    next();
}

UserSchema.pre<User>('save', preSaveHook);

function comparePasswordMethod(password: string): Observable<boolean> {
    return from(compare(password, this.password));
}

UserSchema.methods.comparePassword = comparePasswordMethod;

export {
    User,
    UserSchema,
    UserModel,
    comparePasswordMethod
};
