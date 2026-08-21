import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../Users/users.module';

describe('AuthModule', () => {
  let moduleRef: TestingModule;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
  };

  const mockLocalStrategy = {
    validate: jest.fn(),
  };

  const mockJwtStrategy = {
    validate: jest.fn(),
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideModule(UsersModule).useModule({
        module: class MockUsersModule {},
      })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideProvider(LocalStrategy)
      .useValue(mockLocalStrategy)
      .overrideProvider(JwtStrategy)
      .useValue(mockJwtStrategy)
      .compile();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should compile the module', () => {
    expect(moduleRef).toBeDefined();
  });

  it('should be marked as @Global', () => {
    const isGlobal = Reflect.getMetadata('__globalModule', AuthModule);
    expect(isGlobal).toBe(true);
  });

  it('should declare AuthController as a controller', () => {
    const controllers = Reflect.getMetadata('controllers', AuthModule);
    expect(controllers).toContain(AuthController);
  });

  it('should import UsersModule', () => {
    const imports = Reflect.getMetadata('imports', AuthModule);
    expect(imports).toContain(UsersModule);
  });

  it('should import PassportModule', () => {
    const imports = Reflect.getMetadata('imports', AuthModule);
    expect(imports).toContain(PassportModule);
  });

  it('should import JwtModule via JwtModule.register()', () => {
    const imports = Reflect.getMetadata('imports', AuthModule);
    expect(imports).toContain(
      expect.objectContaining({
        module: JwtModule,
      }),
    );
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

  it('should use mocked AuthService', () => {
    expect(moduleRef.get(AuthService)).toEqual(mockAuthService);
  });

  it('should use mocked LocalStrategy', () => {
    expect(moduleRef.get(LocalStrategy)).toEqual(mockLocalStrategy);
  });

  it('should use mocked JwtStrategy', () => {
    expect(moduleRef.get(JwtStrategy)).toEqual(mockJwtStrategy);
  });

  it('should instantiate AuthController with mocked dependencies', () => {
    const controller = moduleRef.get(AuthController);
    expect(controller).toBeDefined();
  });

  it('should have AuthService methods defined as jest.fn()', () => {
    const authService = moduleRef.get(AuthService);
    expect(authService.validateUser).toBeDefined();
    expect(typeof authService.validateUser).toBe('function');
    expect(authService.login).toBeDefined();
    expect(typeof authService.login).toBe('function');
    expect(authService.register).toBeDefined();
    expect(typeof authService.register).toBe('function');
  });
});