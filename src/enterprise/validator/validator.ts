import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value)
    const data = value["data"];
    // value.data = JSON.parse(data);
    console.log(value)
    return value;
  }
}