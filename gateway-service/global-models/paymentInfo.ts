/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsUUID } from 'class-validator';

enum PaymentStatus {
  PAID = 'PAID',
  REVERSED = 'REVERSED',
}

export class PaymentInfo {
  @ApiProperty()
  @IsUUID()
  payment_uid: string;

  @ApiProperty({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  status: string;

  @ApiProperty()
  @IsNumber()
  price: number;
}
