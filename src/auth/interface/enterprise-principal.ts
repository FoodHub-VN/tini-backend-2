import { RolesType } from "../../shared/roles-type.enum";

export class EnterprisePrincipal{
  username: string;
  name: string;
  email: string;
  id: string;
  phone: string;
  role: RolesType;
}