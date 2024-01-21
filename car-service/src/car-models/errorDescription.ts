/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ErrorDescription {
  @ApiProperty()
  @IsString()
  field: string;

  @ApiProperty()
  @IsString()
  error: string;
}
