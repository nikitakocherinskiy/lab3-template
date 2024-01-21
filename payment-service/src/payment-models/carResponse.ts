/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';

enum CarType {
  SEDAN = 'SEDAN',
  SUV = 'SUV',
  MINIVAN = 'MINIVAN',
  ROADSTER = 'ROADSTER',
}

export class CarResponse {
  @ApiProperty()
  @IsUUID()
  carUid: string;

  @ApiProperty()
  @IsString()
  brand: string;

  @ApiProperty()
  @IsString()
  model: string;

  @ApiProperty()
  @IsString()
  registrationNumber: string;

  @ApiProperty()
  @IsNumber()
  power: number;

  @ApiProperty({ enum: CarType })
  @IsEnum(CarType)
  type: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsBoolean()
  available: boolean;
}
