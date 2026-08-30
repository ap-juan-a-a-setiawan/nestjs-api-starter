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

    it('should import TypeOrmModule with config from configService', () => {
      const imports = Reflect.getMetadata('imports', AppModule);
      const typeOrmImport = imports.find(
        (imp: any) => imp && imp.module && imp.module.name === 'TypeOrmModuleMock'
      );
      expect(typeOrmImport).toBeDefined();
      expect(configService.getTypeOrmConfig).toHaveBeenCalled();
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
  });

  describe('TypeOrmModule Configuration', () => {
    it('should call getTypeOrmConfig when module is initialized', () => {
      expect(configService.getTypeOrmConfig).toHaveBeenCalledTimes(1);
    });

    it('should pass the correct config to TypeOrmModule.forRoot', () => {
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

    it('should handle TypeOrmModule.forRoot returning undefined', () => {
      (TypeOrmModule.forRoot as jest.Mock).mockReturnValueOnce(undefined);
      expect(() => {
        Reflect.getMetadata('imports', AppModule);
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing configService', () => {
      const originalGetTypeOrmConfig = configService.getTypeOrmConfig;
      (configService.getTypeOrmConfig as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Config service error');
      });
      
      expect(() => {
        Reflect.getMetadata('imports', AppModule);
      }).not.toThrow();
      
      (configService.getTypeOrmConfig as jest.Mock).mockImplementation(originalGetTypeOrmConfig);
    });

    it('should handle empty config from getTypeOrmConfig', () => {
      (configService.getTypeOrmConfig as jest.Mock).mockReturnValueOnce({});
      const imports = Reflect.getMetadata('imports', AppModule);
      expect(imports).toBeDefined();
    });

    it('should handle null config from getTypeOrmConfig', () => {
      (configService.getTypeOrmConfig as jest.Mock).mockReturnValueOnce(null);
      const imports = Reflect.getMetadata('imports', AppModule);
      expect(imports).toBeDefined();
    });
  });

  describe('Module Metadata', () => {
    it('should have correct module metadata', () => {
      const metadata = Reflect.getMetadataKeys(AppModule);
      expect(metadata).toContain('imports');
      expect(metadata).toContain('controllers');
      expect(metadata).toContain('providers');
    });

    it('should have all required decorators', () => {
      const imports = Reflect.getMetadata('imports', AppModule);
      const controllers = Reflect.getMetadata('controllers', AppModule);
      const providers = Reflect.getMetadata('providers', AppModule);

      expect(imports).toBeDefined();
      expect(controllers).toBeDefined();
      expect(providers).toBeDefined();
    });
  });

  describe('Module Compilation', () => {
    it('should compile successfully with all dependencies', async () => {
      const compiledModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      expect(compiledModule).toBeDefined();
      expect(compiledModule.get(AppModule)).toBeDefined();
    });

    it('should handle compilation errors gracefully', async () => {
      jest.spyOn(Test, 'createTestingModule').mockImplementationOnce(() => {
        throw new Error('Compilation error');
      });

      await expect(Test.createTestingModule({
        imports: [AppModule],
      }).compile()).rejects.toThrow('Compilation error');
    });
  });
});