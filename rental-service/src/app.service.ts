import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { RentalResponse } from './rental-models/rentalResponse';
import { CreateRentalDto } from './rental-models/createRentalDto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllUserRentals(userName: string): Promise<RentalResponse[]> {
    return await this.databaseService.rental.findMany({
      where: { username: userName },
    });
  }

  async getUserRental(
    userName: string,
    rentalId: string,
  ): Promise<RentalResponse> {
    const rent = await this.databaseService.rental.findUnique({
      where: { username: userName, rental_uid: rentalId },
    });
    return rent;
  }

  async createRental(
    rentalData: CreateRentalDto,
    userName: string,
    paymentUUID: string,
  ): Promise<RentalResponse> {
    const rentalUUID: string = uuidv4();
    return await this.databaseService.rental.create({
      data: {
        rental_uid: rentalUUID,
        username: userName,
        payment_uid: paymentUUID,
        car_uid: rentalData.carUid,
        date_from: new Date(rentalData.dateFrom).toISOString(),
        date_to: new Date(rentalData.dateTo).toISOString(),
        status: 'IN_PROGRESS',
      },
    });
  }

  async updateRentalStatus(
    userName: string,
    rentalId: string,
    rentalStatus: { status: string },
  ): Promise<RentalResponse> {
    console.log(rentalStatus);
    const res = await this.databaseService.rental.update({
      where: {
        rental_uid: rentalId,
      },
      data: {
        status:
          rentalStatus.status === 'CANCELED'
            ? 'CANCELED'
            : rentalStatus.status === 'IN_PROGRESS'
            ? 'IN_PROGRESS'
            : 'FINISHED',
      },
    });
    return res;
  }
}
