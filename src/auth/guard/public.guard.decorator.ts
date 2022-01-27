import { ExecutionContext, SetMetadata, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { RolesType } from "../../shared/roles-type.enum";
import { METADATA } from "../../shared/api-metadata";

export const Public = ()=>{
  return SetMetadata(METADATA.PUBLIC, true);
}