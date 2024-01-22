import { DynamicModule, Global, Module } from '@nestjs/common';
import CircuitBreaker from 'opossum';
import { CircuitBreakerService } from '../services/circuit-breaker.service';
import { ServiceInjector } from '../services/inject.service';

@Global()
@Module({})
export class CircuitBreakerModule {
  static forRoot(options: CircuitBreaker.Options): DynamicModule {
    return {
      module: CircuitBreakerModule,
      providers: [
        ServiceInjector,
        {
          provide: CircuitBreakerService,
          useValue: new CircuitBreakerService(options),
        },
      ],
      exports: [CircuitBreakerService],
    };
  }
}
