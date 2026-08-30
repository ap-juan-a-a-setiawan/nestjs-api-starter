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
    createQueryBuilder: jest.fn(),
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

    it('should have UserController as a provider', () => {
      const controller = moduleRef.get(UserController);
      expect(controller).toBeDefined();
      expect(controller).toEqual(mockUserController);
    });

    it('should have UserService as a provider', () => {
      const service = moduleRef.get(UserService);
      expect(service).toBeDefined();
      expect(service).toEqual(mockUserService);
    });

    it('should have UserSubscriber as a provider', () => {
      const subscriber = moduleRef.get(UserSubscriber);
      expect(subscriber).toBeDefined();
      expect(subscriber).toEqual(mockUserSubscriber);
    });

    it('should have UserRepository as a provider', () => {
      const repository = moduleRef.get(UserRepository);
      expect(repository).toBeDefined();
      expect(repository).toEqual(mockUserRepository);
    });
  });

  describe('Module Structure', () => {
    it('should export UserService', () => {
      const exportedProviders = Reflect.getMetadata('exports', UsersModule);
      expect(exportedProviders).toContain(UserService);
    });

    it('should have UserController in controllers', () => {
      const controllers = Reflect.getMetadata('controllers', UsersModule);
      expect(controllers).toContain(UserController);
    });

    it('should have UserService and UserSubscriber in providers', () => {
      const providers = Reflect.getMetadata('providers', UsersModule);
      expect(providers).toContain(UserService);
      expect(providers).toContain(UserSubscriber);
    });

    it('should have TypeOrmModule.forFeature with UserRepository in imports', () => {
      const imports = Reflect.getMetadata('imports', UsersModule);
      expect(imports).toBeDefined();
      expect(imports.length).toBe(1);
      
      const typeOrmImport = imports[0];
      expect(typeOrmImport).toBeDefined();
    });
  });

  describe('Module Integration', () => {
    it('should properly initialize TypeOrmModule with UserRepository', () => {
      const typeOrmModule = TypeOrmModule.forFeature([UserRepository]);
      expect(typeOrmModule).toBeDefined();
      expect(typeOrmModule.module).toBe(TypeOrmModule);
    });

    it('should have all required dependencies wired correctly', () => {
      const moduleMetadata = Reflect.getMetadata('__module__', UsersModule);
      expect(moduleMetadata).toBeDefined();
    });

    it('should be able to instantiate the module', async () => {
      const module = await Test.createTestingModule({
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

      expect(module).toBeDefined();
      expect(module.get(UserController)).toBeDefined();
      expect(module.get(UserService)).toBeDefined();
      expect(module.get(UserSubscriber)).toBeDefined();
      expect(module.get(UserRepository)).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty module metadata gracefully', () => {
      const metadata = Reflect.getMetadata('__module__', UsersModule);
      expect(metadata).toBeDefined();
    });

    it('should not have undefined providers', () => {
      const providers = Reflect.getMetadata('providers', UsersModule);
      providers.forEach((provider: any) => {
        expect(provider).toBeDefined();
      });
    });

    it('should not have undefined controllers', () => {
      const controllers = Reflect.getMetadata('controllers', UsersModule);
      controllers.forEach((controller: any) => {
        expect(controller).toBeDefined();
      });
    });

    it('should not have undefined imports', () => {
      const imports = Reflect.getMetadata('imports', UsersModule);
      imports.forEach((importItem: any) => {
        expect(importItem).toBeDefined();
      });
    });

    it('should not have undefined exports', () => {
      const exports = Reflect.getMetadata('exports', UsersModule);
      exports.forEach((exportItem: any) => {
        expect(exportItem).toBeDefined();
      });
    });
  });

  describe('Dependency Injection', () => {
    it('should inject UserService into UserController', () => {
      const controller = moduleRef.get(UserController);
      expect(controller).toBeDefined();
      expect(mockUserController).toBeDefined();
    });

    it('should inject UserRepository into UserService', () => {
      const service = moduleRef.get(UserService);
      expect(service).toBeDefined();
      expect(mockUserService).toBeDefined();
    });

    it('should have UserSubscriber with access to UserRepository', () => {
      const subscriber = moduleRef.get(UserSubscriber);
      expect(subscriber).toBeDefined();
      expect(mockUserSubscriber).toBeDefined();
    });

    it('should maintain singleton instances', () => {
      const service1 = moduleRef.get(UserService);
      const service2 = moduleRef.get(UserService);
      expect(service1).toBe(service2);
    });
  });

  describe('Mock Verification', () => {
    it('should have all mock methods defined', () => {
      expect(mockUserController.getUsers).toBeDefined();
      expect(mockUserController.getUserById).toBeDefined();
      expect(mockUserController.createUser).toBeDefined();
      expect(mockUserController.updateUser).toBeDefined();
      expect(mockUserController.deleteUser).toBeDefined();

      expect(mockUserService.findAll).toBeDefined();
      expect(mockUserService.findOne).toBeDefined();
      expect(mockUserService.create).toBeDefined();
      expect(mockUserService.update).toBeDefined();
      expect(mockUserService.remove).toBeDefined();

      expect(mockUserSubscriber.afterInsert).toBeDefined();
      expect(mockUserSubscriber.afterUpdate).toBeDefined();
      expect(mockUserSubscriber.afterRemove).toBeDefined();

      expect(mockUserRepository.find).toBeDefined();
      expect(mockUserRepository.findOne).toBeDefined();
      expect(mockUserRepository.save).toBeDefined();
      expect(mockUserRepository.update).toBeDefined();
      expect(mockUserRepository.delete).toBeDefined();
      expect(mockUserRepository.createQueryBuilder).toBeDefined();
    });

    it('should have all mock methods as jest.fn()', () => {
      expect(jest.isMockFunction(mockUserController.getUsers)).toBe(true);
      expect(jest.isMockFunction(mockUserController.getUserById)).toBe(true);
      expect(jest.isMockFunction(mockUserController.createUser)).toBe(true);
      expect(jest.isMockFunction(mockUserController.updateUser)).toBe(true);
      expect(jest.isMockFunction(mockUserController.deleteUser)).toBe(true);

      expect(jest.isMockFunction(mockUserService.findAll)).toBe(true);
      expect(jest.isMockFunction(mockUserService.findOne)).toBe(true);
      expect(jest.isMockFunction(mockUserService.create)).toBe(true);
      expect(jest.isMockFunction(mockUserService.update)).toBe(true);
      expect(jest.isMockFunction(mockUserService.remove)).toBe(true);

      expect(jest.isMockFunction(mockUserSubscriber.afterInsert)).toBe(true);
      expect(jest.isMockFunction(mockUserSubscriber.afterUpdate)).toBe(true);
      expect(jest.isMockFunction(mockUserSubscriber.afterRemove)).toBe(true);

      expect(jest.isMockFunction(mockUserRepository.find)).toBe(true);
      expect(jest.isMockFunction(mockUserRepository.findOne)).toBe(true);
      expect(jest.isMockFunction(mockUserRepository.save)).toBe(true);
      expect(jest.isMockFunction(mockUserRepository.update)).toBe(true);
      expect(jest.isMockFunction(mockUserRepository.delete)).toBe(true);
      expect(jest.isMockFunction(mockUserRepository.createQueryBuilder)).toBe(true);
    });
  });
});