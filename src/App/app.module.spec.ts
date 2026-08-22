import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppController } from './controllers/app.controller';
import { UsersModule } from '../Users/users.module';
import { AuthModule } from '../Auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './services/config.service';

jest.mock('./controllers/app.controller');
jest.mock('../Users/users.module');
jest.mock('../Auth/auth.module');
jest.mock('@nestjs/typeorm', () => ({
  TypeOrmModule: {
    forRoot: jest.fn().mockReturnValue({ module: 'TypeOrmModule', options: {} })
  }
}));
jest.mock('./services/config.service', () => ({
  configService: {
    getTypeOrmConfig: jest.fn().mockReturnValue({ type: 'postgres', host: 'localhost' })
  }
}));

describe('AppModule', () => {
  let moduleRef: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    
    moduleRef = await Test.createTestingModule({
      imports: [
        UsersModule,
        AuthModule,
        TypeOrmModule.forRoot(configService.getTypeOrmConfig())
      ],
      controllers: [
        AppController
      ],
      providers: []
    }).compile();
  });

  describe('Module Definition', () => {
    it('should be defined', () => {
      expect(AppModule).toBeDefined();
    });

    it('should have the correct imports', () => {
      const metadata = Reflect.getMetadata('imports', AppModule);
      expect(metadata).toBeDefined();
      expect(metadata).toContain(UsersModule);
      expect(metadata).toContain(AuthModule);
      expect(metadata).toContain(TypeOrmModule.forRoot(configService.getTypeOrmConfig()));
    });

    it('should have the correct controllers', () => {
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

  describe('Module Compilation', () => {
    it('should compile the module successfully', async () => {
      expect(moduleRef).toBeDefined();
    });

    it('should have AppController as a controller', () => {
      const controllers = moduleRef.controllers;
      expect(controllers).toBeDefined();
      expect(controllers).toContain(AppController);
    });

    it('should have UsersModule as an import', () => {
      const imports = moduleRef.imports;
      expect(imports).toBeDefined();
      expect(imports).toContain(UsersModule);
    });

    it('should have AuthModule as an import', () => {
      const imports = moduleRef.imports;
      expect(imports).toBeDefined();
      expect(imports).toContain(AuthModule);
    });
  });

  describe('Config Service Integration', () => {
    it('should call getTypeOrmConfig when module is created', () => {
      expect(configService.getTypeOrmConfig).toHaveBeenCalled();
    });

    it('should call getTypeOrmConfig exactly once', () => {
      expect(configService.getTypeOrmConfig).toHaveBeenCalledTimes(1);
    });

    it('should pass the config to TypeOrmModule.forRoot', () => {
      const config = configService.getTypeOrmConfig();
      expect(TypeOrmModule.forRoot).toHaveBeenCalledWith(config);
    });

    it('should return a valid TypeORM config', () => {
      const config = configService.getTypeOrmConfig();
      expect(config).toEqual({ type: 'postgres', host: 'localhost' });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty providers array', () => {
      const metadata = Reflect.getMetadata('providers', AppModule);
      expect(metadata).toHaveLength(0);
    });

    it('should have exactly 3 imports', () => {
      const metadata = Reflect.getMetadata('imports', AppModule);
      expect(metadata).toHaveLength(3);
    });

    it('should have exactly 1 controller', () => {
      const metadata = Reflect.getMetadata('controllers', AppModule);
      expect(metadata).toHaveLength(1);
    });

    it('should not have any providers', () => {
      const metadata = Reflect.getMetadata('providers', AppModule);
      expect(metadata).toHaveLength(0);
    });

    it('should not include any unexpected imports', () => {
      const metadata = Reflect.getMetadata('imports', AppModule);
      const expectedImports = [UsersModule, AuthModule, TypeOrmModule.forRoot(configService.getTypeOrmConfig())];
      expect(metadata).toEqual(expectedImports);
    });

    it('should not include any unexpected controllers', () => {
      const metadata = Reflect.getMetadata('controllers', AppModule);
      expect(metadata).toEqual([AppController]);
    });
  });

  describe('Module Instance', () => {
    it('should create a module instance', () => {
      const appModule = new AppModule();
      expect(appModule).toBeInstanceOf(AppModule);
    });

    it('should have no properties', () => {
      const appModule = new AppModule();
      expect(Object.keys(appModule)).toHaveLength(0);
    });

    it('should be a valid NestJS module', () => {
      expect(AppModule).toBeDefined();
      expect(typeof AppModule).toBe('function');
    });
  });
});