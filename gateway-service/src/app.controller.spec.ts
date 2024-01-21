import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppModule } from './app.module';
import { HttpModule } from '@nestjs/axios';
import { Response } from 'express';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  const resultDto = {
    rentalUid: '4fd4fc0c-7840-483c-bcf5-3e2be7d4ea69',
    status: 'IN_PROGRESS',
    carUid: '109b42f3-198d-4c89-9276-a7520a7120ab',
    dateFrom: '2021-10-08',
    dateTo: '2021-10-11',
    payment: {
      paymentUid: '238c733c-fb1e-40a9-aadb-73cb8f90675d',
      status: 'PAID',
      price: 1,
    },
  };

  const getRentalsDto = {
    rental_uid: '4fd4fc0c-7840-483c-bcf5-3e2be7d4ea69',
    status: 'IN_PROGRESS',
    car_uid: '109b42f3-198d-4c89-9276-a7520a7120ab',
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
      price: 1,
    },
  };

  const createDto = {
    car_uid: '109b42f3-198d-4c89-9276-a7520a7120ab',
    date_from: '2021-10-08',
    date_to: '2021-10-11',
  };

  const rental_uid = '4fd4fc0c-7840-483c-bcf5-3e2be7d4ea69';

  const responseMock = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = app.get<AppController>(AppController);
    service = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should gateway service to be defined"', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('createRental', () => {
    it('should create rental and return status code 200 - success', async () => {
      jest
        .spyOn(service, 'createCarRental')
        .mockImplementation(async () => resultDto);
      await controller.postUserRental(createDto, 'nikita', responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getUserRentalByUid', () => {
    it('should get specific user rental by uid and return status code 200 - success', async () => {
      jest
        .spyOn(service, 'getUserRental')
        .mockImplementation(async () => getRentalsDto);
      await controller.getUserRentalById('nikita', rental_uid);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteRentalByUid', () => {
    it('should close specific user rental by uid and return status code 204 - success', async () => {
      jest
        .spyOn(service, 'deleteCarRental')
        .mockImplementation(async () => getRentalsDto);
      await controller.deleteUserRental('nikita', rental_uid, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(204);
    });
  });

  describe('finishCarRentalByUid', () => {
    it('should end specific user rental by uid and return status code 204 - success', async () => {
      jest
        .spyOn(service, 'finishCarRental')
        .mockImplementation(async () => getRentalsDto);
      await controller.postFinishUserRental('nikita', rental_uid, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(204);
    });
  });
});
