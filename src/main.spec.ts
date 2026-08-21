import { Test } from '@nestjs/testing';

let createMock: jest.Mock;
let useGlobalPipesMock: jest.Mock;
let listenMock: jest.Mock;
let validationPipeMock: jest.Mock;

async function flushPromises() {
  await new Promise(resolve => setTimeout(resolve, 0));
}

describe('main.ts bootstrap', () => {
  beforeEach(async () => {
    jest.unmock('@nestjs/core');
    jest.unmock('@nestjs/common');
    jest.unmock('./App/app.module');
    jest.resetModules();

    useGlobalPipesMock = jest.fn();
    listenMock = jest.fn();
    validationPipeMock = jest.fn();

    const appMock = {
      useGlobalPipes: useGlobalPipesMock,
      listen: listenMock,
    };

    const moduleRef = await Test.createTestingModule({
      providers: [{ provide: 'MOCK_APP', useValue: appMock }],
    }).compile();
    const providedApp = moduleRef.get<any>('MOCK_APP');

    jest.resetModules();

    createMock = jest.fn().mockResolvedValue(providedApp);
    listenMock.mockResolvedValue(undefined);

    jest.doMock('@nestjs/core', () => ({
      NestFactory: { create: createMock },
    }));
    jest.doMock('@nestjs/common', () => ({
      ValidationPipe: validationPipeMock,
    }));
    jest.doMock('./App/app.module', () => ({
      AppModule: { name: 'MockAppModule' },
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create application with AppModule', async () => {
    await import('./main');
    await flushPromises();

    expect(createMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledWith({ name: 'MockAppModule' });
  });

  it('should configure a global ValidationPipe', async () => {
    await import('./main');
    await flushPromises();

    expect(validationPipeMock).toHaveBeenCalledTimes(1);
    expect(validationPipeMock).toHaveBeenCalledWith();
    expect(validationPipeMock.mock.instances).toHaveLength(1);

    const pipeInstance = validationPipeMock.mock.instances[0];
    expect(useGlobalPipesMock).toHaveBeenCalledTimes(1);
    expect(useGlobalPipesMock).toHaveBeenCalledWith(pipeInstance);
  });

  it('should listen on port 3000', async () => {
    await import('./main');
    await flushPromises();

    expect(listenMock).toHaveBeenCalledTimes(1);
    expect(listenMock).toHaveBeenCalledWith(3000);
  });

  it('should call create, then useGlobalPipes, then listen in order', async () => {
    await import('./main');
    await flushPromises();

    const createOrder = createMock.mock.invocationCallOrder[0];
    const useGlobalPipesOrder = useGlobalPipesMock.mock.invocationCallOrder[0];
    const listenOrder = listenMock.mock.invocationCallOrder[0];

    expect(createOrder).toBeLessThan(useGlobalPipesOrder);
    expect(useGlobalPipesOrder).toBeLessThan(listenOrder);
  });
});