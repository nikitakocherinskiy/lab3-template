/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateNested } from 'class-validator';
import { ErrorDescription } from './errorDescription';
import { Type } from 'class-transformer';

export class ValidationErrorResponse {
  @ApiProperty({ description: 'Информация об ошибке' })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Массив полей с описанием ошибки',
    type: [ErrorDescription],
  })
  @ValidateNested({ each: true })
  @Type(() => ErrorDescription)
  errors: ErrorDescription[];
}
