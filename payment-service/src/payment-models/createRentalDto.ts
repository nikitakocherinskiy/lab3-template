/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDateString } from 'class-validator';
export class CreateRentalDto {
  @ApiProperty()
  @IsUUID()
  carUid: string;

  @ApiProperty()
  @IsDateString()
  dateFrom: string;

  @ApiProperty()
  @IsDateString()
  dateTo: string;
}
