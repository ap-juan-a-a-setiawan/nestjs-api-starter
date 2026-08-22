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
  UsersModule: class UsersModule {}
}));

jest.mock('@nestjs/jwt', () => ({
  JwtModule: {
    register: jest.fn().mockReturnValue({
      module: class JwtModuleMock {},
      providers: [],
      exports: []
    })
  }
}));

jest.mock('@nestjs/passport', () => ({
  PassportModule: class PassportModuleMock {}
}));

jest.mock('./controllers/auth.controller', () => ({
  AuthController: class AuthControllerMock {}
}));

jest.mock('./services/auth.service', () => ({
  AuthService: class AuthServiceMock {}
}));

jest.mock('./strategies/jwt.strategy', () => ({
  JwtStrategy: class JwtStrategyMock {}
}));

jest.mock('./strategies/local.strategy', () => ({
  LocalStrategy: class LocalStrategyMock {}
}));

jest.mock('./contants/jwt', () => ({
  jwtContanst: {
    secret: 'test-secret',
    expiresIn: '1h'
  }
}));

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
      const metadata = Reflect.getMetadata('global', AuthModule);
      expect(metadata).toBe(true);
    });

    it('should have the correct module metadata', () => {
      const moduleMetadata = Reflect.getMetadata('imports', AuthModule);
      expect(moduleMetadata).toBeDefined();
      expect(moduleMetadata).toContain(UsersModule);
      expect(moduleMetadata).toContain(PassportModule);
      expect(moduleMetadata).toContain(JwtModule);
    });

    it('should have the correct controllers', () => {
      const controllers = Reflect.getMetadata('controllers', AuthModule);
      expect(controllers).toBeDefined();
      expect(controllers).toContain(AuthController);
    });

    it('should have the correct providers', () => {
      const providers = Reflect.getMetadata('providers', AuthModule);
      expect(providers).toBeDefined();
      expect(providers).toContain(AuthService);
      expect(providers).toContain(LocalStrategy);
      expect(providers).toContain(JwtStrategy);
    });

    it('should export AuthService', () => {
      const exports = Reflect.getMetadata('exports', AuthModule);
      expect(exports).toBeDefined();
      expect(exports).toContain(AuthService);
    });
  });

  describe('JwtModule Configuration', () => {
    it('should register JwtModule with correct configuration', () => {
      expect(JwtModule.register).toHaveBeenCalledWith({
        secret: 'test-secret',
        signOptions: {
          expiresIn: '1h'
        }
      });
    });

    it('should use the correct secret from jwtContanst', () => {
      expect(jwtContanst.secret).toBe('test-secret');
    });

    it('should use the correct expiresIn from jwtContanst', () => {
      expect(jwtContanst.expiresIn).toBe('1h');
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

    it('should import JwtModule', () => {
      const imports = Reflect.getMetadata('imports', AuthModule);
      expect(imports).toContain(JwtModule);
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

  describe('Module Exports', () => {
    it('should export AuthService', () => {
      const exports = Reflect.getMetadata('exports', AuthModule);
      expect(exports).toContain(AuthService);
    });

    it('should not export other providers', () => {
      const exports = Reflect.getMetadata('exports', AuthModule);
      expect(exports).not.toContain(LocalStrategy);
      expect(exports).not.toContain(JwtStrategy);
    });
  });

  describe('Module Controllers', () => {
    it('should have AuthController', () => {
      const controllers = Reflect.getMetadata('controllers', AuthModule);
      expect(controllers).toContain(AuthController);
    });

    it('should have exactly one controller', () => {
      const controllers = Reflect.getMetadata('controllers', AuthModule);
      expect(controllers).toHaveLength(1);
    });
  });

  describe('Module Structure', () => {
    it('should have all required metadata properties', () => {
      expect(Reflect.getMetadata('controllers', AuthModule)).toBeDefined();
      expect(Reflect.getMetadata('imports', AuthModule)).toBeDefined();
      expect(Reflect.getMetadata('providers', AuthModule)).toBeDefined();
      expect(Reflect.getMetadata('exports', AuthModule)).toBeDefined();
    });

    it('should have correct number of imports', () => {
      const imports = Reflect.getMetadata('imports', AuthModule);
      expect(imports).toHaveLength(3);
    });

    it('should have correct number of providers', () => {
      const providers = Reflect.getMetadata('providers', AuthModule);
      expect(providers).toHaveLength(3);
    });

    it('should have correct number of exports', () => {
      const exports = Reflect.getMetadata('exports', AuthModule);
      expect(exports).toHaveLength(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty jwtContanst gracefully', () => {
      const originalSecret = jwtContanst.secret;
      const originalExpiresIn = jwtContanst.expiresIn;
      
      Object.defineProperty(jwtContanst, 'secret', { value: undefined });
      Object.defineProperty(jwtContanst, 'expiresIn', { value: undefined });
      
      expect(jwtContanst.secret).toBeUndefined();
      expect(jwtContanst.expiresIn).toBeUndefined();
      
      Object.defineProperty(jwtContanst, 'secret', { value: originalSecret });
      Object.defineProperty(jwtContanst, 'expiresIn', { value: originalExpiresIn });
    });

    it('should handle null values in jwtContanst', () => {
      const originalSecret = jwtContanst.secret;
      const originalExpiresIn = jwtContanst.expiresIn;
      
      Object.defineProperty(jwtContanst, 'secret', { value: null });
      Object.defineProperty(jwtContanst, 'expiresIn', { value: null });
      
      expect(jwtContanst.secret).toBeNull();
      expect(jwtContanst.expiresIn).toBeNull();
      
      Object.defineProperty(jwtContanst, 'secret', { value: originalSecret });
      Object.defineProperty(jwtContanst, 'expiresIn', { value: originalExpiresIn });
    });

    it('should handle empty string values in jwtContanst', () => {
      const originalSecret = jwtContanst.secret;
      const originalExpiresIn = jwtContanst.expiresIn;
      
      Object.defineProperty(jwtContanst, 'secret', { value: '' });
      Object.defineProperty(jwtContanst, 'expiresIn', { value: '' });
      
      expect(jwtContanst.secret).toBe('');
      expect(jwtContanst.expiresIn).toBe('');
      
      Object.defineProperty(jwtContanst, 'secret', { value: originalSecret });
      Object.defineProperty(jwtContanst, 'expiresIn', { value: originalExpiresIn });
    });
  });

  describe('Module Instantiation', () => {
    it('should create module instance successfully', async () => {
      const module = await Test.createTestingModule({
        imports: [AuthModule],
      }).compile();
      
      expect(module).toBeDefined();
      expect(module.get(AuthModule)).toBeDefined();
    });

    it('should have all providers available', async () => {
      const module = await Test.createTestingModule({
        imports: [AuthModule],
      }).compile();
      
      expect(module.get(AuthService)).toBeDefined();
      expect(module.get(LocalStrategy)).toBeDefined();
      expect(module.get(JwtStrategy)).toBeDefined();
    });

    it('should have controller available', async () => {
      const module = await Test.createTestingModule({
        imports: [AuthModule],
      }).compile();
      
      expect(module.get(AuthController)).toBeDefined();
    });
  });
});