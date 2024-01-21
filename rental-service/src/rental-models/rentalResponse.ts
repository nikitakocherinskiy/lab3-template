/* eslint-disable prettier/prettier */
import { IsUUID, IsDateString, IsEnum } from 'class-validator';

export enum RentalStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  CANCELED = 'CANCELED',
}

export class RentalResponse {
  @IsUUID()
  rental_uid: string;

  @IsEnum(RentalStatus)
  status: string;

  @IsDateString()
  date_from: Date;

  @IsDateString()
  date_to: Date;

  car_uid: string;

  payment_uid: string;
}
