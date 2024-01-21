import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';

describe('Gateway Service', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
