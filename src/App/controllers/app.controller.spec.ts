import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = moduleRef.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });

    it('getHello should return "Hello World"', () => {
      expect(appController.getHello()).toBe('Hello World');
    });

    it('getHello should return a string', () => {
      const result = appController.getHello();
      expect(typeof result).toBe('string');
    });
  });
});