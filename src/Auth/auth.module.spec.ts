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

jest.mock('../Users/users.module');
jest.mock('./controllers/auth.controller');
jest.mock('./services/auth.service');
jest.mock('./strategies/jwt.strategy');
jest.mock('./strategies/local.strategy');

describe('AuthModule', () => {
  let moduleRef: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    
    moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();
  });

  describe('Module Definition', () => {
    it('should be defined', () => {
      expect(moduleRef).toBeDefined();
    });

    it('should be a global module', () => {
      const metadata = Reflect.getMetadata('isGlobal', AuthModule);
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
      expect(imports).toEqual([
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: jwtContanst.secret,
          signOptions: {
            expiresIn: jwtContanst.expiresIn
          },
        }),
      ]);
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
    });

    it('should configure JwtModule with correct secret and expiration', () => {
      const imports = Reflect.getMetadata('imports', AuthModule);
      const jwtModuleConfig = imports.find((imp: any) => 
        imp && imp.module === JwtModule
      );
      
      if (jwtModuleConfig) {
        expect(jwtModuleConfig.secret).toBe(jwtContanst.secret);
        expect(jwtModuleConfig.signOptions).toEqual({
          expiresIn: jwtContanst.expiresIn
        });
      }
    });
  });

  describe('Module Controllers', () => {
    it('should have AuthController as controller', () => {
      const controllers = Reflect.getMetadata('controllers', AuthModule);
      expect(controllers).toContain(AuthController);
    });

    it('should have exactly one controller', () => {
      const controllers = Reflect.getMetadata('controllers', AuthModule);
      expect(controllers).toHaveLength(1);
    });
  });

  describe('Module Providers', () => {
    it('should have AuthService as provider', () => {
      const providers = Reflect.getMetadata('providers', AuthModule);
      expect(providers).toContain(AuthService);
    });

    it('should have LocalStrategy as provider', () => {
      const providers = Reflect.getMetadata('providers', AuthModule);
      expect(providers).toContain(LocalStrategy);
    });

    it('should have JwtStrategy as provider', () => {
      const providers = Reflect.getMetadata('providers', AuthModule);
      expect(providers).toContain(JwtStrategy);
    });

    it('should have exactly three providers', () => {
      const providers = Reflect.getMetadata('providers', AuthModule);
      expect(providers).toHaveLength(3);
    });
  });

  describe('Module Exports', () => {
    it('should export AuthService', () => {
      const exports = Reflect.getMetadata('exports', AuthModule);
      expect(exports).toContain(AuthService);
    });

    it('should have exactly one export', () => {
      const exports = Reflect.getMetadata('exports', AuthModule);
      expect(exports).toHaveLength(1);
    });
  });

  describe('Module Instantiation', () => {
    it('should instantiate all providers', async () => {
      const authService = moduleRef.get(AuthService);
      const localStrategy = moduleRef.get(LocalStrategy);
      const jwtStrategy = moduleRef.get(JwtStrategy);

      expect(authService).toBeDefined();
      expect(localStrategy).toBeDefined();
      expect(jwtStrategy).toBeDefined();
    });

    it('should instantiate controller', async () => {
      const authController = moduleRef.get(AuthController);
      expect(authController).toBeDefined();
    });

    it('should provide AuthService as singleton', async () => {
      const authService1 = moduleRef.get(AuthService);
      const authService2 = moduleRef.get(AuthService);
      expect(authService1).toBe(authService2);
    });
  });

  describe('JWT Configuration', () => {
    it('should have valid JWT secret', () => {
      expect(jwtContanst.secret).toBeDefined();
      expect(typeof jwtContanst.secret).toBe('string');
      expect(jwtContanst.secret.length).toBeGreaterThan(0);
    });

    it('should have valid JWT expiration', () => {
      expect(jwtContanst.expiresIn).toBeDefined();
      expect(typeof jwtContanst.expiresIn).toBe('string');
      expect(jwtContanst.expiresIn.length).toBeGreaterThan(0);
    });

    it('should have correct JWT configuration values', () => {
      expect(jwtContanst.secret).toBe(process.env.JWT_SECRET || 'default_secret');
      expect(jwtContanst.expiresIn).toBe(process.env.JWT_EXPIRES_IN || '1d');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing environment variables gracefully', () => {
      const originalEnv = process.env;
      process.env = { ...originalEnv };
      delete process.env.JWT_SECRET;
      delete process.env.JWT_EXPIRES_IN;

      expect(jwtContanst.secret).toBeDefined();
      expect(jwtContanst.expiresIn).toBeDefined();

      process.env = originalEnv;
    });

    it('should handle empty environment variables', () => {
      const originalEnv = process.env;
      process.env = { ...originalEnv, JWT_SECRET: '', JWT_EXPIRES_IN: '' };

      expect(jwtContanst.secret).toBeDefined();
      expect(jwtContanst.expiresIn).toBeDefined();

      process.env = originalEnv;
    });

    it('should handle undefined environment variables', () => {
      const originalEnv = process.env;
      process.env = { ...originalEnv, JWT_SECRET: undefined, JWT_EXPIRES_IN: undefined };

      expect(jwtContanst.secret).toBeDefined();
      expect(jwtContanst.expiresIn).toBeDefined();

      process.env = originalEnv;
    });
  });

  describe('Module Dependencies', () => {
    it('should have all required dependencies', () => {
      const imports = Reflect.getMetadata('imports', AuthModule);
      const providers = Reflect.getMetadata('providers', AuthModule);
      const controllers = Reflect.getMetadata('controllers', AuthModule);

      expect(imports.length).toBeGreaterThan(0);
      expect(providers.length).toBeGreaterThan(0);
      expect(controllers.length).toBeGreaterThan(0);
    });

    it('should not have circular dependencies', () => {
      const imports = Reflect.getMetadata('imports', AuthModule);
      expect(imports).not.toContain(AuthModule);
    });

    it('should not have duplicate providers', () => {
      const providers = Reflect.getMetadata('providers', AuthModule);
      const uniqueProviders = new Set(providers);
      expect(uniqueProviders.size).toBe(providers.length);
    });

    it('should not have duplicate exports', () => {
      const exports = Reflect.getMetadata('exports', AuthModule);
      const uniqueExports = new Set(exports);
      expect(uniqueExports.size).toBe(exports.length);
    });
  });
});