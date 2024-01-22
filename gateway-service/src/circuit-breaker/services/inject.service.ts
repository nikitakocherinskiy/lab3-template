import { Injectable } from '@nestjs/common';
import { CircuitBreakerService } from './circuit-breaker.service';

@Injectable()
export class ServiceInjector {
  static injector: ServiceInjector;

  constructor(public circuitBreakerService: CircuitBreakerService) {
    ServiceInjector.injector = this;
  }

  static getService(): CircuitBreakerService {
    return this.injector.circuitBreakerService;
  }
}
