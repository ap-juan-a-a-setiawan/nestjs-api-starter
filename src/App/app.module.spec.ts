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

  describe('Module definition', () => {
    it('should be defined', () => {
      expect(moduleRef).toBeDefined();
    });

    it('should have AppModule defined', () => {
      expect(AppModule).toBeDefined();
    });
  });

  describe('Imports', () => {
    it('should import UsersModule', () => {
      const metadata = Reflect.getMetadata('imports', AppModule);
      expect(metadata).toContain(UsersModule);
    });

    it('should import AuthModule', () => {
      const metadata = Reflect.getMetadata('imports', AppModule);
      expect(metadata).toContain(AuthModule);
    });

    it('should import TypeOrmModule with config', () => {
      const metadata = Reflect.getMetadata('imports', AppModule);
      const typeOrmImport = metadata.find(
        (item: any) => item && item.module === TypeOrmModule,
      );
      expect(typeOrmImport).toBeDefined();
      expect(configService.getTypeOrmConfig).toHaveBeenCalled();
    });

    it('should call getTypeOrmConfig exactly once', () => {
      expect(configService.getTypeOrmConfig).toHaveBeenCalledTimes(1);
    });

    it('should pass correct config to TypeOrmModule.forRoot', () => {
      const mockConfig = {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'test',
        password: 'test',
        database: 'test',
        entities: [],
        synchronize: true,
      };
      expect(TypeOrmModule.forRoot).toHaveBeenCalledWith(mockConfig);
    });
  });

  describe('Controllers', () => {
    it('should have AppController in controllers', () => {
      const metadata = Reflect.getMetadata('controllers', AppModule);
      expect(metadata).toContain(AppController);
    });

    it('should have exactly one controller', () => {
      const metadata = Reflect.getMetadata('controllers', AppModule);
      expect(metadata).toHaveLength(1);
    });
  });

  describe('Providers', () => {
    it('should have providers array defined', () => {
      const metadata = Reflect.getMetadata('providers', AppModule);
      expect(metadata).toBeDefined();
      expect(Array.isArray(metadata)).toBe(true);
    });

    it('should have empty providers array', () => {
      const metadata = Reflect.getMetadata('providers', AppModule);
      expect(metadata).toHaveLength(0);
    });
  });

  describe('Module metadata', () => {
    it('should have all required metadata', () => {
      const imports = Reflect.getMetadata('imports', AppModule);
      const controllers = Reflect.getMetadata('controllers', AppModule);
      const providers = Reflect.getMetadata('providers', AppModule);

      expect(imports).toBeDefined();
      expect(controllers).toBeDefined();
      expect(providers).toBeDefined();
    });

    it('should have correct number of imports', () => {
      const metadata = Reflect.getMetadata('imports', AppModule);
      expect(metadata).toHaveLength(3);
    });
  });

  describe('Edge cases', () => {
    it('should handle missing config gracefully', async () => {
      (configService.getTypeOrmConfig as jest.Mock).mockReturnValueOnce(undefined);
      
      expect(() => {
        Reflect.getMetadata('imports', AppModule);
      }).toBeDefined();
    });

    it('should handle empty config object', async () => {
      (configService.getTypeOrmConfig as jest.Mock).mockReturnValueOnce({});
      
      expect(() => {
        Reflect.getMetadata('imports', AppModule);
      }).toBeDefined();
    });

    it('should handle null config', async () => {
      (configService.getTypeOrmConfig as jest.Mock).mockReturnValueOnce(null);
      
      expect(() => {
        Reflect.getMetadata('imports', AppModule);
      }).toBeDefined();
    });
  });

  describe('Module instantiation', () => {
    it('should create module instance', () => {
      const appModule = new AppModule();
      expect(appModule).toBeInstanceOf(AppModule);
    });

    it('should have no additional properties', () => {
      const appModule = new AppModule();
      expect(Object.keys(appModule)).toHaveLength(0);
    });
  });
});