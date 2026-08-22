typescript
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersModule } from './users.module';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserSubscriber } from './subscribers/user.subscriber';
import { UserRepository } from './repositories/user.repository';

describe('UsersModule', () => {
  let moduleRef: any;

  const mockUserService = jest.fn();
  const mockUserSubscriber = jest.fn();
  const mockUserController = jest.fn();
  const mockUserRepository = jest.fn();

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideProvider(UserSubscriber)
      .useValue(mockUserSubscriber)
      .overrideProvider(UserController)
      .useValue(mockUserController)
      .overrideProvider(getRepositoryToken(UserRepository))
      .useValue(mockUserRepository)
      .compile();
  });

  it('should be defined', () => {
    expect(moduleRef).toBeDefined();
  });

  it('should have UserService as a provider', () => {
    expect(moduleRef.get(UserService)).toBe(mockUserService);
  });

  it('should have UserSubscriber as a provider', () => {
    expect(moduleRef.get(UserSubscriber)).toBe(mockUserSubscriber);
  });

  it('should have UserController as a controller', () => {
    expect(moduleRef.get(UserController)).toBe(mockUserController);
  });

  it('should have UserRepository as a provider', () => {
    expect(moduleRef.get(getRepositoryToken(UserRepository))).toBe(mockUserRepository);
  });

  it('should export UserService', () => {
    const exportsMetadata = Reflect.getMetadata('exports', UsersModule);
    expect(exportsMetadata).toContain(UserService);
  });

  it('should have correct controllers metadata', () => {
    const controllersMetadata = Reflect.getMetadata('controllers', UsersModule);
    expect(controllersMetadata).toContain(UserController);
  });

  it('should have correct providers metadata', () => {
    const providersMetadata = Reflect.getMetadata('providers', UsersModule);
    expect(providersMetadata).toContain(UserService);
    expect(providersMetadata).toContain(UserSubscriber);
  });

  it('should have correct imports metadata', () => {
    const importsMetadata = Reflect.getMetadata('imports', UsersModule);
    expect(importsMetadata).toHaveLength(1);
    expect(importsMetadata[0]).toBeDefined();
  });
});