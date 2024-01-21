/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ErrorResponse {
  @ApiProperty({ description: 'Информация об ошибке' })
  @IsString()
  message: string;
}
