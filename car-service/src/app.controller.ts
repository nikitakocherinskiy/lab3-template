import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Res,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/manage/health')
  getHealth(@Res() res: Response) {
    res.status(HttpStatus.OK).send('OK');
  }

  @Get('/cars')
  async getAllAvailableCars(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('showAll') showAll: boolean,
  ) {
    return await this.appService.findAllAvailableCars({ page, size, showAll });
  }

  @Patch('car')
  async getCarById(@Body() carId: { car_uid: string }) {
    const rental = await this.appService.getCarById(carId.car_uid);
    return rental;
  }

  @Post('car')
  async updateCarById(
    @Body() carData: { carUid: string; availability: boolean },
  ) {
    const rental = await this.appService.updateCarById(
      carData.carUid,
      carData.availability,
    );
    return rental;
  }
}
