import { ApiProperty } from "@nestjs/swagger";
import { EnterPriseNewServiceDataDto } from "../../enterprise/dto/enterprise-new-service.dto";

export class ModifyServiceDto extends EnterPriseNewServiceDataDto{
  serviceId: string;
}