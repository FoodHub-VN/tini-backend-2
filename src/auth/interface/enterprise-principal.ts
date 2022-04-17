import { RolesType } from "../../shared/roles-type.enum";

export class EnterprisePrincipal{
  username: string;
  fullName: string;
  email: string;
  id: string;
  phone: string;
  role: RolesType;
}