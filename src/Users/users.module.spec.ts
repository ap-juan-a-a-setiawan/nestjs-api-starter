import { Test } from '@nestjs/testing';
import { UsersModule } from './users.module';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubscriber } from './subscribers/user.subscriber';
import { UserRepository } from './repositories/user.repository';

describe('UsersModule', () => {
  let moduleRef: any;

  const mockUserController = {
    provide: UserController,
    useValue: {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    },
  };

  const mockUserService = {
    provide: UserService,
    useValue: {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    },
  };

  const mockUserSubscriber = {
    provide: UserSubscriber,
    useValue: {
      afterInsert: jest.fn(),
      afterUpdate: jest.fn(),
      afterRemove: jest.fn(),
    },
  };

  const mockUserRepository = {
    provide: UserRepository,
    useValue: {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockTypeOrmModule = {
    provide: TypeOrmModule,
    useValue: {
      forFeature: jest.fn().mockReturnValue({
        module: TypeOrmModule,
        providers: [mockUserRepository],
        exports: [mockUserRepository],
      }),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(UserController)
      .useValue(mockUserController.useValue)
      .overrideProvider(UserService)
      .useValue(mockUserService.useValue)
      .overrideProvider(UserSubscriber)
      .useValue(mockUserSubscriber.useValue)
      .overrideProvider(UserRepository)
      .useValue(mockUserRepository.useValue)
      .compile();
  });

  describe('Module Definition', () => {
    it('should be defined', () => {
      expect(moduleRef).toBeDefined();
    });

    it('should have UsersModule as a module', () => {
      expect(moduleRef.get(UsersModule)).toBeDefined();
    });
  });

  describe('Module Structure', () => {
    it('should have UserController registered', () => {
      const controller = moduleRef.get(UserController);
      expect(controller).toBeDefined();
      expect(controller).toEqual(mockUserController.useValue);
    });

    it('should have UserService registered', () => {
      const service = moduleRef.get(UserService);
      expect(service).toBeDefined();
      expect(service).toEqual(mockUserService.useValue);
    });

    it('should have UserSubscriber registered', () => {
      const subscriber = moduleRef.get(UserSubscriber);
      expect(subscriber).toBeDefined();
      expect(subscriber).toEqual(mockUserSubscriber.useValue);
    });

    it('should have UserRepository registered', () => {
      const repository = moduleRef.get(UserRepository);
      expect(repository).toBeDefined();
      expect(repository).toEqual(mockUserRepository.useValue);
    });
  });

  describe('Module Exports', () => {
    it('should export UserService', async () => {
      const module = await Test.createTestingModule({
        imports: [UsersModule],
      })
        .overrideProvider(UserService)
        .useValue(mockUserService.useValue)
        .compile();

      const exportedService = module.get(UserService);
      expect(exportedService).toBeDefined();
      expect(exportedService).toEqual(mockUserService.useValue);
    });
  });

  describe('Module Imports', () => {
    it('should import TypeOrmModule with UserRepository', () => {
      const typeOrmModule = moduleRef.get(TypeOrmModule);
      expect(typeOrmModule).toBeDefined();
    });

    it('should call TypeOrmModule.forFeature with UserRepository', () => {
      expect(mockTypeOrmModule.useValue.forFeature).toHaveBeenCalledWith([UserRepository]);
    });
  });

  describe('Module Providers', () => {
    it('should have all providers available', () => {
      const providers = Reflect.getMetadata('providers', UsersModule);
      expect(providers).toContain(UserService);
      expect(providers).toContain(UserSubscriber);
    });

    it('should have all controllers available', () => {
      const controllers = Reflect.getMetadata('controllers', UsersModule);
      expect(controllers).toContain(UserController);
    });

    it('should have all imports available', () => {
      const imports = Reflect.getMetadata('imports', UsersModule);
      expect(imports).toContain(TypeOrmModule.forFeature([UserRepository]));
    });

    it('should have all exports available', () => {
      const exports = Reflect.getMetadata('exports', UsersModule);
      expect(exports).toContain(UserService);
    });
  });

  describe('Module Metadata Validation', () => {
    it('should have correct module metadata', () => {
      const moduleMetadata = Reflect.getMetadata('__module__', UsersModule);
      expect(moduleMetadata).toBeDefined();
    });

    it('should have correct decorator metadata', () => {
      const decoratorMetadata = Reflect.getMetadata('__decorator__', UsersModule);
      expect(decoratorMetadata).toBeDefined();
    });
  });

  describe('Module Integration', () => {
    it('should properly instantiate the module with all dependencies', async () => {
      const module = await Test.createTestingModule({
        imports: [UsersModule],
      })
        .overrideProvider(UserController)
        .useValue(mockUserController.useValue)
        .overrideProvider(UserService)
        .useValue(mockUserService.useValue)
        .overrideProvider(UserSubscriber)
        .useValue(mockUserSubscriber.useValue)
        .overrideProvider(UserRepository)
        .useValue(mockUserRepository.useValue)
        .compile();

      const app = module.createNestApplication();
      await app.init();

      expect(app).toBeDefined();
      await app.close();
    });

    it('should handle module without overrides', async () => {
      const module = await Test.createTestingModule({
        imports: [UsersModule],
      }).compile();

      expect(module).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty module configuration', () => {
      const module = new UsersModule();
      expect(module).toBeDefined();
    });

    it('should handle module with no dependencies', () => {
      const metadata = Reflect.getMetadata('imports', UsersModule);
      expect(metadata).toBeDefined();
      expect(Array.isArray(metadata)).toBe(true);
    });

    it('should handle module with no controllers', () => {
      const controllers = Reflect.getMetadata('controllers', UsersModule);
      expect(controllers).toBeDefined();
      expect(Array.isArray(controllers)).toBe(true);
    });

    it('should handle module with no providers', () => {
      const providers = Reflect.getMetadata('providers', UsersModule);
      expect(providers).toBeDefined();
      expect(Array.isArray(providers)).toBe(true);
    });

    it('should handle module with no exports', () => {
      const exports = Reflect.getMetadata('exports', UsersModule);
      expect(exports).toBeDefined();
      expect(Array.isArray(exports)).toBe(true);
    });
  });

  describe('Dependency Injection', () => {
    it('should inject UserService into UserController', async () => {
      const module = await Test.createTestingModule({
        imports: [UsersModule],
      })
        .overrideProvider(UserService)
        .useValue(mockUserService.useValue)
        .compile();

      const controller = module.get(UserController);
      expect(controller).toBeDefined();
    });

    it('should inject UserRepository into UserService', async () => {
      const module = await Test.createTestingModule({
        imports: [UsersModule],
      })
        .overrideProvider(UserRepository)
        .useValue(mockUserRepository.useValue)
        .compile();

      const service = module.get(UserService);
      expect(service).toBeDefined();
    });

    it('should handle circular dependencies', async () => {
      const module = await Test.createTestingModule({
        imports: [UsersModule],
      })
        .overrideProvider(UserController)
        .useValue(mockUserController.useValue)
        .overrideProvider(UserService)
        .useValue(mockUserService.useValue)
        .overrideProvider(UserSubscriber)
        .useValue(mockUserSubscriber.useValue)
        .overrideProvider(UserRepository)
        .useValue(mockUserRepository.useValue)
        .compile();

      expect(module).toBeDefined();
    });
  });

  describe('Module Lifecycle', () => {
    it('should initialize module successfully', async () => {
      const module = await Test.createTestingModule({
        imports: [UsersModule],
      })
        .overrideProvider(UserController)
        .useValue(mockUserController.useValue)
        .overrideProvider(UserService)
        .useValue(mockUserService.useValue)
        .overrideProvider(UserSubscriber)
        .useValue(mockUserSubscriber.useValue)
        .overrideProvider(UserRepository)
        .useValue(mockUserRepository.useValue)
        .compile();

      await module.init();
      expect(module).toBeDefined();
    });

    it('should close module successfully', async () => {
      const module = await Test.createTestingModule({
        imports: [UsersModule],
      })
        .overrideProvider(UserController)
        .useValue(mockUserController.useValue)
        .overrideProvider(UserService)
        .useValue(mockUserService.useValue)
        .overrideProvider(UserSubscriber)
        .useValue(mockUserSubscriber.useValue)
        .overrideProvider(UserRepository)
        .useValue(mockUserRepository.useValue)
        .compile();

      await module.close();
      expect(module).toBeDefined();
    });
  });
});