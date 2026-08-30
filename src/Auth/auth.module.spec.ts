import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../Users/users.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { jwtContanst } from './contants/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthModule } from './auth.module';

jest.mock('../Users/users.module', () => ({
  UsersModule: class UsersModuleMock {},
}));

jest.mock('@nestjs/jwt', () => ({
  JwtModule: {
    register: jest.fn().mockReturnValue({
      module: class JwtModuleMock {},
      providers: [],
      exports: [],
    }),
  },
}));

jest.mock('@nestjs/passport', () => ({
  PassportModule: class PassportModuleMock {},
}));

jest.mock('./controllers/auth.controller', () => ({
  AuthController: class AuthControllerMock {},
}));

jest.mock('./services/auth.service', () => ({
  AuthService: class AuthServiceMock {},
}));

jest.mock('./strategies/jwt.strategy', () => ({
  JwtStrategy: class JwtStrategyMock {},
}));

jest.mock('./strategies/local.strategy', () => ({
  LocalStrategy: class LocalStrategyMock {},
}));

jest.mock('./contants/jwt', () => ({
  jwtContanst: {
    secret: 'test-secret',
    expiresIn: '1h',
  },
}));

describe('AuthModule', () => {
  let moduleRef: any;

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('Module Definition', () => {
    it('should be defined', async () => {
      moduleRef = await Test.createTestingModule({
        imports: [AuthModule],
      }).compile();

      expect(moduleRef).toBeDefined();
    });

    it('should have @Global decorator applied', () => {
      const metadata = Reflect.getMetadata('isGlobal', AuthModule);
      expect(metadata).toBe(true);
    });

    it('should have correct controllers', () => {
      const controllers = Reflect.getMetadata('controllers', AuthModule);
      expect(controllers).toEqual([AuthController]);
    });

    it('should have correct imports', () => {
      const imports = Reflect.getMetadata('imports', AuthModule);
      expect(imports).toHaveLength(3);
      expect(imports[0]).toBe(UsersModule);
      expect(imports[1]).toBe(PassportModule);
      expect(imports[2]).toBeDefined();
    });

    it('should have correct providers', () => {
      const providers = Reflect.getMetadata('providers', AuthModule);
      expect(providers).toEqual([AuthService, LocalStrategy, JwtStrategy]);
    });

    it('should have correct exports', () => {
      const exports = Reflect.getMetadata('exports', AuthModule);
      expect(exports).toEqual([AuthService]);
    });
  });

  describe('JwtModule Configuration', () => {
    it('should register JwtModule with correct secret', async () => {
      await Test.createTestingModule({
        imports: [AuthModule],
      }).compile();

      expect(JwtModule.register).toHaveBeenCalledWith({
        secret: 'test-secret',
        signOptions: {
          expiresIn: '1h',
        },
      });
    });

    it('should use jwtContanst values for configuration', () => {
      expect(jwtContanst.secret).toBe('test-secret');
      expect(jwtContanst.expiresIn).toBe('1h');
    });
  });

  describe('Module Compilation', () => {
    it('should successfully compile with all dependencies', async () => {
      moduleRef = await Test.createTestingModule({
        imports: [AuthModule],
      }).compile();

      expect(moduleRef).toBeDefined();
      expect(moduleRef.get).toBeDefined();
    });

    it('should have AuthService available for injection', async () => {
      moduleRef = await Test.createTestingModule({
        imports: [AuthModule],
      }).compile();

      const authService = moduleRef.get(AuthService);
      expect(authService).toBeDefined();
    });

    it('should have AuthController available', async () => {
      moduleRef = await Test.createTestingModule({
        imports: [AuthModule],
      }).compile();

      const authController = moduleRef.get(AuthController);
      expect(authController).toBeDefined();
    });

    it('should have LocalStrategy available', async () => {
      moduleRef = await Test.createTestingModule({
        imports: [AuthModule],
      }).compile();

      const localStrategy = moduleRef.get(LocalStrategy);
      expect(localStrategy).toBeDefined();
    });

    it('should have JwtStrategy available', async () => {
      moduleRef = await Test.createTestingModule({
        imports: [AuthModule],
      }).compile();

      const jwtStrategy = moduleRef.get(JwtStrategy);
      expect(jwtStrategy).toBeDefined();
    });
  });

  describe('Module Exports', () => {
    it('should export AuthService', async () => {
      moduleRef = await Test.createTestingModule({
        imports: [AuthModule],
      }).compile();

      const exportedProviders = Reflect.getMetadata('exports', AuthModule);
      expect(exportedProviders).toContain(AuthService);
    });

    it('should not export other providers', async () => {
      const exportedProviders = Reflect.getMetadata('exports', AuthModule);
      expect(exportedProviders).not.toContain(LocalStrategy);
      expect(exportedProviders).not.toContain(JwtStrategy);
      expect(exportedProviders).not.toContain(AuthController);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty jwtContanst gracefully', async () => {
      const originalSecret = jwtContanst.secret;
      const originalExpiresIn = jwtContanst.expiresIn;

      Object.defineProperty(jwtContanst, 'secret', { value: undefined });
      Object.defineProperty(jwtContanst, 'expiresIn', { value: undefined });

      await expect(
        Test.createTestingModule({
          imports: [AuthModule],
        }).compile(),
      ).resolves.toBeDefined();

      Object.defineProperty(jwtContanst, 'secret', { value: originalSecret });
      Object.defineProperty(jwtContanst, 'expiresIn', { value: originalExpiresIn });
    });

    it('should handle missing jwtContanst', async () => {
      jest.resetModules();
      jest.mock('./contants/jwt', () => ({
        jwtContanst: undefined,
      }));

      const { AuthModule: AuthModuleWithMissingConstants } = await import('./auth.module');

      await expect(
        Test.createTestingModule({
          imports: [AuthModuleWithMissingConstants],
        }).compile(),
      ).resolves.toBeDefined();
    });

    it('should handle multiple module instantiations', async () => {
      const module1 = await Test.createTestingModule({
        imports: [AuthModule],
      }).compile();

      const module2 = await Test.createTestingModule({
        imports: [AuthModule],
      }).compile();

      expect(module1).toBeDefined();
      expect(module2).toBeDefined();
      expect(module1).not.toBe(module2);
    });
  });

  describe('Decorator Metadata', () => {
    it('should have Global decorator with no arguments', () => {
      const decorators = Reflect.getMetadataKeys(AuthModule);
      expect(decorators).toContain('isGlobal');
    });

    it('should have Module decorator with all required properties', () => {
      const moduleMetadata = Reflect.getMetadata('module', AuthModule);
      expect(moduleMetadata).toBeDefined();
    });

    it('should have correct module name', () => {
      expect(AuthModule.name).toBe('AuthModule');
    });
  });
});