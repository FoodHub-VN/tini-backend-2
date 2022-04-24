import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const data = value["data"];
    // value.data = JSON.parse(data);
    return value;
  }
}