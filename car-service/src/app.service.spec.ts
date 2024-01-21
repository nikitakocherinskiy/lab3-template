import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';

describe('Car Service', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule, DatabaseModule],
      controllers: [AppController],
      providers: [AppService, DatabaseService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
