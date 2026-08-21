import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('getHello', () => {
    it('should return "Hello World"', () => {
      expect(appController.getHello()).toBe('Hello World');
    });

    it('should return a string', () => {
      expect(typeof appController.getHello()).toBe('string');
    });

    it('should return the same value on repeated calls', () => {
      expect(appController.getHello()).toBe(appController.getHello());
    });
  });
});