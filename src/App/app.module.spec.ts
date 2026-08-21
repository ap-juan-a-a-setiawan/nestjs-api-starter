import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from './app.module';
import { AppController } from './controllers/app.controller';
import { UsersModule } from '../Users/users.module';
import { AuthModule } from '../Auth/auth.module';
import { configService } from './services/config.service';

jest.mock('./services/config.service', () => ({
  configService: {
    getTypeOrmConfig: jest.fn().mockReturnValue({
      type: 'sqlite',
      database: ':memory:',
      entities: [],
      synchronize: true,
    }),
  },
}));

jest.mock('./controllers/app.controller', () => {
  const { Controller } = jest.requireActual('@nestjs/common');
  @Controller()
  class MockAppController {}
  return { AppController: MockAppController };
});

jest.mock('../Users/users.module', () => {
  const { Module } = jest.requireActual('@nestjs/common');
  @Module({})
  class MockUsersModule {}
  return { UsersModule: MockUsersModule };
});

jest.mock('../Auth/auth.module', () => {
  const { Module } = jest.requireActual('@nestjs/common');
  @Module({})
  class MockAuthModule {}
  return { AuthModule: MockAuthModule };
});

jest.mock('@nestjs/typeorm', () => {
  const { Module } = jest.requireActual('@nestjs/common');
  @Module({})
  class MockTypeOrmCoreModule {}
  return {
    TypeOrmModule: {
      forRoot: jest.fn().mockReturnValue({
        module: MockTypeOrmCoreModule,
        providers: [],
        exports: [],
        imports: [],
      }),
    },
  };
});

describe('AppModule', () => {
  async function createModule(): Promise<TestingModule> {
    return Test.createTestingModule({ imports: [AppModule] }).compile();
  }

  it('should be defined', () => {
    expect(AppModule).toBeDefined();
  });

  it('should compile with mocked dependencies', async () => {
    const moduleRef = await createModule();
    expect(moduleRef).toBeDefined();
    expect(moduleRef.get(AppController)).toBeDefined();
    await moduleRef.close();
  });

  it('should call configService.getTypeOrmConfig once with no arguments', () => {
    expect(configService.getTypeOrmConfig).toHaveBeenCalledTimes(1);
    expect(configService.getTypeOrmConfig).toHaveBeenCalledWith();
  });

  it('should call TypeOrmModule.forRoot once with the config returned by configService', () => {
    expect(TypeOrmModule.forRoot).toHaveBeenCalledTimes(1);
    const expectedConfig = configService.getTypeOrmConfig.mock.results[0].value;
    expect(TypeOrmModule.forRoot).toHaveBeenCalledWith(expectedConfig);
  });

  it('should include UsersModule and AuthModule in module imports', () => {
    const imports = Reflect.getMetadata('imports', AppModule) as any[];
    expect(imports).toEqual(expect.arrayContaining([UsersModule, AuthModule]));
  });

  it('should include TypeOrmModule.forRoot result in module imports', () => {
    const imports = Reflect.getMetadata('imports', AppModule) as any[];
    const typeOrmImport = imports.find(
      (importer: any) => importer && typeof importer === 'object' && importer.module,
    );
    expect(typeOrmImport).toBeDefined();
  });

  it('should include AppController in controllers metadata', () => {
    const controllers = Reflect.getMetadata('controllers', AppModule) as any[];
    expect(controllers).toContain(AppController);
  });

  it('should have no providers metadata', () => {
    const providers = Reflect.getMetadata('providers', AppModule) as any[];
    expect(providers).toEqual([]);
  });
});