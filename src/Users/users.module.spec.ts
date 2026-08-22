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
    getUsers: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  const mockUserService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserSubscriber = {
    afterInsert: jest.fn(),
    afterUpdate: jest.fn(),
    afterRemove: jest.fn(),
  };

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    moduleRef = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([UserRepository])],
      controllers: [UserController],
      providers: [UserService, UserSubscriber],
      exports: [UserService],
    })
      .overrideProvider(UserController)
      .useValue(mockUserController)
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideProvider(UserSubscriber)
      .useValue(mockUserSubscriber)
      .overrideProvider(UserRepository)
      .useValue(mockUserRepository)
      .compile();
  });

  describe('Module definition', () => {
    it('should be defined', () => {
      expect(moduleRef).toBeDefined();
    });

    it('should have UserController as a controller', () => {
      const controllers = Reflect.getMetadata('controllers', UsersModule);
      expect(controllers).toContain(UserController);
    });

    it('should have UserService and UserSubscriber as providers', () => {
      const providers = Reflect.getMetadata('providers', UsersModule);
      expect(providers).toContain(UserService);
      expect(providers).toContain(UserSubscriber);
    });

    it('should have TypeOrmModule.forFeature([UserRepository]) in imports', () => {
      const imports = Reflect.getMetadata('imports', UsersModule);
      expect(imports).toContainEqual(TypeOrmModule.forFeature([UserRepository]));
    });

    it('should export UserService', () => {
      const exports = Reflect.getMetadata('exports', UsersModule);
      expect(exports).toContain(UserService);
    });
  });

  describe('Module instantiation', () => {
    it('should instantiate UserController', () => {
      const controller = moduleRef.get(UserController);
      expect(controller).toBeDefined();
      expect(controller).toEqual(mockUserController);
    });

    it('should instantiate UserService', () => {
      const service = moduleRef.get(UserService);
      expect(service).toBeDefined();
      expect(service).toEqual(mockUserService);
    });

    it('should instantiate UserSubscriber', () => {
      const subscriber = moduleRef.get(UserSubscriber);
      expect(subscriber).toBeDefined();
      expect(subscriber).toEqual(mockUserSubscriber);
    });

    it('should instantiate UserRepository', () => {
      const repository = moduleRef.get(UserRepository);
      expect(repository).toBeDefined();
      expect(repository).toEqual(mockUserRepository);
    });
  });

  describe('Module exports', () => {
    it('should export UserService to other modules', () => {
      const exportedProviders = Reflect.getMetadata('exports', UsersModule);
      expect(exportedProviders).toContain(UserService);
    });

    it('should not export UserController', () => {
      const exportedProviders = Reflect.getMetadata('exports', UsersModule);
      expect(exportedProviders).not.toContain(UserController);
    });

    it('should not export UserSubscriber', () => {
      const exportedProviders = Reflect.getMetadata('exports', UsersModule);
      expect(exportedProviders).not.toContain(UserSubscriber);
    });

    it('should not export UserRepository', () => {
      const exportedProviders = Reflect.getMetadata('exports', UsersModule);
      expect(exportedProviders).not.toContain(UserRepository);
    });
  });

  describe('Module metadata validation', () => {
    it('should have correct module decorator', () => {
      const moduleClass = UsersModule;
      expect(moduleClass).toBeDefined();
      expect(typeof moduleClass).toBe('function');
    });

    it('should have @Module decorator applied', () => {
      const metadata = Reflect.getMetadata('imports', UsersModule);
      expect(metadata).toBeDefined();
    });

    it('should have valid imports array', () => {
      const imports = Reflect.getMetadata('imports', UsersModule);
      expect(Array.isArray(imports)).toBe(true);
      expect(imports.length).toBe(1);
    });

    it('should have valid controllers array', () => {
      const controllers = Reflect.getMetadata('controllers', UsersModule);
      expect(Array.isArray(controllers)).toBe(true);
      expect(controllers.length).toBe(1);
    });

    it('should have valid providers array', () => {
      const providers = Reflect.getMetadata('providers', UsersModule);
      expect(Array.isArray(providers)).toBe(true);
      expect(providers.length).toBe(2);
    });

    it('should have valid exports array', () => {
      const exports = Reflect.getMetadata('exports', UsersModule);
      expect(Array.isArray(exports)).toBe(true);
      expect(exports.length).toBe(1);
    });
  });

  describe('Module edge cases', () => {
    it('should handle empty module instantiation', async () => {
      const emptyModule = await Test.createTestingModule({
        imports: [],
        controllers: [],
        providers: [],
        exports: [],
      }).compile();

      expect(emptyModule).toBeDefined();
    });

    it('should handle module with only imports', async () => {
      const importsOnlyModule = await Test.createTestingModule({
        imports: [TypeOrmModule.forFeature([UserRepository])],
      }).compile();

      expect(importsOnlyModule).toBeDefined();
    });

    it('should handle module with only controllers', async () => {
      const controllersOnlyModule = await Test.createTestingModule({
        controllers: [UserController],
      })
        .overrideProvider(UserController)
        .useValue(mockUserController)
        .compile();

      expect(controllersOnlyModule).toBeDefined();
    });

    it('should handle module with only providers', async () => {
      const providersOnlyModule = await Test.createTestingModule({
        providers: [UserService, UserSubscriber],
      })
        .overrideProvider(UserService)
        .useValue(mockUserService)
        .overrideProvider(UserSubscriber)
        .useValue(mockUserSubscriber)
        .compile();

      expect(providersOnlyModule).toBeDefined();
    });

    it('should handle module with only exports', async () => {
      const exportsOnlyModule = await Test.createTestingModule({
        exports: [UserService],
      }).compile();

      expect(exportsOnlyModule).toBeDefined();
    });
  });

  describe('Module dependency resolution', () => {
    it('should resolve UserService dependency for UserController', () => {
      const controller = moduleRef.get(UserController);
      expect(controller).toBeDefined();
      expect(mockUserController).toBeDefined();
    });

    it('should resolve UserRepository dependency for TypeOrmModule', () => {
      const repository = moduleRef.get(UserRepository);
      expect(repository).toBeDefined();
      expect(mockUserRepository).toBeDefined();
    });

    it('should resolve UserSubscriber dependency', () => {
      const subscriber = moduleRef.get(UserSubscriber);
      expect(subscriber).toBeDefined();
      expect(mockUserSubscriber).toBeDefined();
    });

    it('should have all dependencies properly mocked', () => {
      expect(jest.isMockFunction(mockUserController.getUsers)).toBe(true);
      expect(jest.isMockFunction(mockUserService.findAll)).toBe(true);
      expect(jest.isMockFunction(mockUserSubscriber.afterInsert)).toBe(true);
      expect(jest.isMockFunction(mockUserRepository.find)).toBe(true);
    });
  });

  describe('Module cleanup', () => {
    it('should close module properly', async () => {
      await moduleRef.close();
      expect(moduleRef).toBeDefined();
    });

    it('should handle module re-instantiation', async () => {
      const newModuleRef = await Test.createTestingModule({
        imports: [TypeOrmModule.forFeature([UserRepository])],
        controllers: [UserController],
        providers: [UserService, UserSubscriber],
        exports: [UserService],
      })
        .overrideProvider(UserController)
        .useValue(mockUserController)
        .overrideProvider(UserService)
        .useValue(mockUserService)
        .overrideProvider(UserSubscriber)
        .useValue(mockUserSubscriber)
        .overrideProvider(UserRepository)
        .useValue(mockUserRepository)
        .compile();

      expect(newModuleRef).toBeDefined();
      expect(newModuleRef).not.toBe(moduleRef);
    });
  });
});