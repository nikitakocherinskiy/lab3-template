import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CarResponse } from './car-models/carResponse';
@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAllAvailableCars(query): Promise<{
    page: number;
    pageSize: number;
    totalElements: number;
    items: CarResponse[];
  }> {
    const { page, size, showAll } = query;
    const skipNumber = page === 1 ? 0 : (page - 1) * size;
    const whereCondition = showAll ? {} : { availability: true };
    const cars = await this.databaseService.car.findMany({
      where: whereCondition,
      skip: skipNumber,
      take: +size,
      orderBy: {
        id: 'asc',
      },
    });

    return {
      page: page,
      pageSize: +size,
      totalElements: cars.length,
      items: [...cars],
    };
  }

  async getCarById(carId): Promise<CarResponse> {
    const car = await this.databaseService.car.findUnique({
      where: {
        car_uid: carId,
      },
    });

    if (!car)
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Car not found' },
        HttpStatus.NOT_FOUND,
      );

    return car;
  }

  async updateCarById(carId: string, availability: boolean) {
    const updateCar = await this.databaseService.car.update({
      where: { car_uid: carId },
      data: { availability: availability },
    });
    return updateCar;
  }
}
