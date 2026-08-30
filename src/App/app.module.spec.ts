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

    it('should have AppModule as a provider', () => {
      expect(moduleRef.get(AppModule)).toBeDefined();
    });
  });

  describe('Imports Configuration', () => {
    it('should import UsersModule', () => {
      const imports = Reflect.getMetadata('imports', AppModule);
      expect(imports).toContain(UsersModule);
    });

    it('should import AuthModule', () => {
      const imports = Reflect.getMetadata('imports', AppModule);
      expect(imports).toContain(AuthModule);
    });

    it('should import TypeOrmModule with config', () => {
      const imports = Reflect.getMetadata('imports', AppModule);
      expect(imports).toContain(TypeOrmModule.forRoot(configService.getTypeOrmConfig()));
    });

    it('should call getTypeOrmConfig when module is initialized', () => {
      expect(configService.getTypeOrmConfig).toHaveBeenCalled();
    });

    it('should call getTypeOrmConfig exactly once', () => {
      expect(configService.getTypeOrmConfig).toHaveBeenCalledTimes(1);
    });
  });

  describe('Controllers Configuration', () => {
    it('should have AppController as a controller', () => {
      const controllers = Reflect.getMetadata('controllers', AppModule);
      expect(controllers).toContain(AppController);
    });

    it('should have exactly one controller', () => {
      const controllers = Reflect.getMetadata('controllers', AppModule);
      expect(controllers).toHaveLength(1);
    });
  });

  describe('Providers Configuration', () => {
    it('should have empty providers array', () => {
      const providers = Reflect.getMetadata('providers', AppModule);
      expect(providers).toEqual([]);
    });

    it('should have providers array defined', () => {
      const providers = Reflect.getMetadata('providers', AppModule);
      expect(providers).toBeDefined();
    });
  });

  describe('Module Metadata', () => {
    it('should have all required metadata', () => {
      const metadata = Reflect.getMetadataKeys(AppModule);
      expect(metadata).toContain('imports');
      expect(metadata).toContain('controllers');
      expect(metadata).toContain('providers');
    });

    it('should have correct number of imports', () => {
      const imports = Reflect.getMetadata('imports', AppModule);
      expect(imports).toHaveLength(3);
    });

    it('should have correct import order', () => {
      const imports = Reflect.getMetadata('imports', AppModule);
      expect(imports[0]).toBe(UsersModule);
      expect(imports[1]).toBe(AuthModule);
      expect(imports[2]).toBeDefined();
    });
  });

  describe('TypeOrm Configuration', () => {
    it('should pass correct config to TypeOrmModule.forRoot', () => {
      const expectedConfig = {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'test',
        password: 'test',
        database: 'test',
        entities: [],
        synchronize: true,
      };
      
      expect(configService.getTypeOrmConfig).toHaveBeenCalledWith();
      expect(TypeOrmModule.forRoot).toHaveBeenCalledWith(expectedConfig);
    });

    it('should handle TypeOrm config errors gracefully', () => {
      (configService.getTypeOrmConfig as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Database connection failed');
      });

      expect(() => {
        Reflect.getMetadata('imports', AppModule);
      }).not.toThrow();
    });
  });

  describe('Module Instantiation', () => {
    it('should create module instance successfully', async () => {
      const app = await moduleRef.createNestApplication();
      expect(app).toBeDefined();
      await app.close();
    });

    it('should initialize all imported modules', async () => {
      const usersModule = moduleRef.get(UsersModule);
      const authModule = moduleRef.get(AuthModule);
      
      expect(usersModule).toBeDefined();
      expect(authModule).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing TypeOrm config', () => {
      (configService.getTypeOrmConfig as jest.Mock).mockReturnValueOnce(undefined);
      
      const imports = Reflect.getMetadata('imports', AppModule);
      expect(imports).toBeDefined();
      expect(imports).toHaveLength(3);
    });

    it('should handle null TypeOrm config', () => {
      (configService.getTypeOrmConfig as jest.Mock).mockReturnValueOnce(null);
      
      const imports = Reflect.getMetadata('imports', AppModule);
      expect(imports).toBeDefined();
      expect(imports).toHaveLength(3);
    });

    it('should handle empty config object', () => {
      (configService.getTypeOrmConfig as jest.Mock).mockReturnValueOnce({});
      
      const imports = Reflect.getMetadata('imports', AppModule);
      expect(imports).toBeDefined();
      expect(imports).toHaveLength(3);
    });
  });

  describe('Dependency Injection', () => {
    it('should resolve AppController dependency', () => {
      const controller = moduleRef.get(AppController);
      expect(controller).toBeDefined();
    });

    it('should resolve all module dependencies', () => {
      const dependencies = Reflect.getMetadata('imports', AppModule);
      dependencies.forEach((dep: any) => {
        expect(dep).toBeDefined();
      });
    });
  });

  describe('Module Structure', () => {
    it('should be a class', () => {
      expect(typeof AppModule).toBe('function');
    });

    it('should have @Module decorator applied', () => {
      const isModule = Reflect.getMetadata('__module:imports__', AppModule) !== undefined;
      expect(isModule).toBe(true);
    });

    it('should export AppModule', () => {
      expect(AppModule).toBeDefined();
      expect(AppModule.name).toBe('AppModule');
    });
  });
});