import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateRentalDto } from '../global-models/createRentalDto';
import { Response } from 'express';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('api/v1')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectQueue('rental') private rentalQueue: Queue,
  ) {}

  @Get('cars')
  async getCars(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('showAll') showAll: boolean,
  ) {
    try {
      const cars = await this.appService.getCarsService(page, size, showAll);
      return cars;
    } catch (e) {
      throw new HttpException(
        {
          status: e.status,
          error: e.statusText,
        },
        e.getStatus(),
        {
          cause: e,
        },
      );
    }
  }

  @Get('rental')
  async getAllUserRentals(@Headers('x-user-name') userName: string) {
    try {
      const rentals = await this.appService.getAllUserRentals(userName);
      return rentals;
    } catch (e) {
      throw new HttpException(
        {
          status: e.status,
          error: e.statusText,
        },
        e.getStatus(),
        {
          cause: e,
        },
      );
    }
  }

  @Get('rental/:id')
  async getUserRentalById(
    @Headers('x-user-name') userName: string,
    @Param('id') rentalId: string,
  ) {
    try {
      const rental = await this.appService.getUserRental(userName, rentalId);
      return rental;
    } catch (e) {
      await this.rentalQueue.add(
        'get-rentals',
        { userName, rentalId },
        {
          attempts: 5,
          delay: 10000,
        },
      );

      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Rental not found',
        },
        HttpStatus.NOT_FOUND,
        {
          cause: e,
        },
      );
    }
  }

  @Post('rental')
  async postUserRental(
    @Body() rentalData: CreateRentalDto,
    @Headers('x-user-name') userName: string,
    @Res() res: Response,
  ) {
    try {
      const rental = await this.appService.createCarRental(
        userName,
        rentalData,
      );

      res.status(HttpStatus.OK).send(rental);
      return rental;
    } catch (e) {
      if (
        e instanceof HttpException &&
        e.getStatus() === HttpStatus.SERVICE_UNAVAILABLE
      ) {
        throw new HttpException(
          'Payment Service unavailability',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      throw new HttpException(
        {
          status: HttpStatus.SERVICE_UNAVAILABLE,
          error: 'Payment Service unavailability',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
        {
          cause: e,
        },
      );
    }
  }

  @Post('rental/:id/finish')
  async postFinishUserRental(
    @Headers('x-user-name') userName: string,
    @Param('id') rentalId: string,
    @Res() res: Response,
  ) {
    try {
      const rental = await this.appService.finishCarRental(userName, rentalId);
      res.status(HttpStatus.NO_CONTENT).send('Аренда успешно завершена');
      return rental;
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Аренда не найдена',
        },
        HttpStatus.NOT_FOUND,
        {
          cause: e,
        },
      );
    }
  }

  @Delete('rental/:id')
  async deleteUserRental(
    @Headers('x-user-name') userName: string,
    @Param('id') rentalId: string,
    @Res() res: Response,
  ) {
    try {
      const rental = await this.appService.deleteCarRental(userName, rentalId);
      res.status(HttpStatus.NO_CONTENT).send('Аренда успешно отменена');
      return rental;
    } catch (e) {
      res.status(HttpStatus.NO_CONTENT).send('Аренда успешно отменена');
      await this.rentalQueue.add(
        'delete',
        { userName, rentalId },
        {
          attempts: 10,
          delay: 300,
        },
      );
    }
  }
}
