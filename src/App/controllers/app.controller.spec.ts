import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHello', () => {
    it('should return "Hello World"', () => {
      expect(controller.getHello()).toBe('Hello World');
    });

    it('should return a string', () => {
      expect(typeof controller.getHello()).toBe('string');
    });

    it('should return a non-empty string', () => {
      expect(controller.getHello().length).toBeGreaterThan(0);
    });

    it('should not return undefined', () => {
      expect(controller.getHello()).not.toBeUndefined();
    });
  });
});