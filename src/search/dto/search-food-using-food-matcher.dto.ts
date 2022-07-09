import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty} from 'class-validator';

export class SearchVendorByLatLngDto {
  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  readonly lat: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  readonly lng: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  readonly radius: number;
}