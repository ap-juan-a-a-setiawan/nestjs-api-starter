typescript
import 'reflect-metadata';
import { Controller, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

@Module({})
class UsersModuleMock {}
@Module({})
class AuthModuleMock {}
@Controller()
class AppControllerMock {}
@Module({})
class TypeOrmModuleMock {}

const mockUsersModule = UsersModuleMock;
const mockAuthModule = AuthModuleMock;
const mockAppController = AppControllerMock;
const mockConfigService = {
  getTypeOrmConfig: jest.fn().mockReturnValue({ type: 'postgres' }),
};
const mockTypeOrmModule = {
  forRoot: jest.fn().mockReturnValue({ module: TypeOrmModuleMock, providers: [] }),
};

jest.mock('../Users/users.module', () => ({
  UsersModule: mockUsersModule,
}));
jest.mock('../Auth/auth.module', () => ({
  AuthModule: mockAuthModule,
}));
jest.mock('./controllers/app.controller', () => ({
  AppController: mockAppController,
}));
jest.mock('./services/config.service', () => ({
  configService: mockConfigService,
}));
jest.mock('@nestjs/typeorm', () => ({
  TypeOrmModule: mockTypeOrmModule,
}));

const AppModule: any = require('./app.module').AppModule;

describe('AppModule', () => {
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should be defined', () => {
    expect(AppModule).toBeDefined();
  });

  it('should compile the module', () => {
    expect(moduleRef).toBeDefined();
  });

  it('should register the AppController', () => {
    const appController = moduleRef.get(mockAppController);
    expect(appController).toBeDefined();
  });

  it('should have correct module metadata', () => {
    const imports = Reflect.getMetadata('imports', AppModule);
    const controllers = Reflect.getMetadata('controllers', AppModule);
    const providers = Reflect.getMetadata('providers', AppModule);

    expect(imports).toHaveLength(3);
    expect(imports[0]).toBe(mockUsersModule);
    expect(imports[1]).toBe(mockAuthModule);
    expect(imports[2]).toBe(mockTypeOrmModule.forRoot.mock.results[0].value);

    expect(controllers).toHaveLength(1);
    expect(controllers[0]).toBe(mockAppController);

    expect(providers).toEqual([]);
  });

  it('should call configService.getTypeOrmConfig and TypeOrmModule.forRoot with config', () => {
    expect(mockConfigService.getTypeOrmConfig).toHaveBeenCalledTimes(1);
    expect(mockTypeOrmModule.forRoot).toHaveBeenCalledWith({ type: 'postgres' });
  });

  it('should handle configService returning undefined gracefully', () => {
    mockConfigService.getTypeOrmConfig.mockReturnValue(undefined);

    jest.isolateModules(() => {
      const ReloadedAppModule: any = require('./app.module').AppModule;
      expect(ReloadedAppModule).toBeDefined();
    });

    expect(mockConfigService.getTypeOrmConfig).toHaveBeenLastCalledWith();
    expect(mockTypeOrmModule.forRoot).toHaveBeenLastCalledWith(undefined);
  });

  it('should throw if configService.getTypeOrmConfig throws', () => {
    mockConfigService.getTypeOrmConfig.mockImplementation(() => {
      throw new Error('Config error');
    });

    jest.isolateModules(() => {
      expect(() => require('./app.module')).toThrow('Config error');
    });
  });
});