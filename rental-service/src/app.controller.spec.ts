import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppModule } from './app.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Response } from 'express';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  const rentalInfo = {
    rental_uid: '4fd4fc0c-7840-483c-bcf5-3e2be7d4ea69',
    status: 'IN_PROGRESS',
    date_from: '2021-10-08',
    date_to: '2021-10-11',
    car: {
      car_uid: '109b42f3-198d-4c89-9276-a7520a7120ab',
      brand: 'Mercedes Benz',
      model: 'GLA 250',
      registration_number: 'ЛО777Х799',
    },
    payment: {
      payment_uid: '238c733c-fb1e-40a9-aadb-73cb8f90675d',
      status: 'PAID',
      price: 10500,
    },
  };

  const rentalUid = '238c733c-fb1e-40a9-aadb-73cb8f90675d';

  const responseMock = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule, DatabaseModule],
      controllers: [AppController],
      providers: [AppService, DatabaseService],
    }).compile();

    controller = app.get<AppController>(AppController);
    service = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should gateway service to be defined"', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('health', () => {
    it('should check availability of service with status code 200 - success', async () => {
      await controller.getHealth(responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getUserRental', () => {
    it('should return user rental by Id and return status code 200 - success', async () => {
      jest
        .spyOn(service, 'getUserRental')
        //@ts-ignore
        .mockImplementation(async () => rentalInfo);
      await controller.getUserRentalById('nikita', rentalUid);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
});
