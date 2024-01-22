/* eslint-disable prettier/prettier */
import { Process, Processor, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { AppService } from './app.service';
import { CreateRentalDto } from 'global-models/createRentalDto';

@Processor('rental')
export class RentalProcessor {
  constructor(private readonly appService: AppService) {}

  @Process('delete')
  async handleDeleteRental(job: Job) {
    console.log('pls');
    await this.appService.deleteCarRental(job.data.userName, job.data.rentalId);
  }

  @Process('get-rental')
  async handleGetRenal(job: Job<{ userName: string; rentalId: string }>) {
    try {
      await this.appService.getUserRental(job.data.userName, job.data.rentalId);
    } catch (e) {
      if (job.attemptsMade < job.opts.attempts) {
        throw new Error('Service still unavailable');
      }
    }
  }

  @Process('post-rental')
  async handlePostRenal(
    job: Job<{ userName: string; rentalData: CreateRentalDto }>,
  ) {
    try {
      await this.appService.createCarRental(
        job.data.userName,
        job.data.rentalData,
      );
    } catch (e) {
      if (job.attemptsMade < job.opts.attempts) {
        throw new Error('Service still unavailable');
      }
    }
  }

  @OnQueueFailed()
  handler(job: Job, error: Error) {
    console.log('fired exception');
  }
}
