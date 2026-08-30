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
jest.mock('@nestjs/typeorm');
jest.mock('./services/config.service');

describe('AppModule', () => {
  let moduleRef: any;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Mock configService.getTypeOrmConfig
    (configService.getTypeOrmConfig as jest.Mock).mockReturnValue({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'test',
      database: 'test',
      entities: [],
      synchronize: true,
    });

    // Mock TypeOrmModule.forRoot
    (TypeOrmModule.forRoot as jest.Mock).mockReturnValue({
      module: TypeOrmModule,
      providers: [],
      exports: [],
    });

    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  describe('Module Definition', () => {
    it('should be defined', () => {
      expect(moduleRef).toBeDefined();
    });

    it('should have AppController as a controller', () => {
      const controllers = Reflect.getMetadata('controllers', AppModule);
      expect(controllers).toContain(AppController);
    });

    it('should have UsersModule in imports', () => {
      const imports = Reflect.getMetadata('imports', AppModule);
      expect(imports).toContain(UsersModule);
    });

    it('should have AuthModule in imports', () => {
      const imports = Reflect.getMetadata('imports', AppModule);
      expect(imports).toContain(AuthModule);
    });

    it('should have TypeOrmModule.forRoot in imports', () => {
      const imports = Reflect.getMetadata('imports', AppModule);
      expect(imports).toContain(TypeOrmModule.forRoot(configService.getTypeOrmConfig()));
    });

    it('should have empty providers array', () => {
      const providers = Reflect.getMetadata('providers', AppModule);
      expect(providers).toEqual([]);
    });
  });

  describe('Module Configuration', () => {
    it('should call configService.getTypeOrmConfig when module is initialized', async () => {
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      expect(configService.getTypeOrmConfig).toHaveBeenCalled();
    });

    it('should call TypeOrmModule.forRoot with the config from configService', async () => {
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      expect(TypeOrmModule.forRoot).toHaveBeenCalledWith({
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

    it('should handle empty config from configService', async () => {
      (configService.getTypeOrmConfig as jest.Mock).mockReturnValue({});

      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      expect(TypeOrmModule.forRoot).toHaveBeenCalledWith({});
    });

    it('should handle undefined config from configService', async () => {
      (configService.getTypeOrmConfig as jest.Mock).mockReturnValue(undefined);

      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      expect(TypeOrmModule.forRoot).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Module Metadata', () => {
    it('should have correct module decorator metadata', () => {
      const moduleMetadata = Reflect.getMetadata('__module__', AppModule);
      expect(moduleMetadata).toBeDefined();
    });

    it('should have AppController registered', () => {
      const controllers = Reflect.getMetadata('controllers', AppModule);
      expect(controllers).toHaveLength(1);
      expect(controllers[0]).toBe(AppController);
    });

    it('should have exactly 3 imports', () => {
      const imports = Reflect.getMetadata('imports', AppModule);
      expect(imports).toHaveLength(3);
    });

    it('should have no providers', () => {
      const providers = Reflect.getMetadata('providers', AppModule);
      expect(providers).toHaveLength(0);
    });
  });

  describe('Module Instantiation', () => {
    it('should successfully instantiate the module', async () => {
      const module = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      expect(module).toBeDefined();
      expect(module.get(AppModule)).toBeDefined();
    });

    it('should instantiate with mocked dependencies', async () => {
      const module = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      const appModule = module.get(AppModule);
      expect(appModule).toBeInstanceOf(AppModule);
    });

    it('should handle module compilation errors gracefully', async () => {
      (configService.getTypeOrmConfig as jest.Mock).mockImplementation(() => {
        throw new Error('Database connection failed');
      });

      await expect(
        Test.createTestingModule({
          imports: [AppModule],
        }).compile()
      ).rejects.toThrow('Database connection failed');
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple module instantiations', async () => {
      const module1 = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      const module2 = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      expect(module1).toBeDefined();
      expect(module2).toBeDefined();
      expect(module1).not.toBe(module2);
    });

    it('should handle configService returning null', async () => {
      (configService.getTypeOrmConfig as jest.Mock).mockReturnValue(null);

      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      expect(TypeOrmModule.forRoot).toHaveBeenCalledWith(null);
    });

    it('should handle configService returning a promise', async () => {
      (configService.getTypeOrmConfig as jest.Mock).mockResolvedValue({
        type: 'mysql',
        host: 'db.example.com',
      });

      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      expect(TypeOrmModule.forRoot).toHaveBeenCalledWith({
        type: 'mysql',
        host: 'db.example.com',
      });
    });
  });
});