import { Test } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../Users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtContanst } from './contants/jwt';

describe('AuthModule', () => {
  let module: any;

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

  const mockAuthController = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    module = await Test.createTestingModule({
      imports: [
        AuthModule,
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: jwtContanst.secret,
          signOptions: {
            expiresIn: jwtContanst.expiresIn,
          },
        }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: LocalStrategy,
          useValue: mockLocalStrategy,
        },
        {
          provide: JwtStrategy,
          useValue: mockJwtStrategy,
        },
      ],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideProvider(LocalStrategy)
      .useValue(mockLocalStrategy)
      .overrideProvider(JwtStrategy)
      .useValue(mockJwtStrategy)
      .overrideProvider(AuthController)
      .useValue(mockAuthController)
      .compile();
  });

  describe('Module Definition', () => {
    it('should be defined', () => {
      expect(module).toBeDefined();
    });

    it('should have AuthController', () => {
      const controller = module.get<AuthController>(AuthController);
      expect(controller).toBeDefined();
    });

    it('should have AuthService', () => {
      const service = module.get<AuthService>(AuthService);
      expect(service).toBeDefined();
    });

    it('should have LocalStrategy', () => {
      const strategy = module.get<LocalStrategy>(LocalStrategy);
      expect(strategy).toBeDefined();
    });

    it('should have JwtStrategy', () => {
      const strategy = module.get<JwtStrategy>(JwtStrategy);
      expect(strategy).toBeDefined();
    });
  });

  describe('AuthService', () => {
    it('should call validateUser method', async () => {
      const service = module.get<AuthService>(AuthService);
      const username = 'testuser';
      const password = 'testpass';

      mockAuthService.validateUser.mockResolvedValue({ id: 1, username });

      const result = await service.validateUser(username, password);

      expect(mockAuthService.validateUser).toHaveBeenCalledWith(username, password);
      expect(result).toEqual({ id: 1, username });
    });

    it('should call login method', async () => {
      const service = module.get<AuthService>(AuthService);
      const user = { id: 1, username: 'testuser' };

      mockAuthService.login.mockResolvedValue({ access_token: 'test-token' });

      const result = await service.login(user);

      expect(mockAuthService.login).toHaveBeenCalledWith(user);
      expect(result).toEqual({ access_token: 'test-token' });
    });

    it('should call register method', async () => {
      const service = module.get<AuthService>(AuthService);
      const userData = { username: 'newuser', password: 'newpass' };

      mockAuthService.register.mockResolvedValue({ id: 2, username: 'newuser' });

      const result = await service.register(userData);

      expect(mockAuthService.register).toHaveBeenCalledWith(userData);
      expect(result).toEqual({ id: 2, username: 'newuser' });
    });

    it('should handle validateUser error', async () => {
      const service = module.get<AuthService>(AuthService);
      const username = 'testuser';
      const password = 'wrongpass';

      mockAuthService.validateUser.mockRejectedValue(new Error('Invalid credentials'));

      await expect(service.validateUser(username, password)).rejects.toThrow('Invalid credentials');
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(username, password);
    });

    it('should handle login error', async () => {
      const service = module.get<AuthService>(AuthService);
      const user = { id: 1, username: 'testuser' };

      mockAuthService.login.mockRejectedValue(new Error('Login failed'));

      await expect(service.login(user)).rejects.toThrow('Login failed');
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
    });

    it('should handle register error', async () => {
      const service = module.get<AuthService>(AuthService);
      const userData = { username: 'newuser', password: 'newpass' };

      mockAuthService.register.mockRejectedValue(new Error('Registration failed'));

      await expect(service.register(userData)).rejects.toThrow('Registration failed');
      expect(mockAuthService.register).toHaveBeenCalledWith(userData);
    });
  });

  describe('LocalStrategy', () => {
    it('should call validate method', async () => {
      const strategy = module.get<LocalStrategy>(LocalStrategy);
      const username = 'testuser';
      const password = 'testpass';

      mockLocalStrategy.validate.mockResolvedValue({ id: 1, username });

      const result = await strategy.validate(username, password);

      expect(mockLocalStrategy.validate).toHaveBeenCalledWith(username, password);
      expect(result).toEqual({ id: 1, username });
    });

    it('should handle validate error', async () => {
      const strategy = module.get<LocalStrategy>(LocalStrategy);
      const username = 'testuser';
      const password = 'wrongpass';

      mockLocalStrategy.validate.mockRejectedValue(new Error('Unauthorized'));

      await expect(strategy.validate(username, password)).rejects.toThrow('Unauthorized');
      expect(mockLocalStrategy.validate).toHaveBeenCalledWith(username, password);
    });
  });

  describe('JwtStrategy', () => {
    it('should call validate method', async () => {
      const strategy = module.get<JwtStrategy>(JwtStrategy);
      const payload = { userId: 1, username: 'testuser' };

      mockJwtStrategy.validate.mockResolvedValue({ userId: 1, username: 'testuser' });

      const result = await strategy.validate(payload);

      expect(mockJwtStrategy.validate).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ userId: 1, username: 'testuser' });
    });

    it('should handle validate error', async () => {
      const strategy = module.get<JwtStrategy>(JwtStrategy);
      const payload = { userId: 1, username: 'testuser' };

      mockJwtStrategy.validate.mockRejectedValue(new Error('Invalid token'));

      await expect(strategy.validate(payload)).rejects.toThrow('Invalid token');
      expect(mockJwtStrategy.validate).toHaveBeenCalledWith(payload);
    });
  });

  describe('AuthController', () => {
    it('should call login method', async () => {
      const controller = module.get<AuthController>(AuthController);
      const req = { user: { id: 1, username: 'testuser' } };

      mockAuthController.login.mockResolvedValue({ access_token: 'test-token' });

      const result = await controller.login(req);

      expect(mockAuthController.login).toHaveBeenCalledWith(req);
      expect(result).toEqual({ access_token: 'test-token' });
    });

    it('should call register method', async () => {
      const controller = module.get<AuthController>(AuthController);
      const userData = { username: 'newuser', password: 'newpass' };

      mockAuthController.register.mockResolvedValue({ id: 2, username: 'newuser' });

      const result = await controller.register(userData);

      expect(mockAuthController.register).toHaveBeenCalledWith(userData);
      expect(result).toEqual({ id: 2, username: 'newuser' });
    });

    it('should handle login error', async () => {
      const controller = module.get<AuthController>(AuthController);
      const req = { user: { id: 1, username: 'testuser' } };

      mockAuthController.login.mockRejectedValue(new Error('Login failed'));

      await expect(controller.login(req)).rejects.toThrow('Login failed');
      expect(mockAuthController.login).toHaveBeenCalledWith(req);
    });

    it('should handle register error', async () => {
      const controller = module.get<AuthController>(AuthController);
      const userData = { username: 'newuser', password: 'newpass' };

      mockAuthController.register.mockRejectedValue(new Error('Registration failed'));

      await expect(controller.register(userData)).rejects.toThrow('Registration failed');
      expect(mockAuthController.register).toHaveBeenCalledWith(userData);
    });
  });

  describe('Module Exports', () => {
    it('should export AuthService', () => {
      const exportedProviders = Reflect.getMetadata('exports', AuthModule);
      expect(exportedProviders).toContain(AuthService);
    });

    it('should be global module', () => {
      const isGlobal = Reflect.getMetadata('isGlobal', AuthModule);
      expect(isGlobal).toBe(true);
    });

    it('should have correct imports', () => {
      const imports = Reflect.getMetadata('imports', AuthModule);
      expect(imports).toContain(UsersModule);
      expect(imports).toContain(PassportModule);
      expect(imports).toContain(JwtModule);
    });

    it('should have correct providers', () => {
      const providers = Reflect.getMetadata('providers', AuthModule);
      expect(providers).toContain(AuthService);
      expect(providers).toContain(LocalStrategy);
      expect(providers).toContain(JwtStrategy);
    });

    it('should have correct controllers', () => {
      const controllers = Reflect.getMetadata('controllers', AuthModule);
      expect(controllers).toContain(AuthController);
    });
  });
});