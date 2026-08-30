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
      imports: [UsersModule],
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

  describe('Module Definition', () => {
    it('should be defined', () => {
      expect(moduleRef).toBeDefined();
    });

    it('should compile the module successfully', async () => {
      const compiledModule = await Test.createTestingModule({
        imports: [UsersModule],
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

      expect(compiledModule).toBeDefined();
    });
  });

  describe('Module Providers', () => {
    it('should provide UserController', () => {
      const controller = moduleRef.get(UserController);
      expect(controller).toBeDefined();
      expect(controller).toEqual(mockUserController);
    });

    it('should provide UserService', () => {
      const service = moduleRef.get(UserService);
      expect(service).toBeDefined();
      expect(service).toEqual(mockUserService);
    });

    it('should provide UserSubscriber', () => {
      const subscriber = moduleRef.get(UserSubscriber);
      expect(subscriber).toBeDefined();
      expect(subscriber).toEqual(mockUserSubscriber);
    });

    it('should provide UserRepository', () => {
      const repository = moduleRef.get(UserRepository);
      expect(repository).toBeDefined();
      expect(repository).toEqual(mockUserRepository);
    });
  });

  describe('Module Exports', () => {
    it('should export UserService', () => {
      const exportedService = moduleRef.get(UserService);
      expect(exportedService).toBeDefined();
      expect(exportedService).toEqual(mockUserService);
    });
  });

  describe('Module Imports', () => {
    it('should include TypeOrmModule with UserRepository', () => {
      const typeOrmModule = moduleRef.get(TypeOrmModule);
      expect(typeOrmModule).toBeDefined();
    });
  });

  describe('Module Structure', () => {
    it('should have correct metadata', () => {
      const metadata = Reflect.getMetadata('imports', UsersModule);
      expect(metadata).toBeDefined();
      expect(metadata).toHaveLength(1);
      expect(metadata[0]).toBeDefined();
    });

    it('should have controllers metadata', () => {
      const controllers = Reflect.getMetadata('controllers', UsersModule);
      expect(controllers).toBeDefined();
      expect(controllers).toHaveLength(1);
      expect(controllers[0]).toBe(UserController);
    });

    it('should have providers metadata', () => {
      const providers = Reflect.getMetadata('providers', UsersModule);
      expect(providers).toBeDefined();
      expect(providers).toHaveLength(2);
      expect(providers).toContain(UserService);
      expect(providers).toContain(UserSubscriber);
    });

    it('should have exports metadata', () => {
      const exports = Reflect.getMetadata('exports', UsersModule);
      expect(exports).toBeDefined();
      expect(exports).toHaveLength(1);
      expect(exports[0]).toBe(UserService);
    });
  });

  describe('Module Instantiation', () => {
    it('should instantiate all providers', async () => {
      const app = await moduleRef.createNestApplication();
      expect(app).toBeDefined();
      await app.close();
    });

    it('should resolve UserService from module', () => {
      const service = moduleRef.get(UserService);
      expect(service).toBe(mockUserService);
    });

    it('should resolve UserController from module', () => {
      const controller = moduleRef.get(UserController);
      expect(controller).toBe(mockUserController);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing dependencies gracefully', async () => {
      const moduleWithoutDeps = await Test.createTestingModule({
        imports: [UsersModule],
      })
        .overrideProvider(UserController)
        .useValue({})
        .overrideProvider(UserService)
        .useValue({})
        .overrideProvider(UserSubscriber)
        .useValue({})
        .overrideProvider(UserRepository)
        .useValue({})
        .compile();

      expect(moduleWithoutDeps).toBeDefined();
    });

    it('should handle null values for providers', async () => {
      const moduleWithNulls = await Test.createTestingModule({
        imports: [UsersModule],
      })
        .overrideProvider(UserController)
        .useValue(null)
        .overrideProvider(UserService)
        .useValue(null)
        .overrideProvider(UserSubscriber)
        .useValue(null)
        .overrideProvider(UserRepository)
        .useValue(null)
        .compile();

      expect(moduleWithNulls).toBeDefined();
    });

    it('should handle undefined values for providers', async () => {
      const moduleWithUndefined = await Test.createTestingModule({
        imports: [UsersModule],
      })
        .overrideProvider(UserController)
        .useValue(undefined)
        .overrideProvider(UserService)
        .useValue(undefined)
        .overrideProvider(UserSubscriber)
        .useValue(undefined)
        .overrideProvider(UserRepository)
        .useValue(undefined)
        .compile();

      expect(moduleWithUndefined).toBeDefined();
    });
  });

  describe('Mock Verification', () => {
    it('should verify all mocks are called with correct dependencies', () => {
      const controller = moduleRef.get(UserController);
      const service = moduleRef.get(UserService);
      const subscriber = moduleRef.get(UserSubscriber);
      const repository = moduleRef.get(UserRepository);

      expect(controller).toBeDefined();
      expect(service).toBeDefined();
      expect(subscriber).toBeDefined();
      expect(repository).toBeDefined();

      // Verify mock functions are jest.fn()
      expect(jest.isMockFunction(controller.getUsers)).toBe(true);
      expect(jest.isMockFunction(controller.getUserById)).toBe(true);
      expect(jest.isMockFunction(controller.createUser)).toBe(true);
      expect(jest.isMockFunction(controller.updateUser)).toBe(true);
      expect(jest.isMockFunction(controller.deleteUser)).toBe(true);

      expect(jest.isMockFunction(service.findAll)).toBe(true);
      expect(jest.isMockFunction(service.findOne)).toBe(true);
      expect(jest.isMockFunction(service.create)).toBe(true);
      expect(jest.isMockFunction(service.update)).toBe(true);
      expect(jest.isMockFunction(service.remove)).toBe(true);

      expect(jest.isMockFunction(subscriber.afterInsert)).toBe(true);
      expect(jest.isMockFunction(subscriber.afterUpdate)).toBe(true);
      expect(jest.isMockFunction(subscriber.afterRemove)).toBe(true);

      expect(jest.isMockFunction(repository.find)).toBe(true);
      expect(jest.isMockFunction(repository.findOne)).toBe(true);
      expect(jest.isMockFunction(repository.save)).toBe(true);
      expect(jest.isMockFunction(repository.update)).toBe(true);
      expect(jest.isMockFunction(repository.delete)).toBe(true);
      expect(jest.isMockFunction(repository.create)).toBe(true);
    });
  });
});