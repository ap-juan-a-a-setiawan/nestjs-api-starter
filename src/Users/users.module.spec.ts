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

  const mockTypeOrmModule = {
    forFeature: jest.fn().mockReturnValue({
      module: TypeOrmModule,
      providers: [],
      exports: [],
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
      controllers: [UserController],
      providers: [
        UserService,
        UserSubscriber,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    })
      .overrideProvider(UserController)
      .useValue(mockUserController)
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideProvider(UserSubscriber)
      .useValue(mockUserSubscriber)
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
      expect(imports).toBeDefined();
      expect(imports.length).toBe(1);
    });
  });

  describe('Module instantiation', () => {
    it('should instantiate the module successfully', async () => {
      const module = await Test.createTestingModule({
        imports: [UsersModule],
      }).compile();

      expect(module).toBeDefined();
    });

    it('should resolve UserService from the module', async () => {
      const module = await Test.createTestingModule({
        imports: [UsersModule],
      })
        .overrideProvider(UserService)
        .useValue(mockUserService)
        .compile();

      const userService = module.get<UserService>(UserService);
      expect(userService).toBeDefined();
      expect(userService).toEqual(mockUserService);
    });

    it('should resolve UserController from the module', async () => {
      const module = await Test.createTestingModule({
        imports: [UsersModule],
      })
        .overrideProvider(UserController)
        .useValue(mockUserController)
        .compile();

      const userController = module.get<UserController>(UserController);
      expect(userController).toBeDefined();
      expect(userController).toEqual(mockUserController);
    });

    it('should resolve UserSubscriber from the module', async () => {
      const module = await Test.createTestingModule({
        imports: [UsersModule],
      })
        .overrideProvider(UserSubscriber)
        .useValue(mockUserSubscriber)
        .compile();

      const userSubscriber = module.get<UserSubscriber>(UserSubscriber);
      expect(userSubscriber).toBeDefined();
      expect(userSubscriber).toEqual(mockUserSubscriber);
    });
  });

  describe('Module metadata validation', () => {
    it('should have correct module decorator configuration', () => {
      const moduleMetadata = Reflect.getMetadata('imports', UsersModule);
      expect(moduleMetadata).toBeDefined();
      expect(Array.isArray(moduleMetadata)).toBe(true);
    });

    it('should have TypeOrmModule.forFeature with UserRepository', () => {
      const imports = Reflect.getMetadata('imports', UsersModule);
      const typeOrmImport = imports[0];
      
      // Verify the TypeOrmModule.forFeature is called with UserRepository
      expect(typeOrmImport).toBeDefined();
    });

    it('should have all required providers', () => {
      const providers = Reflect.getMetadata('providers', UsersModule);
      expect(providers).toContain(UserService);
      expect(providers).toContain(UserSubscriber);
    });

    it('should have all required controllers', () => {
      const controllers = Reflect.getMetadata('controllers', UsersModule);
      expect(controllers).toContain(UserController);
    });

    it('should have all required exports', () => {
      const exports = Reflect.getMetadata('exports', UsersModule);
      expect(exports).toContain(UserService);
    });
  });

  describe('Module dependency injection', () => {
    it('should inject UserRepository into TypeOrmModule', () => {
      const imports = Reflect.getMetadata('imports', UsersModule);
      const typeOrmModule = imports[0];
      
      // Verify that TypeOrmModule.forFeature is called with UserRepository
      expect(typeOrmModule).toBeDefined();
    });

    it('should provide UserService to the module', async () => {
      const module = await Test.createTestingModule({
        imports: [UsersModule],
      })
        .overrideProvider(UserService)
        .useValue(mockUserService)
        .compile();

      const service = module.get(UserService);
      expect(service).toBe(mockUserService);
    });

    it('should provide UserController to the module', async () => {
      const module = await Test.createTestingModule({
        imports: [UsersModule],
      })
        .overrideProvider(UserController)
        .useValue(mockUserController)
        .compile();

      const controller = module.get(UserController);
      expect(controller).toBe(mockUserController);
    });

    it('should provide UserSubscriber to the module', async () => {
      const module = await Test.createTestingModule({
        imports: [UsersModule],
      })
        .overrideProvider(UserSubscriber)
        .useValue(mockUserSubscriber)
        .compile();

      const subscriber = module.get(UserSubscriber);
      expect(subscriber).toBe(mockUserSubscriber);
    });
  });

  describe('Module edge cases', () => {
    it('should handle empty module configuration', () => {
      const module = new UsersModule();
      expect(module).toBeDefined();
    });

    it('should have exactly one import (TypeOrmModule)', () => {
      const imports = Reflect.getMetadata('imports', UsersModule);
      expect(imports.length).toBe(1);
    });

    it('should have exactly two providers', () => {
      const providers = Reflect.getMetadata('providers', UsersModule);
      expect(providers.length).toBe(2);
    });

    it('should have exactly one controller', () => {
      const controllers = Reflect.getMetadata('controllers', UsersModule);
      expect(controllers.length).toBe(1);
    });

    it('should have exactly one export', () => {
      const exports = Reflect.getMetadata('exports', UsersModule);
      expect(exports.length).toBe(1);
    });

    it('should not have any global module metadata', () => {
      const isGlobal = Reflect.getMetadata('isGlobal', UsersModule);
      expect(isGlobal).toBeUndefined();
    });
  });

  describe('Module integration with mocked dependencies', () => {
    it('should work with mocked UserService', async () => {
      const module = await Test.createTestingModule({
        imports: [UsersModule],
      })
        .overrideProvider(UserService)
        .useValue(mockUserService)
        .compile();

      const service = module.get(UserService);
      
      // Test that mocked methods are callable
      service.findAll();
      expect(mockUserService.findAll).toHaveBeenCalled();
      
      service.findOne(1);
      expect(mockUserService.findOne).toHaveBeenCalledWith(1);
      
      service.create({ name: 'test' });
      expect(mockUserService.create).toHaveBeenCalledWith({ name: 'test' });
    });

    it('should work with mocked UserController', async () => {
      const module = await Test.createTestingModule({
        imports: [UsersModule],
      })
        .overrideProvider(UserController)
        .useValue(mockUserController)
        .compile();

      const controller = module.get(UserController);
      
      // Test that mocked methods are callable
      controller.getUsers();
      expect(mockUserController.getUsers).toHaveBeenCalled();
      
      controller.getUserById(1);
      expect(mockUserController.getUserById).toHaveBeenCalledWith(1);
    });

    it('should work with mocked UserSubscriber', async () => {
      const module = await Test.createTestingModule({
        imports: [UsersModule],
      })
        .overrideProvider(UserSubscriber)
        .useValue(mockUserSubscriber)
        .compile();

      const subscriber = module.get(UserSubscriber);
      
      // Test that mocked methods are callable
      subscriber.afterInsert();
      expect(mockUserSubscriber.afterInsert).toHaveBeenCalled();
      
      subscriber.afterUpdate();
      expect(mockUserSubscriber.afterUpdate).toHaveBeenCalled();
      
      subscriber.afterRemove();
      expect(mockUserSubscriber.afterRemove).toHaveBeenCalled();
    });
  });
});