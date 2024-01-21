/* eslint-disable prettier/prettier */
import { IsUUID, IsDateString } from 'class-validator';
export class CreateRentalDto {
  @IsUUID()
  carUid: string;

  @IsDateString()
  dateFrom: string;

  @IsDateString()
  dateTo: string;
}
