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
      const metadata = Reflect.getMetadata('__global__', AuthModule);
      expect(metadata).toBe(true);
    });

    it('should have correct module metadata', () => {
      const controllers = Reflect.getMetadata('controllers', AuthModule);
      const providers = Reflect.getMetadata('providers', AuthModule);
      const imports = Reflect.getMetadata('imports', AuthModule);
      const exports = Reflect.getMetadata('exports', AuthModule);

      expect(controllers).toEqual([AuthController]);
      expect(providers).toEqual([AuthService, LocalStrategy, JwtStrategy]);
      expect(exports).toEqual([AuthService]);
      expect(imports).toHaveLength(3);
    });
  });

  describe('Module Imports', () => {
    it('should import UsersModule', () => {
      const imports = Reflect.getMetadata('imports', AuthModule);
      expect(imports).toContain(UsersModule);
    });

    it('should import PassportModule', () => {
      const imports = Reflect.getMetadata('imports', AuthModule);
      expect(imports).toContain(PassportModule);
    });

    it('should import JwtModule with correct configuration', () => {
      const imports = Reflect.getMetadata('imports', AuthModule);
      const jwtModule = imports.find((imp: any) => imp === JwtModule);
      expect(jwtModule).toBeDefined();
      expect(JwtModule.register).toHaveBeenCalledWith({
        secret: 'test-secret',
        signOptions: {
          expiresIn: '1h',
        },
      });
    });
  });

  describe('Module Providers', () => {
    it('should provide AuthService', () => {
      const providers = Reflect.getMetadata('providers', AuthModule);
      expect(providers).toContain(AuthService);
    });

    it('should provide LocalStrategy', () => {
      const providers = Reflect.getMetadata('providers', AuthModule);
      expect(providers).toContain(LocalStrategy);
    });

    it('should provide JwtStrategy', () => {
      const providers = Reflect.getMetadata('providers', AuthModule);
      expect(providers).toContain(JwtStrategy);
    });
  });

  describe('Module Controllers', () => {
    it('should have AuthController', () => {
      const controllers = Reflect.getMetadata('controllers', AuthModule);
      expect(controllers).toContain(AuthController);
    });
  });

  describe('Module Exports', () => {
    it('should export AuthService', () => {
      const exports = Reflect.getMetadata('exports', AuthModule);
      expect(exports).toContain(AuthService);
    });
  });

  describe('JwtModule Configuration', () => {
    it('should use correct secret from constants', () => {
      expect(jwtContanst.secret).toBe('test-secret');
    });

    it('should use correct expiresIn from constants', () => {
      expect(jwtContanst.expiresIn).toBe('1h');
    });

    it('should register JwtModule with secret and signOptions', () => {
      expect(JwtModule.register).toHaveBeenCalledWith({
        secret: 'test-secret',
        signOptions: {
          expiresIn: '1h',
        },
      });
    });
  });

  describe('Module Instantiation', () => {
    it('should successfully compile the module', async () => {
      const module = await Test.createTestingModule({
        imports: [AuthModule],
      }).compile();

      expect(module).toBeDefined();
      expect(module.get).toBeDefined();
    });

    it('should be able to get AuthService from module', async () => {
      const module = await Test.createTestingModule({
        imports: [AuthModule],
      }).compile();

      const authService = module.get(AuthService);
      expect(authService).toBeDefined();
    });

    it('should be able to get AuthController from module', async () => {
      const module = await Test.createTestingModule({
        imports: [AuthModule],
      }).compile();

      const authController = module.get(AuthController);
      expect(authController).toBeDefined();
    });

    it('should be able to get LocalStrategy from module', async () => {
      const module = await Test.createTestingModule({
        imports: [AuthModule],
      }).compile();

      const localStrategy = module.get(LocalStrategy);
      expect(localStrategy).toBeDefined();
    });

    it('should be able to get JwtStrategy from module', async () => {
      const module = await Test.createTestingModule({
        imports: [AuthModule],
      }).compile();

      const jwtStrategy = module.get(JwtStrategy);
      expect(jwtStrategy).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty providers array', () => {
      const providers = Reflect.getMetadata('providers', AuthModule);
      expect(providers.length).toBeGreaterThan(0);
    });

    it('should handle empty controllers array', () => {
      const controllers = Reflect.getMetadata('controllers', AuthModule);
      expect(controllers.length).toBeGreaterThan(0);
    });

    it('should handle empty exports array', () => {
      const exports = Reflect.getMetadata('exports', AuthModule);
      expect(exports.length).toBeGreaterThan(0);
    });

    it('should handle empty imports array', () => {
      const imports = Reflect.getMetadata('imports', AuthModule);
      expect(imports.length).toBeGreaterThan(0);
    });

    it('should have unique providers', () => {
      const providers = Reflect.getMetadata('providers', AuthModule);
      const uniqueProviders = new Set(providers);
      expect(uniqueProviders.size).toBe(providers.length);
    });

    it('should have unique exports', () => {
      const exports = Reflect.getMetadata('exports', AuthModule);
      const uniqueExports = new Set(exports);
      expect(uniqueExports.size).toBe(exports.length);
    });

    it('should have unique controllers', () => {
      const controllers = Reflect.getMetadata('controllers', AuthModule);
      const uniqueControllers = new Set(controllers);
      expect(uniqueControllers.size).toBe(controllers.length);
    });
  });

  describe('JwtModule Registration Details', () => {
    it('should call JwtModule.register with exact configuration', () => {
      const expectedConfig = {
        secret: 'test-secret',
        signOptions: {
          expiresIn: '1h',
        },
      };

      expect(JwtModule.register).toHaveBeenCalledWith(expectedConfig);
    });

    it('should not call JwtModule.register with incorrect configuration', () => {
      const incorrectConfig = {
        secret: 'wrong-secret',
        signOptions: {
          expiresIn: '2h',
        },
      };

      expect(JwtModule.register).not.toHaveBeenCalledWith(incorrectConfig);
    });
  });

  describe('Module Structure Validation', () => {
    it('should have correct number of imports', () => {
      const imports = Reflect.getMetadata('imports', AuthModule);
      expect(imports).toHaveLength(3);
    });

    it('should have correct number of providers', () => {
      const providers = Reflect.getMetadata('providers', AuthModule);
      expect(providers).toHaveLength(3);
    });

    it('should have correct number of controllers', () => {
      const controllers = Reflect.getMetadata('controllers', AuthModule);
      expect(controllers).toHaveLength(1);
    });

    it('should have correct number of exports', () => {
      const exports = Reflect.getMetadata('exports', AuthModule);
      expect(exports).toHaveLength(1);
    });
  });
});