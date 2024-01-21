/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray } from 'class-validator';
import { CarResponse } from './carResponse';

export class PaginationResponse {
  @ApiProperty()
  @IsNumber()
  page: number;

  @ApiProperty()
  @IsNumber()
  pageSize: number;

  @ApiProperty()
  @IsNumber()
  totalElements: number;

  @ApiProperty({ type: [CarResponse] })
  @IsArray()
  items: CarResponse[];
}
