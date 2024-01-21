/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDateString } from 'class-validator';
export class CreateRentalDto {
  @ApiProperty()
  @IsUUID()
  car_uid: string;

  @ApiProperty()
  @IsDateString()
  date_from: string;

  @ApiProperty()
  @IsDateString()
  date_to: string;
}
