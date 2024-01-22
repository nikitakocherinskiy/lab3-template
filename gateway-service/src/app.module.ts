import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { RentalProcessor } from './rental.processor';
import { CircuitBreakerModule } from './circuit-breaker';

@Module({
  imports: [
    HttpModule,
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: 'localhost',
          port: 6379,
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'rental',
    }),
    CircuitBreakerModule.forRoot({
      timeout: 3000,
      errorThresholdPercentage: 30,
      resetTimeout: 30000,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, RentalProcessor],
  exports: [AppModule, BullModule],
})
export class AppModule {}
