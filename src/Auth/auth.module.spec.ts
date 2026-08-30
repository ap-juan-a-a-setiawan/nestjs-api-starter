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

describe('AuthModule', () => {
  let moduleRef: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    
    moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(moduleRef).toBeDefined();
  });

  it('should have AuthController as controller', () => {
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

  it('should be marked as @Global', () => {
    const isGlobal = Reflect.getMetadata('__global__', AuthModule);
    expect(isGlobal).toBe(true);
  });

  it('should register JwtModule with correct configuration', () => {
    const imports = Reflect.getMetadata('imports', AuthModule);
    const jwtModule = imports[2];
    
    expect(jwtModule).toBeDefined();
    expect(JwtModule.register).toHaveBeenCalledWith({
      secret: jwtContanst.secret,
      signOptions: {
        expiresIn: jwtContanst.expiresIn,
      },
    });
  });

  it('should have JwtModule.register called with correct secret', () => {
    const mockRegister = JwtModule.register as jest.Mock;
    const config = mockRegister.mock.calls[0][0];
    
    expect(config.secret).toBe(jwtContanst.secret);
    expect(config.signOptions.expiresIn).toBe(jwtContanst.expiresIn);
  });

  it('should have all required dependencies', () => {
    const providers = Reflect.getMetadata('providers', AuthModule);
    const controllers = Reflect.getMetadata('controllers', AuthModule);
    const exports = Reflect.getMetadata('exports', AuthModule);
    const imports = Reflect.getMetadata('imports', AuthModule);

    expect(providers).toContain(AuthService);
    expect(providers).toContain(LocalStrategy);
    expect(providers).toContain(JwtStrategy);
    expect(controllers).toContain(AuthController);
    expect(exports).toContain(AuthService);
    expect(imports).toContain(UsersModule);
    expect(imports).toContain(PassportModule);
  });

  it('should not have any unexpected providers', () => {
    const providers = Reflect.getMetadata('providers', AuthModule);
    expect(providers).toHaveLength(3);
  });

  it('should not have any unexpected controllers', () => {
    const controllers = Reflect.getMetadata('controllers', AuthModule);
    expect(controllers).toHaveLength(1);
  });

  it('should not have any unexpected exports', () => {
    const exports = Reflect.getMetadata('exports', AuthModule);
    expect(exports).toHaveLength(1);
  });

  it('should not have any unexpected imports', () => {
    const imports = Reflect.getMetadata('imports', AuthModule);
    expect(imports).toHaveLength(3);
  });

  it('should have JwtModule with register method', () => {
    const imports = Reflect.getMetadata('imports', AuthModule);
    const jwtModule = imports[2];
    
    expect(jwtModule).toBeDefined();
    expect(typeof jwtModule).toBe('object');
  });

  it('should have PassportModule imported', () => {
    const imports = Reflect.getMetadata('imports', AuthModule);
    expect(imports).toContain(PassportModule);
  });

  it('should have UsersModule imported', () => {
    const imports = Reflect.getMetadata('imports', AuthModule);
    expect(imports).toContain(UsersModule);
  });

  it('should have AuthService exported', () => {
    const exports = Reflect.getMetadata('exports', AuthModule);
    expect(exports).toContain(AuthService);
  });

  it('should have LocalStrategy as provider', () => {
    const providers = Reflect.getMetadata('providers', AuthModule);
    expect(providers).toContain(LocalStrategy);
  });

  it('should have JwtStrategy as provider', () => {
    const providers = Reflect.getMetadata('providers', AuthModule);
    expect(providers).toContain(JwtStrategy));
  });

  it('should have AuthService as provider', () => {
    const providers = Reflect.getMetadata('providers', AuthModule);
    expect(providers).toContain(AuthService));
  });

  it('should have AuthController as controller', () => {
    const controllers = Reflect.getMetadata('controllers', AuthModule);
    expect(controllers).toContain(AuthController));
  });

  it('should have correct module metadata', () => {
    const metadata = Reflect.getMetadata('__module__', AuthModule);
    expect(metadata).toBeDefined();
  });

  it('should be instantiable', () => {
    const module = new AuthModule();
    expect(module).toBeDefined();
  });

 ​it('should have correct decorators', () => {
    const decorators = Reflect.getMetadata('__decorators__', AuthModule);
    expect(decorators).toBeDefined();
  });
});