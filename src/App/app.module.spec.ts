typescript
import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { configService } from './services/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../Users/users.module';
import { AuthModule } from '../Auth/auth.module';
import { AppController } from './controllers/app.controller';

jest.mock('@nestjs/typeorm', () => ({
  TypeOrmModule: {
    forRoot: jest.fn().mockReturnValue({
      module: class TypeOrmCoreModule {},
      providers: [],
    }),
  },
}));

jest.mock('./services/config.service', () => ({
  configService: {
    getTypeOrmConfig: jest.fn().mockReturnValue({ type: 'postgres' }),
  },
}));

jest.mock('./controllers/app.controller', () => {
  const { Controller } = require('@nestjs/common');
  @Controller()
  class AppController {}
  return { AppController };
});

jest.mock('../Users/users.module', () => {
  const { Module } = require('@nestjs/common');
  @Module({})
  class UsersModule {}
  return { UsersModule };
});

jest.mock('../Auth/auth.module', () => {
  const { Module } = require('@nestjs/common');
  @Module({})
  class AuthModule {}
  return { AuthModule };
});

describe('AppModule', () => {
  afterEach(() => {
    jest.clearAllMocks();
    (configService.getTypeOrmConfig as jest.Mock).mockReturnValue({ type: 'postgres' });
    (TypeOrmModule.forRoot as jest.Mock).mockReturnValue({
      module: class TypeOrmCoreModule {},
      providers: [],
    });
  });

  it('should be defined', () => {
    const module = new AppModule();
    expect(module).toBeDefined();
  });

  it('should call configService.getTypeOrmConfig and TypeOrmModule.forRoot with the config', () => {
    expect(configService.getTypeOrmConfig).toHaveBeenCalled();
    expect(TypeOrmModule.forRoot).toHaveBeenCalledWith({ type: 'postgres' });
  });

  it('should have AppController in controllers metadata', () => {
    const controllers = Reflect.getMetadata('controllers', AppModule);
    expect(controllers).toContain(AppController);
  });

  it('should have UsersModule and AuthModule in imports metadata', () => {
    const imports = Reflect.getMetadata('imports', AppModule);
    expect(imports).toContain(UsersModule);
    expect(imports).toContain(AuthModule);
  });

  it('should have empty providers metadata', () => {
    const providers = Reflect.getMetadata('providers', AppModule);
    expect(providers).toEqual([]);
  });

  it('should compile with Test.createTestingModule', async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    expect(moduleRef).toBeDefined();
  });

  it('should handle configService.getTypeOrmConfig returning undefined', () => {
    (configService.getTypeOrmConfig as jest.Mock).mockReturnValue(undefined);
    jest.resetModules();
    const { AppModule: AppModule2 } = require('./app.module');
    expect(configService.getTypeOrmConfig).toHaveBeenCalled();
    expect(TypeOrmModule.forRoot).toHaveBeenCalledWith(undefined);
    expect(AppModule2).toBeDefined();
  });
});