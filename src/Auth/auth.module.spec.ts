typescript
import { Test } from '@nestjs/testing';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../Users/users.module';
import { jwtContanst } from './contants/jwt';

@Module({})
class MockUsersModule {}

describe('AuthModule', () => {
  describe('module metadata', () => {
    it('should be defined', () => {
      expect(AuthModule).toBeDefined();
    });

    it('should be marked as @Global', () => {
      const isGlobal = Reflect.getMetadata('isGlobal', AuthModule);
      expect(isGlobal).toBe(true);
    });

    it('should list AuthController as a controller', () => {
      const controllers = Reflect.getMetadata('controllers', AuthModule);
      expect(controllers).toEqual([AuthController]);
    });

    it('should import UsersModule, PassportModule, and JwtModule', () => {
      const imports = Reflect.getMetadata('imports', AuthModule);
      expect(imports).toHaveLength(3);
      expect(imports[0]).toBe(UsersModule);
      expect(imports[1]).toBe(PassportModule);
      expect(imports[2]).toMatchObject({ module: JwtModule });
    });

    it('should register JwtModule with the correct options', () => {
      const imports = Reflect.getMetadata('imports', AuthModule);
      const jwtModule = imports[2] as any;
      const optionsProvider = jwtModule.providers.find(
        (provider: any) => provider.provide === 'JWT_MODULE_OPTIONS',
      );
      expect(optionsProvider).toBeDefined();
      expect(optionsProvider.useValue).toEqual({
        secret: jwtContanst.secret,
        signOptions: { expiresIn: jwtContanst.expiresIn },
      });
    });

    it('should have AuthService, LocalStrategy, and JwtStrategy as providers', () => {
      const providers = Reflect.getMetadata('providers', AuthModule);
      expect(providers).toEqual([AuthService, LocalStrategy, JwtStrategy]);
    });

    it('should export AuthService', () => {
      const exports = Reflect.getMetadata('exports', AuthModule);
      expect(exports).toEqual([AuthService]);
    });
  });

  describe('module initialization', () => {
    it('should compile with mocked dependencies', async () => {
      const mockAuthService = { login: jest.fn(), validateUser: jest.fn() };
      const mockLocalStrategy = { validate: jest.fn() };
      const mockJwtStrategy = { validate: jest.fn() };

      const moduleRef = await Test.createTestingModule({
        imports: [AuthModule],
      })
        .overrideModule(UsersModule)
        .useModule(MockUsersModule)
        .overrideProvider(AuthService)
        .useValue(mockAuthService)
        .overrideProvider(LocalStrategy)
        .useValue(mockLocalStrategy)
        .overrideProvider(JwtStrategy)
        .useValue(mockJwtStrategy)
        .compile();

      expect(moduleRef).toBeDefined();
      expect(moduleRef.get(AuthService)).toBe(mockAuthService);
      expect(moduleRef.get(LocalStrategy)).toBe(mockLocalStrategy);
      expect(moduleRef.get(JwtStrategy)).toBe(mockJwtStrategy);
      expect(moduleRef.get(AuthController)).toBeInstanceOf(AuthController);
    });
  });
});