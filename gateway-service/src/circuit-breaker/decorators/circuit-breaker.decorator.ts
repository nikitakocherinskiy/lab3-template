import { Inject } from '@nestjs/common';

import CircuitBreaker from 'opossum';
import { ServiceInjector } from '../services/inject.service';

export function CircuitBreakerDecorator(
  options?: CircuitBreaker.Options,
): MethodDecorator {
  return function (
    target: any,
    propertyName: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const circuitBreakerService = ServiceInjector.getService();
      const breaker = circuitBreakerService.createBreaker(
        propertyName.toString(),
        async () => {
          return originalMethod.apply(this, args);
        },
        options,
      );

      return breaker.fire(() => originalMethod.apply(this, args));
    };

    return descriptor;
  };
}
