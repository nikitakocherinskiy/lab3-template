/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDateString, IsEnum } from 'class-validator';
import { CarInfo } from './carInfo';
import { PaymentInfo } from './paymentInfo';

export enum RentalStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  CANCELED = 'CANCELED',
}

export class RentalResponse {
  @ApiProperty()
  @IsUUID()
  rentalUid: string;

  @ApiProperty({ enum: RentalStatus })
  @IsEnum(RentalStatus)
  status: string;

  @ApiProperty()
  @IsDateString()
  dateFrom: string;

  @ApiProperty()
  @IsDateString()
  dateTo: string;

  @ApiProperty()
  car: CarInfo;

  @ApiProperty()
  payment: PaymentInfo;
}
