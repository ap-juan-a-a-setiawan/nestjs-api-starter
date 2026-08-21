describe('main.ts', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should bootstrap the application with global pipes and listen on port 3000', async () => {
    const listenMock = jest.fn().mockResolvedValue(undefined);
    const useGlobalPipesMock = jest.fn();
    const appMock = {
      useGlobalPipes: useGlobalPipesMock,
      listen: listenMock,
    };

    const createMock = jest.fn().mockResolvedValue(appMock);
    const validationPipeInstance = {};
    const validationPipeMock = jest.fn().mockReturnValue(validationPipeInstance);
    const appModuleMock = jest.fn();

    jest.doMock('@nestjs/core', () => ({
      NestFactory: {
        create: createMock,
      },
    }));

    jest.doMock('@nestjs/common', () => ({
      ValidationPipe: validationPipeMock,
    }));

    jest.doMock('./App/app.module', () => ({
      AppModule: appModuleMock,
    }));

    await import('./main');

    await new Promise(resolve => setImmediate(resolve));

    expect(createMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledWith(appModuleMock);

    expect(validationPipeMock).toHaveBeenCalledTimes(1);
    expect(validationPipeMock).toHaveBeenCalledWith();

    expect(useGlobalPipesMock).toHaveBeenCalledTimes(1);
    expect(useGlobalPipesMock).toHaveBeenCalledWith(validationPipeInstance);

    expect(listenMock).toHaveBeenCalledTimes(1);
    expect(listenMock).toHaveBeenCalledWith(3000);

    expect(createMock.mock.invocationCallOrder[0]).toBeLessThan(
      validationPipeMock.mock.invocationCallOrder[0],
    );
    expect(validationPipeMock.mock.invocationCallOrder[0]).toBeLessThan(
      useGlobalPipesMock.mock.invocationCallOrder[0],
    );
    expect(useGlobalPipesMock.mock.invocationCallOrder[0]).toBeLessThan(
      listenMock.mock.invocationCallOrder[0],
    );
  });
});