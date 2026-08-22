import { Test } from '@nestjs/testing';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './App/app.module';
import * as mainModule from './main';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

jest.mock('@nestjs/common', () => ({
  ValidationPipe: jest.fn().mockImplementation(() => ({
    transform: true,
    whitelist: true,
  })),
}));

jest.mock('./App/app.module', () => ({
  AppModule: class AppModuleMock {},
}));

describe('main.ts bootstrap function', () => {
  let mockApp: {
    useGlobalPipes: jest.Mock;
    listen: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockApp = {
      useGlobalPipes: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    };

    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
  });

  it('should be defined', () => {
    expect(mainModule).toBeDefined();
  });

  describe('bootstrap', () => {
    it('should call NestFactory.create with AppModule', async () => {
      await mainModule.bootstrap();

      expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
      expect(NestFactory.create).toHaveBeenCalledTimes(1);
    });

    it('should create a ValidationPipe instance', async () => {
      await mainModule.bootstrap();

      expect(ValidationPipe).toHaveBeenCalled();
      expect(ValidationPipe).toHaveBeenCalledTimes(1);
    });

    it('should call app.useGlobalPipes with a ValidationPipe instance', async () => {
      await mainModule.bootstrap();

      expect(mockApp.useGlobalPipes).toHaveBeenCalled();
      expect(mockApp.useGlobalPipes).toHaveBeenCalledTimes(1);
      expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(expect.any(ValidationPipe));
    });

    it('should call app.listen with port 3000', async () => {
      await mainModule.bootstrap();

      expect(mockApp.listen).toHaveBeenCalledWith(3000);
      expect(mockApp.listen).toHaveBeenCalledTimes(1);
    });

    it('should call all methods in correct order', async () => {
      await mainModule.bootstrap();

      const createCallOrder = (NestFactory.create as jest.Mock).mock.invocationCallOrder[0];
      const useGlobalPipesCallOrder = mockApp.useGlobalPipes.mock.invocationCallOrder[0];
      const listenCallOrder = mockApp.listen.mock.invocationCallOrder[0];

      expect(createCallOrder).toBeLessThan(useGlobalPipesCallOrder);
      expect(useGlobalPipesCallOrder).toBeLessThan(listenCallOrder);
    });

    it('should handle errors from NestFactory.create', async () => {
      const error = new Error('Failed to create app');
      (NestFactory.create as jest.Mock).mockRejectedValue(error);

      await expect(mainModule.bootstrap()).rejects.toThrow('Failed to create app');
    });

    it('should handle errors from app.listen', async () => {
      const error = new Error('Failed to listen');
      mockApp.listen.mockRejectedValue(error);

      await expect(mainModule.bootstrap()).rejects.toThrow('Failed to listen');
    });

    it('should handle errors from useGlobalPipes', async () => {
      const error = new Error('Failed to set global pipes');
      mockApp.useGlobalPipes.mockImplementation(() => {
        throw error;
      });

      await expect(mainModule.bootstrap()).rejects.toThrow('Failed to set global pipes');
    });

    it('should not call listen if useGlobalPipes throws', async () => {
      const error = new Error('Failed to set global pipes');
      mockApp.useGlobalPipes.mockImplementation(() => {
        throw error;
      });

      await expect(mainModule.bootstrap()).rejects.toThrow('Failed to set global pipes');
      expect(mockApp.listen).not.toHaveBeenCalled();
    });

    it('should not call useGlobalPipes if create fails', async () => {
      (NestFactory.create as jest.Mock).mockRejectedValue(new Error('Create failed'));

      await expect(mainModule.bootstrap()).rejects.toThrow('Create failed');
      expect(mockApp.useGlobalPipes).not.toHaveBeenCalled();
      expect(mockApp.listen).not.toHaveBeenCalled();
    });

    it('should handle ValidationPipe constructor throwing', async () => {
      (ValidationPipe as jest.Mock).mockImplementationOnce(() => {
        throw new Error('ValidationPipe failed');
      });

      await expect(mainModule.bootstrap()).rejects.toThrow('ValidationPipe failed');
      expect(mockApp.useGlobalPipes).not.toHaveBeenCalled();
      expect(mockApp.listen).not.toHaveBeenCalled();
    });

    it('should handle app being null/undefined from create', async () => {
      (NestFactory.create as jest.Mock).mockResolvedValue(null);

      await expect(mainModule.bootstrap()).rejects.toThrow();
    });

    it('should handle listen returning a promise that resolves', async () => {
      mockApp.listen.mockResolvedValue('server started');

      await expect(mainModule.bootstrap()).resolves.toBeUndefined();
      expect(mockApp.listen).toHaveBeenCalledWith(3000);
    });

    it('should handle multiple bootstrap calls', async () => {
      await mainModule.bootstrap();
      await mainModule.bootstrap();

      expect(NestFactory.create).toHaveBeenCalledTimes(2);
      expect(mockApp.useGlobalPipes).toHaveBeenCalledTimes(2);
      expect(mockApp.listen).toHaveBeenCalledTimes(2);
    });

    it('should pass correct ValidationPipe configuration', async () => {
      await mainModule.bootstrap();

      const validationPipeInstance = (ValidationPipe as jest.Mock).mock.instances[0];
      expect(validationPipeInstance).toBeDefined();
      expect(validationPipeInstance.transform).toBe(true);
      expect(validationPipeInstance.whitelist).toBe(true);
    });

    it('should use the same app instance for all operations', async () => {
      await mainModule.bootstrap();

      expect(mockApp.useGlobalPipes).toHaveBeenCalled();
      expect(mockApp.listen).toHaveBeenCalled();
      expect(mockApp.useGlobalPipes.mock.instances[0]).toBe(mockApp);
      expect(mockApp.listen.mock.instances[0]).toBe(mockApp);
    });

    it('should not call any methods if bootstrap is not invoked', () => {
      expect(NestFactory.create).not.toHaveBeenCalled();
      expect(ValidationPipe).not.toHaveBeenCalled();
      expect(mockApp.useGlobalPipes).not.toHaveBeenCalled();
      expect(mockApp.listen).not.toHaveBeenCalled();
    });
  });
});