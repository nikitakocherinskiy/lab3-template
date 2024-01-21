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

  const carDto = {
    car_uid: '109b42f3-198d-4c89-9276-a7520a7120ab',
    brand: 'Mercedes Benz',
    model: 'GLA 250',
    registration_number: 'ЛО777Х799',
    power: 249,
    type: 'SEDAN',
    price: 3500,
    availability: true,
  };

  const carUpdateResult = {
    id: 1,
    car_uid: '109b42f3-198d-4c89-9276-a7520a7120ab',
    brand: 'Mercedes Benz',
    model: 'GLA 250',
    registration_number: 'ЛО777Х799',
    power: 249,
    type: 'SEDAN',
    price: 3500,
    availability: true,
  };

  const car_uid = '4fd4fc0c-7840-483c-bcf5-3e2be7d4ea69';

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

  describe('getCarById', () => {
    it('should get car by id and return status code 200 - success', async () => {
      jest.spyOn(service, 'getCarById').mockImplementation(async () => carDto);
      await controller.getCarById({ car_uid });
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('updateCarById', () => {
    it('should update car by id and return status code 200 - success', async () => {
      jest
        .spyOn(service, 'updateCarById')
        //@ts-ignore
        .mockImplementation(async () => carUpdateResult);
      await controller.updateCarById({ carUid: car_uid, availability: false });
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
});
