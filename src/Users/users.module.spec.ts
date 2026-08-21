typescript
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users.module';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserSubscriber } from './subscribers/user.subscriber';
import { UserRepository } from './repositories/user.repository';

jest.mock('@nestjs/typeorm', () => {
  const actual = jest.requireActual('@nestjs/typeorm');
  return {
    ...actual,
    TypeOrmModule: {
      ...actual.TypeOrmModule,
      forFeature: jest.fn().mockReturnValue({
        module: actual.TypeOrmModule,
        providers: [],
        exports: [],
      }),
    },
  };
});

describe('UsersModule', () => {
  let moduleRef: TestingModule | undefined;

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
    beforeInsert: jest.fn(),
    beforeUpdate: jest.fn(),
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideProvider(UserSubscriber)
      .useValue(mockUserSubscriber)
      .compile();
  });

  afterAll(async () => {
    if (moduleRef) {
      await moduleRef.close();
    }
  });

  it('should be defined', () => {
    expect(UsersModule).toBeDefined();
  });

  it('should be instantiable', () => {
    const instance = new UsersModule();
    expect(instance).toBeInstanceOf(UsersModule);
  });

  it('should call TypeOrmModule.forFeature with UserRepository', () => {
    expect(TypeOrmModule.forFeature).toHaveBeenCalledWith([UserRepository]);
  });

  it('should have correct module metadata', () => {
    const imports = Reflect.getMetadata('imports', UsersModule);
    const controllers = Reflect.getMetadata('controllers', UsersModule);
    const providers = Reflect.getMetadata('providers', UsersModule);
    const exportsMetadata = Reflect.getMetadata('exports', UsersModule);

    expect(imports).toHaveLength(1);
    expect(controllers).toEqual([UserController]);
    expect(providers).toEqual([UserService, UserSubscriber]);
    expect(exportsMetadata).toEqual([UserService]);
  });

  it('should provide the mocked UserService', () => {
    expect(moduleRef?.get(UserService)).toBe(mockUserService);
  });

  it('should provide the mocked UserSubscriber', () => {
    expect(moduleRef?.get(UserSubscriber)).toBe(mockUserSubscriber);
  });

  it('should instantiate UserController', () => {
    const userController = moduleRef?.get(UserController);
    expect(userController).toBeDefined();
  });

  it('should mock provider dependencies using jest.fn()', () => {
    Object.values(mockUserService).forEach((fn) => {
      expect(jest.isMockFunction(fn)).toBe(true);
    });
    Object.values(mockUserSubscriber).forEach((fn) => {
      expect(jest.isMockFunction(fn)).toBe(true);
    });
  });
});