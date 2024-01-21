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

  const paymentInfo = {
    id: 1,
    paymentUid: '238c733c-fb1e-40a9-aadb-73cb8f90675d',
    status: 'PAID',
    price: 10500,
  };

  const paymentUid = '238c733c-fb1e-40a9-aadb-73cb8f90675d';

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

  describe('getPaymentById', () => {
    it('should create rental and return status code 200 - success', async () => {
      jest
        .spyOn(service, 'getPaymentById')
        //@ts-ignore
        .mockImplementation(async () => paymentInfo);
      await controller.getPaymentById({ paymentUid });
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('createPayment', () => {
    it('should create payment and return status code 200 - success', async () => {
      jest
        .spyOn(service, 'createPayment')
        //@ts-ignore
        .mockImplementation(async () => paymentInfo);
      await controller.createPayment({ price: 2023 });
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deletePayment', () => {
    it('should delete payment by id and return status code 200 - success', async () => {
      jest
        .spyOn(service, 'deletePayment')
        //@ts-ignore
        .mockImplementation(async () => paymentInfo);
      await controller.deletePayment(paymentUid);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
});
