typescript
import { Test, TestingModule } from '@nestjs/testing';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../Users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtContanst } from './contants/jwt';

@Module({})
class MockUsersModule {}

@Module({})
class MockPassportModule {}

@Module({})
class MockJwtModule {}

describe('AuthModule', () => {
  let moduleRef: TestingModule;

  const mockAuthService = new Proxy({}, { get: () => jest.fn() });
  const mockLocalStrategy = new Proxy({}, { get: () => jest.fn() });
  const mockJwtStrategy = new Proxy({}, { get: () => jest.fn() });
  const mockJwtService = new Proxy({}, { get: () => jest.fn() });

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideModule(UsersModule, MockUsersModule)
      .overrideModule(PassportModule, MockPassportModule)
      .overrideModule(JwtModule, MockJwtModule)
      .overrideProvider(AuthService).useValue(mockAuthService)
      .overrideProvider(LocalStrategy).useValue(mockLocalStrategy)
      .overrideProvider(JwtStrategy).useValue(mockJwtStrategy)
      .overrideProvider(JwtService).useValue(mockJwtService)
      .compile();
  });

  it('should be defined', () => {
    expect(moduleRef).toBeDefined();
  });

  it('should be a global module', () => {
    expect(Reflect.getMetadata('isGlobal', AuthModule)).toBe(true);
  });

  it('should have AuthController as a controller', () => {
    const controllers = Reflect.getMetadata('controllers', AuthModule);
    expect(controllers).toContain(AuthController);
  });

  it('should import UsersModule, PassportModule, and JwtModule', () => {
    const imports = Reflect.getMetadata('imports', AuthModule);
    expect(imports).toContain(UsersModule);
    expect(imports).toContain(PassportModule);
    expect(imports.some((imp) => imp.module === JwtModule)).toBe(true);
  });

  it('should provide AuthService, LocalStrategy, and JwtStrategy', () => {
    const providers = Reflect.getMetadata('providers', AuthModule);
    expect(providers).toContain(AuthService);
    expect(providers).toContain(LocalStrategy);
    expect(providers).toContain(JwtStrategy);
  });

  it('should export AuthService', () => {
    const exports = Reflect.getMetadata('exports', AuthModule);
    expect(exports).toContain(AuthService);
  });

  it('should configure JwtModule with the correct options', () => {
    const imports = Reflect.getMetadata('imports', AuthModule);
    const jwtDynamicModule = imports.find((imp) => imp.module === JwtModule);
    expect(jwtDynamicModule).toBeDefined();

    const optionsProvider = jwtDynamicModule.providers.find(
      (provider) => provider.provide === 'JWT_MODULE_OPTIONS',
    );
    expect(optionsProvider.useValue).toEqual({
      secret: jwtContanst.secret,
      signOptions: {
        expiresIn: jwtContanst.expiresIn,
      },
    });
  });

  it('should provide the mocked AuthService', () => {
    expect(moduleRef.get(AuthService)).toBe(mockAuthService);
  });

  it('should provide the mocked LocalStrategy', () => {
    expect(moduleRef.get(LocalStrategy)).toBe(mockLocalStrategy);
  });

  it('should provide the mocked JwtStrategy', () => {
    expect(moduleRef.get(JwtStrategy)).toBe(mockJwtStrategy);
  });

  it('should provide the mocked JwtService', () => {
    expect(moduleRef.get(JwtService)).toBe(mockJwtService);
  });

  it('should instantiate AuthController', () => {
    expect(moduleRef.get(AuthController)).toBeDefined();
  });
});