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

describe('main.ts', () => {
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

      expect(ValidationPipe).toHaveBeenCalledTimes(1);
      expect(ValidationPipe).toHaveBeenCalledWith();
      expect(mockApp.useGlobalPipes).toHaveBeenCalledTimes(1);
      expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(expect.any(ValidationPipe));
    });

    it('should listen on port 3000', async () => {
      await mainModule.bootstrap();

      expect(mockApp.listen).toHaveBeenCalledTimes(1);
      expect(mockApp.listen).toHaveBeenCalledWith(3000);
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

    it('should call methods in correct order', async () => {
      const callOrder: string[] = [];
      
      (NestFactory.create as jest.Mock).mockImplementation(async () => {
        callOrder.push('create');
        return mockApp;
      });

      mockApp.useGlobalPipes.mockImplementation(() => {
        callOrder.push('useGlobalPipes');
      });

      mockApp.listen.mockImplementation(async () => {
        callOrder.push('listen');
      });

      await mainModule.bootstrap();

      expect(callOrder).toEqual(['create', 'useGlobalPipes', 'listen']);
    });

    it('should pass the correct ValidationPipe instance', async () => {
      await mainModule.bootstrap();

      const validationPipeInstance = (ValidationPipe as jest.Mock).mock.instances[0];
      expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(validationPipeInstance);
    });

    it('should create a new ValidationPipe each time', async () => {
      await mainModule.bootstrap();
      await mainModule.bootstrap();

      expect(ValidationPipe).toHaveBeenCalledTimes(2);
    });

    it('should handle multiple bootstrap calls', async () => {
      await mainModule.bootstrap();
      await mainModule.bootstrap();

      expect(NestFactory.create).toHaveBeenCalledTimes(2);
      expect(mockApp.useGlobalPipes).toHaveBeenCalledTimes(2);
      expect(mockApp.listen).toHaveBeenCalledTimes(2);
    });

    it('should not throw when app.listen resolves successfully', async () => {
      await expect(mainModule.bootstrap()).resolves.toBeUndefined();
    });

    it('should handle undefined return from NestFactory.create', async () => {
      (NestFactory.create as jest.Mock).mockResolvedValue(undefined);

      await expect(mainModule.bootstrap()).rejects.toThrow();
    });

    it('should handle null return from NestFactory.create', async () => {
      (NestFactory.create as jest.Mock).mockResolvedValue(null);

      await expect(mainModule.bootstrap()).rejects.toThrow();
    });

    it('should handle missing useGlobalPipes method', async () => {
      const incompleteApp = {
        listen: jest.fn().mockResolvedValue(undefined),
      };
      (NestFactory.create as jest.Mock).mockResolvedValue(incompleteApp);

      await expect(mainModule.bootstrap()).rejects.toThrow();
    });

    it('should handle missing listen method', async () => {
      const incompleteApp = {
        useGlobalPipes: jest.fn(),
      };
      (NestFactory.create as jest.Mock).mockResolvedValue(incompleteApp);

      await expect(mainModule.bootstrap()).rejects.toThrow();
    });
  });
});