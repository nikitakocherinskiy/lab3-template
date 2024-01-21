import {
  Controller,
  Post,
  Get,
  HttpStatus,
  Res,
  Body,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/manage/health')
  getHealth(@Res() res: Response) {
    res.status(HttpStatus.OK).send('OK');
  }

  @Post('payments')
  async createPayment(@Body() priceDto: { price: number }) {
    return await this.appService.createPayment(priceDto.price);
  }

  @Patch('payment')
  async getPaymentById(@Body() paymentUuid: any) {
    return await this.appService.getPaymentById(paymentUuid);
  }

  @Delete('payments/:id')
  async deletePayment(@Param('id') paymentUid: string) {
    console.log(paymentUid);
    return await this.appService.deletePayment(paymentUid);
  }
}
