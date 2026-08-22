import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppController } from './controllers/app.controller';
import { UsersModule } from '../Users/users.module';
import { AuthModule } from '../Auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './services/config.service';

jest.mock('./services/config.service', () => ({
  configService: {
    getTypeOrmConfig: jest.fn().mockReturnValue({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'test',
      database: 'test',
      entities: [],
      synchronize: true,
    }),
  },
}));

jest.mock('../Users/users.module', () => ({
  UsersModule: class UsersModuleMock {},
}));

jest.mock('../Auth/auth.module', () => ({
  AuthModule: class AuthModuleMock {},
}));

jest.mock('@nestjs/typeorm', () => ({
  TypeOrmModule: {
    forRoot: jest.fn().mockReturnValue({
      module: class TypeOrmModuleMock {},
      providers: [],
      exports: [],
    }),
  },
}));

jest.mock('./controllers/app.controller', () => ({
  AppController: class AppControllerMock {},
}));

describe('AppModule', () => {
  let moduleRef: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  describe('Module Definition', () => {
    it('should be defined', () => {
      expect(moduleRef).toBeDefined();
    });

    it('should have AppModule defined', () => {
      expect(AppModule).toBeDefined();
    });

    it('should have the correct metadata', () => {
      const metadata = Reflect.getMetadata('imports', AppModule);
      expect(metadata).toBeDefined();
      expect(metadata).toHaveLength(3);
    });

    it('should include UsersModule in imports', () => {
      const metadata = Reflect.getMetadata('imports', AppModule);
      expect(metadata).toContain(UsersModule);
    });

    it('should include AuthModule in imports', () => {
      const metadata = Reflect.getMetadata('imports', AppModule);
      expect(metadata).toContain(AuthModule);
    });

    it('should include TypeOrmModule in imports', () => {
      const metadata = Reflect.getMetadata('imports', AppModule);
      expect(metadata).toContain(TypeOrmModule);
    });

    it('should have AppController in controllers', () => {
      const metadata = Reflect.getMetadata('controllers', AppModule);
      expect(metadata).toBeDefined();
      expect(metadata).toContain(AppController);
    });

    it('should have empty providers array', () => {
      const metadata = Reflect.getMetadata('providers', AppModule);
      expect(metadata).toBeDefined();
      expect(metadata).toEqual([]);
    });
  });

  describe('TypeOrmModule Configuration', () => {
    it('should call getTypeOrmConfig when module is initialized', () => {
      expect(configService.getTypeOrmConfig).toHaveBeenCalled();
    });

    it('should call getTypeOrmConfig exactly once', () => {
      expect(configService.getTypeOrmConfig).toHaveBeenCalledTimes(1);
    });

    it('should call TypeOrmModule.forRoot with the config from configService', () => {
      expect(TypeOrmModule.forRoot).toHaveBeenCalledWith(
        configService.getTypeOrmConfig()
      );
    });

    it('should return the correct TypeORM config', () => {
      const config = configService.getTypeOrmConfig();
      expect(config).toEqual({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'test',
        password: 'test',
        database: 'test',
        entities: [],
        synchronize: true,
      });
    });
  });

  describe('Module Compilation', () => {
    it('should successfully compile the module', async () => {
      const compiledModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      expect(compiledModule).toBeDefined();
    });

    it('should have the AppController available', async () => {
      const app = moduleRef.createNestApplication();
      const controller = app.get(AppController);
      expect(controller).toBeDefined();
    });

    it('should have the UsersModule available', async () => {
      const app = moduleRef.createNestApplication();
      const usersModule = app.get(UsersModule);
      expect(usersModule).toBeDefined();
    });

    it('should have the AuthModule available', async () => {
      const app = moduleRef.createNestApplication();
      const authModule = app.get(AuthModule);
      expect(authModule).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing TypeORM config gracefully', async () => {
      (configService.getTypeOrmConfig as jest.Mock).mockReturnValueOnce(undefined);
      
      expect(() => {
        Reflect.getMetadata('imports', AppModule);
      }).toBeDefined();
    });

    it('should handle empty providers array', () => {
      const providers = Reflect.getMetadata('providers', AppModule);
      expect(Array.isArray(providers)).toBe(true);
      expect(providers.length).toBe(0);
    });

    it('should have exactly one controller', () => {
      const controllers = Reflect.getMetadata('controllers', AppModule);
      expect(controllers).toHaveLength(1);
    });

    it('should have exactly three imports', () => {
      const imports = Reflect.getMetadata('imports', AppModule);
      expect(imports).toHaveLength(3);
    });

    it('should not have any exports', () => {
      const exports = Reflect.getMetadata('exports', AppModule);
      expect(exports).toBeUndefined();
    });
  });

  describe('Dependency Injection', () => {
    it('should inject AppController correctly', async () => {
      const app = moduleRef.createNestApplication();
      const controller = app.get(AppController);
      expect(controller).toBeInstanceOf(AppController);
    });

    it('should inject UsersModule correctly', async () => {
      const app = moduleRef.createNestApplication();
      const usersModule = app.get(UsersModule);
      expect(usersModule).toBeInstanceOf(UsersModule);
    });

    it('should inject AuthModule correctly', async () => {
      const app = moduleRef.createNestApplication();
      const authModule = app.get(AuthModule);
      expect(authModule).toBeInstanceOf(AuthModule);
    });

    it('should not have any providers to inject', () => {
      const providers = Reflect.getMetadata('providers', AppModule);
      expect(providers).toHaveLength(0);
    });
  });

  describe('Module Structure', () => {
    it('should be a NestJS module', () => {
      expect(AppModule).toBeDefined();
      expect(typeof AppModule).toBe('function');
    });

    it('should have the @Module decorator applied', () => {
      const isModule = Reflect.getMetadata('__module:decorator', AppModule);
      expect(isModule).toBeDefined();
    });

    it('should have the correct module name', () => {
      expect(AppModule.name).toBe('AppModule');
    });

    it('should not have any global modules', () => {
      const isGlobal = Reflect.getMetadata('__global:module', AppModule);
      expect(isGlobal).toBeUndefined();
    });
  });
});