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

  describe('bootstrap', () => {
    it('should create the Nest application with AppModule', async () => {
      await mainModule.bootstrap();

      expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
      expect(NestFactory.create).toHaveBeenCalledTimes(1);
    });

    it('should apply global validation pipes', async () => {
      await mainModule.bootstrap();

      expect(ValidationPipe).toHaveBeenCalled();
      expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
        expect.any(ValidationPipe)
      );
      expect(mockApp.useGlobalPipes).toHaveBeenCalledTimes(1);
    });

    it('should listen on port 3000', async () => {
      await mainModule.bootstrap();

      expect(mockApp.listen).toHaveBeenCalledWith(3000);
      expect(mockApp.listen).toHaveBeenCalledTimes(1);
    });

    it('should call all methods in correct order', async () => {
      const order: string[] = [];
      
      (NestFactory.create as jest.Mock).mockImplementation(async () => {
        order.push('create');
        return mockApp;
      });

      mockApp.useGlobalPipes.mockImplementation(() => {
        order.push('useGlobalPipes');
      });

      mockApp.listen.mockImplementation(async () => {
        order.push('listen');
      });

      await mainModule.bootstrap();

      expect(order).toEqual(['create', 'useGlobalPipes', 'listen']);
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
      const error = new Error('Failed to set pipes');
      mockApp.useGlobalPipes.mockImplementation(() => {
        throw error;
      });

      await expect(mainModule.bootstrap()).rejects.toThrow('Failed to set pipes');
    });

    it('should create ValidationPipe with default options', async () => {
      await mainModule.bootstrap();

      expect(ValidationPipe).toHaveBeenCalledWith();
    });

    it('should pass the correct AppModule to NestFactory.create', async () => {
      await mainModule.bootstrap();

      expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
      expect(AppModule).toBeDefined();
    });

    it('should not call listen if create fails', async () => {
      (NestFactory.create as jest.Mock).mockRejectedValue(new Error('Create failed'));

      await expect(mainModule.bootstrap()).rejects.toThrow('Create failed');
      expect(mockApp.listen).not.toHaveBeenCalled();
      expect(mockApp.useGlobalPipes).not.toHaveBeenCalled();
    });

    it('should not call listen if useGlobalPipes fails', async () => {
      mockApp.useGlobalPipes.mockImplementation(() => {
        throw new Error('Pipe error');
      });

      await expect(mainModule.bootstrap()).rejects.toThrow('Pipe error');
      expect(mockApp.listen).not.toHaveBeenCalled();
    });

    it('should handle multiple bootstrap calls', async () => {
      await mainModule.bootstrap();
      await mainModule.bootstrap();

      expect(NestFactory.create).toHaveBeenCalledTimes(2);
      expect(mockApp.useGlobalPipes).toHaveBeenCalledTimes(2);
      expect(mockApp.listen).toHaveBeenCalledTimes(2);
    });

    it('should return a promise', () => {
      const result = mainModule.bootstrap();
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve successfully when all operations succeed', async () => {
      await expect(mainModule.bootstrap()).resolves.toBeUndefined();
    });

    it('should use the mocked ValidationPipe instance', async () => {
      const mockValidationPipe = new ValidationPipe();
      
      await mainModule.bootstrap();

      expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
        expect.objectContaining({
          transform: true,
          whitelist: true,
        })
      );
      expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
        expect.any(ValidationPipe)
      );
    });

    it('should verify the complete flow with all mocks', async () => {
      await mainModule.bootstrap();

      // Verify create was called with AppModule
      expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
      
      // Verify ValidationPipe was instantiated
      expect(ValidationPipe).toHaveBeenCalled();
      
      // Verify useGlobalPipes was called with a ValidationPipe instance
      expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
        expect.any(ValidationPipe)
      );
      
      // Verify listen was called with port 3000
      expect(mockApp.listen).toHaveBeenCalledWith(3000);
    });
  });
});