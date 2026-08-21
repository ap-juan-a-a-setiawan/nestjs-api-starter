typescript
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { UserSubscriber } from './subscribers/user.subscriber';
import { UsersModule } from './users.module';

describe('UsersModule', () => {
  let moduleRef: TestingModule;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserSubscriber = {
    afterInsert: jest.fn(),
    beforeInsert: jest.fn(),
    afterUpdate: jest.fn(),
    beforeUpdate: jest.fn(),
    afterRemove: jest.fn(),
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideProvider(UserRepository)
      .useValue(mockUserRepository)
      .overrideProvider(UserSubscriber)
      .useValue(mockUserSubscriber)
      .compile();
  });

  afterAll(async () => {
    if (moduleRef) {
      await moduleRef.close();
    }
  });

  it('should compile and be defined', () => {
    expect(moduleRef).toBeDefined();
  });

  it('should provide UserController with mocked dependencies', () => {
    const controller = moduleRef.get(UserController, { strict: false });
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(UserController);
  });

  it('should provide and export the mocked UserService', () => {
    const service = moduleRef.get(UserService);
    expect(service).toBe(mockUserService);
  });

  it('should provide UserSubscriber mock internally', () => {
    const subscriber = moduleRef.get(UserSubscriber, { strict: false });
    expect(subscriber).toBe(mockUserSubscriber);
  });

  it('should provide UserRepository mock internally', () => {
    const repository = moduleRef.get(UserRepository, { strict: false });
    expect(repository).toBe(mockUserRepository);
  });

  it('should mock all UserService methods with jest.fn()', () => {
    Object.values(mockUserService).forEach((method) => {
      expect(jest.isMockFunction(method)).toBe(true);
    });
  });

  it('should mock all UserRepository methods with jest.fn()', () => {
    Object.values(mockUserRepository).forEach((method) => {
      expect(jest.isMockFunction(method)).toBe(true);
    });
  });

  it('should mock all UserSubscriber methods with jest.fn()', () => {
    Object.values(mockUserSubscriber).forEach((method) => {
      expect(jest.isMockFunction(method)).toBe(true);
    });
  });

  it('should have correct module metadata', () => {
    const imports = Reflect.getMetadata('imports', UsersModule);
    const controllers = Reflect.getMetadata('controllers', UsersModule);
    const providers = Reflect.getMetadata('providers', UsersModule);
    const exportsMetadata = Reflect.getMetadata('exports', UsersModule);

    expect(imports).toHaveLength(1);
    expect(imports[0]).toHaveProperty('module', TypeOrmModule);

    expect(controllers).toContain(UserController);
    expect(providers).toEqual(expect.arrayContaining([UserService, UserSubscriber]));
    expect(exportsMetadata).toContain(UserService);
  });

  it('should not export internal providers', () => {
    const exportsMetadata = Reflect.getMetadata('exports', UsersModule);

    expect(exportsMetadata).not.toContain(UserSubscriber);
    expect(exportsMetadata).not.toContain(UserRepository);
    expect(exportsMetadata).not.toContain(UserController);
  });
});