/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDateString, IsEnum } from 'class-validator';
import { PaymentInfo } from './paymentInfo';
import { RentalStatus } from './rentalResponse';
export class CreateRentalResponse {
  @ApiProperty()
  @IsUUID()
  rentalUid: string;

  @ApiProperty({ enum: RentalStatus })
  @IsEnum(RentalStatus)
  status: string;

  @ApiProperty()
  @IsUUID()
  carUid: string;

  @ApiProperty()
  @IsDateString()
  dateFrom: string;

  @ApiProperty()
  @IsDateString()
  dateTo: string;

  @ApiProperty()
  payment: PaymentInfo;
}
