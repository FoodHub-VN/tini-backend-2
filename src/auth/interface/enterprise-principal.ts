import { RolesType } from "../../shared/roles-type.enum";

export class EnterprisePrincipal{
  username: string;
  email: string;
  id: string;
  phone: number;
  role: RolesType;
}