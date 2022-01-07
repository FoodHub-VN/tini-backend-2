import { Document, Model, Schema, SchemaTypes } from "mongoose";
import { from, Observable } from "rxjs";
import { Address } from "./user.model";
import { compare, hash } from "bcrypt";

interface Enterprise extends Document {
  comparePassword(password: string): Observable<boolean>;

  username: string;
  password: string;
  name: string;
  address: Address;
  email: string;
  phone: number;
  premium: string;
}

type EnterpriseModel = Model<Enterprise>;

const EnterpriseSchema = new Schema<Enterprise>({
  username: SchemaTypes.String,
  password: SchemaTypes.String,
  name: SchemaTypes.String,
  address: SchemaTypes.Mixed,
  email: SchemaTypes.String,
  phone: SchemaTypes.Number,
  premium: SchemaTypes.ObjectId
}, {timestamps: true});

async function preSaveHook(next) {
  // Only run this function if password was modified
  if (!this.isModified("password")) return next();

  // Hash the password
  const password = await hash(this.password, 12);
  this.set("password", password);
  next();
}

EnterpriseSchema.pre<Enterprise>("save", preSaveHook);

function comparePasswordMethod(password: string): Observable<boolean> {
  return from(compare(password, this.password));
}

EnterpriseSchema.methods.comparePassword = comparePasswordMethod;

export { Enterprise, EnterpriseSchema, EnterpriseModel };