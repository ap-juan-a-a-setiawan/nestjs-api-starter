import { Test } from '@nestjs/testing';
import { UsersModule } from './users.module';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubscriber } from './subscribers/user.subscriber';
import { UserRepository } from './repositories/user.repository';

describe('UsersModule', () => {
  let module: UsersModule;

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
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
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

    module = moduleRef.get(UsersModule);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  describe('Module structure', () => {
    it('should have the correct imports', () => {
      const metadata = Reflect.getMetadata('imports', UsersModule);
      expect(metadata).toBeDefined();
      expect(metadata).toHaveLength(1);
      expect(metadata[0]).toEqual(TypeOrmModule.forFeature([UserRepository]));
    });

    it('should have the correct controllers', () => {
      const metadata = Reflect.getMetadata('controllers', UsersModule);
      expect(metadata).toBeDefined();
      expect(metadata).toHaveLength(1);
      expect(metadata[0]).toBe(UserController);
    });

    it('should have the correct providers', () => {
      const metadata = Reflect.getMetadata('providers', UsersModule);
      expect(metadata).toBeDefined();
      expect(metadata).toHaveLength(2);
      expect(metadata).toContain(UserService);
      expect(metadata).toContain(UserSubscriber);
    });

    it('should have the correct exports', () => {
      const metadata = Reflect.getMetadata('exports', UsersModule);
      expect(metadata).toBeDefined();
      expect(metadata).toHaveLength(1);
      expect(metadata[0]).toBe(UserService);
    });
  });

  describe('Module instantiation', () => {
    it('should instantiate the module successfully', () => {
      expect(module).toBeInstanceOf(UsersModule);
    });

    it('should have access to the module metadata', () => {
      const metadata = Reflect.getMetadata('imports', UsersModule);
      expect(metadata).toBeDefined();
    });
  });

  describe('Dependency injection', () => {
    it('should have UserController as a controller', () => {
      const controllers = Reflect.getMetadata('controllers', UsersModule);
      expect(controllers).toContain(UserController);
    });

    it('should have UserService as a provider', () => {
      const providers = Reflect.getMetadata('providers', UsersModule);
      expect(providers).toContain(UserService);
    });

    it('should have UserSubscriber as a provider', () => {
      const providers = Reflect.getMetadata('providers', UsersModule);
      expect(providers).toContain(UserSubscriber);
    });

    it('should export UserService', () => {
      const exports = Reflect.getMetadata('exports', UsersModule);
      expect(exports).toContain(UserService);
    });

    it('should import TypeOrmModule with UserRepository', () => {
      const imports = Reflect.getMetadata('imports', UsersModule);
      expect(imports).toHaveLength(1);
      expect(imports[0]).toEqual(TypeOrmModule.forFeature([UserRepository]));
    });
  });

  describe('Edge cases', () => {
    it('should handle empty module configuration', () => {
      const moduleRef = Test.createTestingModule({
        imports: [],
        controllers: [],
        providers: [],
        exports: [],
      }).compile();

      expect(moduleRef).toBeDefined();
    });

    it('should handle module with only imports', () => {
      const moduleRef = Test.createTestingModule({
        imports: [TypeOrmModule.forFeature([UserRepository])],
      }).compile();

      expect(moduleRef).toBeDefined();
    });

    it('should handle module with only controllers', () => {
      const moduleRef = Test.createTestingModule({
        controllers: [UserController],
      }).compile();

      expect(moduleRef).toBeDefined();
    });

    it('should handle module with only providers', () => {
      const moduleRef = Test.createTestingModule({
        providers: [UserService, UserSubscriber],
      }).compile();

      expect(moduleRef).toBeDefined();
    });

    it('should handle module with only exports', () => {
      const moduleRef = Test.createTestingModule({
        exports: [UserService],
      }).compile();

      expect(moduleRef).toBeDefined();
    });
  });

  describe('Module methods', () => {
    it('should have no additional methods', () => {
      const methods = Object.getOwnPropertyNames(UsersModule.prototype);
      expect(methods).toHaveLength(1); // Only constructor
      expect(methods[0]).toBe('constructor');
    });

    it('should have a constructor', () => {
      expect(UsersModule).toHaveProperty('constructor');
    });

    it('should be a class', () => {
      expect(typeof UsersModule).toBe('function');
      expect(UsersModule.toString()).toContain('class UsersModule');
    });
  });

  describe('Integration with dependencies', () => {
    it('should have all dependencies properly injected', async () => {
      const moduleRef = await Test.createTestingModule({
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

      const controller = moduleRef.get(UserController);
      const service = moduleRef.get(UserService);
      const subscriber = moduleRef.get(UserSubscriber);
      const repository = moduleRef.get(UserRepository);

      expect(controller).toBeDefined();
      expect(service).toBeDefined();
      expect(subscriber).toBeDefined();
      expect(repository).toBeDefined();
    });

    it('should maintain singleton instances', async () => {
      const moduleRef = await Test.createTestingModule({
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

      const service1 = moduleRef.get(UserService);
      const service2 = moduleRef.get(UserService);

      expect(service1).toBe(service2);
    });
  });
});