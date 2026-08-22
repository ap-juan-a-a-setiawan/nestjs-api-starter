import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './App/app.module';

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
  AppModule: jest.fn().mockImplementation(() => ({
    module: 'AppModule',
  })),
}));

describe('bootstrap', () => {
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

  it('should create the Nest application with AppModule', async () => {
    // Import the bootstrap function dynamically to avoid hoisting issues
    const { bootstrap } = await import('./main');

    await bootstrap();

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(NestFactory.create).toHaveBeenCalledTimes(1);
  });

  it('should apply global validation pipes', async () => {
    const { bootstrap } = await import('./main');

    await bootstrap();

    expect(ValidationPipe).toHaveBeenCalledTimes(1);
    expect(mockApp.useGlobalPipes).toHaveBeenCalledTimes(1);
    expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
      expect.any(ValidationPipe)
    );
  });

  it('should listen on port 3000', async () => {
    const { bootstrap } = await import('./main');

    await bootstrap();

    expect(mockApp.listen).toHaveBeenCalledWith(3000);
    expect(mockApp.listen).toHaveBeenCalledTimes(1);
  });

  it('should handle errors during app creation', async () => {
    const error = new Error('Failed to create app');
    (NestFactory.create as jest.Mock).mockRejectedValue(error);

    const { bootstrap } = await import('./main');

    await expect(bootstrap()).rejects.toThrow('Failed to create app');
  });

  it('should handle errors during listen', async () => {
    const error = new Error('Failed to listen');
    mockApp.listen.mockRejectedValue(error);

    const { bootstrap } = await import('./main');

    await expect(bootstrap()).rejects.toThrow('Failed to listen');
  });

  it('should handle errors during useGlobalPipes', async () => {
    const error = new Error('Failed to set global pipes');
    mockApp.useGlobalPipes.mockImplementation(() => {
      throw error;
    });

    const { bootstrap } = await import('./main');

    await expect(bootstrap()).rejects.toThrow('Failed to set global pipes');
  });

  it('should call methods in correct order', async () => {
    const { bootstrap } = await import('./main');

    await bootstrap();

    const createCallOrder = (NestFactory.create as jest.Mock).mock
      .invocationCallOrder[0];
    const useGlobalPipesCallOrder = mockApp.useGlobalPipes.mock
      .invocationCallOrder[0];
    const listenCallOrder = mockApp.listen.mock.invocationCallOrder[0];

    expect(createCallOrder).toBeLessThan(useGlobalPipesCallOrder);
    expect(useGlobalPipesCallOrder).toBeLessThan(listenCallOrder);
  });

  it('should create ValidationPipe with default options', async () => {
    const { bootstrap } = await import('./main');

    await bootstrap();

    expect(ValidationPipe).toHaveBeenCalledWith();
  });

  it('should pass the created app instance to useGlobalPipes', async () => {
    const { bootstrap } = await import('./main');

    await bootstrap();

    expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
      expect.objectContaining({
        transform: true,
        whitelist: true,
      })
    );
  });

  it('should handle multiple bootstrap calls', async () => {
    const { bootstrap } = await import('./main');

    await bootstrap();
    await bootstrap();

    expect(NestFactory.create).toHaveBeenCalledTimes(2);
    expect(mockApp.useGlobalPipes).toHaveBeenCalledTimes(2);
    expect(mockApp.listen).toHaveBeenCalledTimes(2);
  });

  it('should handle undefined app from create', async () => {
    (NestFactory.create as jest.Mock).mockResolvedValue(undefined);

    const { bootstrap } = await import('./main');

    await expect(bootstrap()).rejects.toThrow(
      'Cannot read properties of undefined'
    );
  });

  it('should handle null app from create', async () => {
    (NestFactory.create as jest.Mock).mockResolvedValue(null);

    const { bootstrap } = await import('./main');

    await expect(bootstrap()).rejects.toThrow(
      'Cannot read properties of null'
    );
  });

  it('should handle listen returning a promise', async () => {
    mockApp.listen.mockResolvedValue('server started');

    const { bootstrap } = await import('./main');

    await expect(bootstrap()).resolves.toBeUndefined();
  });

  it('should handle synchronous errors in useGlobalPipes', async () => {
    const error = new Error('Sync error');
    mockApp.useGlobalPipes.mockImplementation(() => {
      throw error;
    });

    const { bootstrap } = await import('./main');

    await expect(bootstrap()).rejects.toThrow('Sync error');
  });

  it('should handle ValidationPipe constructor throwing', async () => {
    const error = new Error('ValidationPipe constructor error');
    (ValidationPipe as jest.Mock).mockImplementationOnce(() => {
      throw error;
    });

    const { bootstrap } = await import('./main');

    await expect(bootstrap()).rejects.toThrow('ValidationPipe constructor error');
  });

  it('should handle AppModule import failure', async () => {
    const error = new Error('AppModule import error');
    (NestFactory.create as jest.Mock).mockImplementationOnce(() => {
      throw error;
    });

    const { bootstrap } = await import('./main');

    await expect(bootstrap()).rejects.toThrow('AppModule import error');
  });
});