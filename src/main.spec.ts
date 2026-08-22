import { Test } from '@nestjs/testing';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './App/app.module';

jest.mock('@nestjs/core', () => ({
  NestFactory: { create: jest.fn() },
}));

jest.mock('@nestjs/common', () => {
  const actual = jest.requireActual('@nestjs/common');
  return { ...actual, ValidationPipe: jest.fn() };
});

jest.mock('./App/app.module', () => {
  const { Module } = jest.requireActual('@nestjs/common');
  @Module({})
  class AppModule {}
  return { AppModule };
});

describe('main.ts bootstrap', () => {
  let appMock: { useGlobalPipes: jest.Mock; listen: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    appMock = {
      useGlobalPipes: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    };
    (NestFactory.create as jest.Mock).mockResolvedValue(appMock);
  });

  it('should create the app with AppModule and listen on port 3000', async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    expect(moduleRef).toBeDefined();

    jest.isolateModules(() => {
      require('./main');
    });

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(ValidationPipe).toHaveBeenCalledTimes(1);
    expect(appMock.useGlobalPipes).toHaveBeenCalledWith(expect.any(ValidationPipe));
    expect(appMock.listen).toHaveBeenCalledWith(3000);
  });

  it('should call useGlobalPipes before listen', () => {
    jest.isolateModules(() => {
      require('./main');
    });

    const useGlobalPipesOrder = appMock.useGlobalPipes.mock.invocationCallOrder[0];
    const listenOrder = appMock.listen.mock.invocationCallOrder[0];
    expect(useGlobalPipesOrder).toBeLessThan(listenOrder);
  });

  it('should handle NestFactory.create rejection', async () => {
    const error = new Error('create failed');
    (NestFactory.create as jest.Mock).mockRejectedValue(error);

    const rejectionPromise = new Promise((resolve) => {
      process.once('unhandledRejection', (reason) => resolve(reason));
    });

    jest.isolateModules(() => {
      require('./main');
    });

    await expect(rejectionPromise).resolves.toBe(error);
  });

  it('should handle app.listen rejection', async () => {
    const error = new Error('listen failed');
    appMock.listen.mockRejectedValue(error);

    const rejectionPromise = new Promise((resolve) => {
      process.once('unhandledRejection', (reason) => resolve(reason));
    });

    jest.isolateModules(() => {
      require('./main');
    });

    await expect(rejectionPromise).resolves.toBe(error);
  });
});