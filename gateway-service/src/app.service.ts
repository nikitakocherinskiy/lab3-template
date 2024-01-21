import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateRentalDto } from 'global-models/createRentalDto';
import { PaymentInfo } from 'global-models/paymentInfo';
@Injectable()
export class AppService {
  private carsServiceUrl: string = 'http://car-service:8070';
  private rentalServiceUrl: string = 'http://rental-service:8060';
  private paymentServiceUrl: string = 'http://payment-service:8050';

  constructor(private readonly httpService: HttpService) {}
  //get
  async getCarsService(page: number, size: number, showAll: boolean) {
    const cars = await firstValueFrom(
      this.httpService.get(
        `${this.carsServiceUrl}/cars?page=${page}&size=${size}&showAll=${showAll}`,
      ),
    );

    return cars.data;
  }

  async getAllUserRentals(userName: string) {
    const res = await firstValueFrom(
      this.httpService.get(`${this.rentalServiceUrl}/rentals`, {
        headers: {
          'X-User-Name': userName,
        },
      }),
    );

    const response = res.data;

    const rentals = await Promise.all(
      response.map(async (el) => {
        const car_uid = el.car_uid;
        const payment_uid = el.payment_uid;

        const car = await firstValueFrom(
          this.httpService.patch(`${this.carsServiceUrl}/car`, {
            car_uid: car_uid,
          }),
        );

        const payment = await firstValueFrom(
          this.httpService.patch(`${this.paymentServiceUrl}/payment`, {
            payment_uid: payment_uid,
          }),
        );

        return {
          rental_uid: el.rental_uid,
          status: el.status,
          date_from: el.date_from.split('T')[0],
          date_to: el.date_to.split('T')[0],
          car: {
            car_uid,
            brand: car.data.brand,
            model: car.data.model,
            registration_number: car.data.registration_number,
          },
          payment: {
            payment_uid: payment.data.payment_uid,
            status: payment.data.status,
            price: payment.data.price,
          },
        };
      }),
    );
    return rentals;
  }

  async getUserRental(userName: string, rentalId: string) {
    const rental = await firstValueFrom(
      this.httpService.get(`${this.rentalServiceUrl}/rental/${rentalId}`, {
        headers: {
          'X-User-Name': userName,
        },
      }),
    );

    const car_uid = rental.data.car_uid;
    const payment_uid = rental.data.payment_uid;

    const car = await firstValueFrom(
      this.httpService.patch(`${this.carsServiceUrl}/car`, {
        car_uid: car_uid,
      }),
    );

    const payment = await firstValueFrom(
      this.httpService.patch(`${this.paymentServiceUrl}/payment`, {
        payment_uid: payment_uid,
      }),
    );

    return {
      rental_uid: rental.data.rental_uid,
      status: rental.data.status,
      date_from: rental.data.date_from.split('T')[0],
      date_to: rental.data.date_to.split('T')[0],
      car: {
        car_uid,
        brand: car.data.brand,
        model: car.data.model,
        registration_number: car.data.registration_number,
      },
      payment: {
        payment_uid: payment.data.payment_uid,
        status: payment.data.status,
        price: payment.data.price,
      },
    };
  }

  // post
  async createCarRental(userName: string, rentalData: CreateRentalDto) {
    //Check car
    let res = await firstValueFrom(
      this.httpService.patch(`${this.carsServiceUrl}/car`, {
        car_uid: rentalData.car_uid,
      }),
    );
    if (!res) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Car not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    if (!res.data.availability) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Car is not available for rental',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    //Update Car Availability
    res = await firstValueFrom(
      this.httpService.post(`${this.carsServiceUrl}/car`, {
        carUid: rentalData.car_uid,
        availability: false,
      }),
    );

    //Rental Price
    const days =
      (new Date(rentalData.date_to).getTime() -
        new Date(rentalData.date_from).getTime()) /
      (1000 * 3600 * 24);
    const rentalPrice = days * res.data.price;

    //Create payment
    res = await firstValueFrom(
      this.httpService.post(`${this.paymentServiceUrl}/payments`, {
        price: rentalPrice,
      }),
    );

    if (!res) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Payment can not be created' },
        HttpStatus.NOT_FOUND,
      );
    }

    const payment: PaymentInfo = res.data;
    //Create Rental
    res = await firstValueFrom(
      this.httpService.post(
        `${this.rentalServiceUrl}/rental`,
        {
          carUid: rentalData.car_uid,
          dateFrom: rentalData.date_from,
          dateTo: rentalData.date_to,
          paymentUid: payment.payment_uid,
        },
        {
          headers: {
            'X-User-Name': userName,
          },
        },
      ),
    );

    if (!res) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Rental can not be created' },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      ...res.data,
      date_from: res.data.date_from.split('T')[0],
      date_to: res.data.date_to.split('T')[0],
      payment,
    };
  }

  //FINISH CAR RENTAL
  async finishCarRental(userName: string, rentalId: string) {
    let res = await this.getUserRental(userName, rentalId);
    if (!res) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Rental can not be found' },
        HttpStatus.NOT_FOUND,
      );
    }
    const carUID = res.car.car_uid;
    const car = await firstValueFrom(
      this.httpService.post(`${this.carsServiceUrl}/car`, {
        carUid: carUID,
        availability: true,
      }),
    );
    if (!car) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Car is not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    //@ts-ignore
    res = await firstValueFrom(
      this.httpService.patch(
        `${this.rentalServiceUrl}/rental/${rentalId}/finish/`,
        {
          status: 'FINISHED',
        },
        {
          headers: {
            'X-User-Name': userName,
          },
        },
      ),
    );
    if (!res) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Rental can not be finished' },
        HttpStatus.NOT_FOUND,
      );
    }
    return res;
  }

  //delete
  async deleteCarRental(userName: string, rentalId: string) {
    let res = await this.getUserRental(userName, rentalId);
    if (!res) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Rental can not be found' },
        HttpStatus.NOT_FOUND,
      );
    }
    //@ts-ignore
    const carUID = res.car.car_uid;
    const car = await firstValueFrom(
      this.httpService.post(`${this.carsServiceUrl}/car`, {
        carUid: carUID,
        availability: true,
      }),
    );
    if (!car) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Car can not be found' },
        HttpStatus.NOT_FOUND,
      );
    }
    //@ts-ignore
    res = await firstValueFrom(
      this.httpService.patch(
        `${this.rentalServiceUrl}/rental/${rentalId}/finish/`,
        {
          status: 'CANCELED',
        },
        {
          headers: {
            'X-User-Name': userName,
          },
        },
      ),
    );

    if (!res) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Rental can not be canceled' },
        HttpStatus.NOT_FOUND,
      );
    }

    //@ts-ignore
    res = await firstValueFrom(
      this.httpService.delete(
        //@ts-ignore
        `${this.paymentServiceUrl}/payments/${res.data.payment_uid}`,
      ),
    );

    if (!res) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Rental can not be deleted' },
        HttpStatus.NOT_FOUND,
      );
    }

    return res;
  }
}
