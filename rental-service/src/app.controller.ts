import {
  Controller,
  Get,
  HttpStatus,
  Res,
  Headers,
  Param,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { CreateRentalDto } from './rental-models/createRentalDto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/manage/health')
  getHealth(@Res() res: Response) {
    res.status(HttpStatus.OK).send('OK');
  }

  @Get('/rentals')
  async getAllUserRentals(@Headers('x-user-name') userName: string) {
    return await this.appService.getAllUserRentals(userName);
  }

  @Get('rental/:id')
  async getUserRentalById(
    @Headers('x-user-name') userName: string,
    @Param('id') rentalId: string,
  ) {
    const rental = await this.appService.getUserRental(userName, rentalId);
    return rental;
  }

  @Post('rental')
  async createRental(
    @Headers('x-user-name') userName: string,
    @Body() rentalData: CreateRentalDto & { paymentUid: string },
  ) {
    const rental = await this.appService.createRental(
      rentalData,
      userName,
      rentalData.paymentUid,
    );
    return rental;
  }

  //FINISH rental
  @Patch('rental/:id/finish')
  async updateRentalStatus(
    @Headers('x-user-name') userName: string,
    @Body() rentalStatus: { status: string },
    @Param('id') rentalId: string,
  ) {
    const rental = await this.appService.updateRentalStatus(
      userName,
      rentalId,
      rentalStatus,
    );
    if (rental) {
      return rental;
    }
  }
}
