import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) {}

  //Create Payment
  createPayment(rentalPrice: number) {
    const paymentUUID: string = uuidv4();
    const res = this.databaseService.payment.create({
      data: {
        payment_uid: paymentUUID,
        price: rentalPrice,
        status: 'PAID',
      },
    });

    if (!res)
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Payment can not be created' },
        HttpStatus.NOT_FOUND,
      );
    return res;
  }

  async deletePayment(paymentUuid: string) {
    console.log(paymentUuid);
    const res = await this.databaseService.payment.findFirst({
      where: {
        payment_uid: paymentUuid,
      },
    });
    const pay = await this.databaseService.payment.update({
      where: {
        id: res.id,
      },
      data: {
        status: 'CANCELED',
      },
    });
    return pay;
  }

  async getPaymentById(paymentUid: { payment_uid: string }) {
    const payment = await this.databaseService.payment.findFirst({
      where: {
        payment_uid: paymentUid.payment_uid,
      },
    });

    if (!payment)
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Car not found' },
        HttpStatus.NOT_FOUND,
      );

    return payment;
  }
}
