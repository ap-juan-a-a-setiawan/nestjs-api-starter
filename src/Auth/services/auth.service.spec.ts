import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../Users/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { jwtContanst } from '../contants/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    validatePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            getByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      userService.getByEmail.mockResolvedValue(mockUser);
      mockUser.validatePassword.mockResolvedValue(true);

      const result = await service.validateUser(email, password);

      expect(userService.getByEmail).toHaveBeenCalledWith(email);
      expect(mockUser.validatePassword).toHaveBeenCalledWith(password);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      userService.getByEmail.mockResolvedValue(null);

      await expect(service.validateUser(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.validateUser(email, password)).rejects.toThrow(
        'These credentials do not match our records.',
      );

      expect(userService.getByEmail).toHaveBeenCalledWith(email);
      expect(mockUser.validatePassword).not.toHaveBeenCalled();
    });

    it('should return null when password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      userService.getByEmail.mockResolvedValue(mockUser);
      mockUser.validatePassword.mockResolvedValue(false);

      const result = await service.validateUser(email, password);

      expect(userService.getByEmail).toHaveBeenCalledWith(email);
      expect(mockUser.validatePassword).toHaveBeenCalledWith(password);
      expect(result).toBeNull();
    });

    it('should handle user without validatePassword method', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const userWithoutMethod = { id: 'user-456', email };

      userService.getByEmail.mockResolvedValue(userWithoutMethod);

      await expect(service.validateUser(email, password)).rejects.toThrow(
        TypeError,
      );
    });

    it('should propagate errors from userService.getByEmail', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const error = new Error('Database connection failed');

      userService.getByEmail.mockRejectedValue(error);

      await expect(service.validateUser(email, password)).rejects.toThrow(
        error,
      );
    });
  });

  describe('login', () => {
    it('should return access token and expiration time', async () => {
      const user = {
        id: 'user-123',
        email: 'test@example.com',
      };
      const mockToken = 'mock-jwt-token';
      const mockExpiresIn = '3600s';

      jwtService.sign.mockReturnValue(mockToken);
      Object.defineProperty(jwtContanst, 'expiresIn', {
        value: mockExpiresIn,
        writable: true,
      });

      const result = await service.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
      });
      expect(result).toEqual({
        accessToken: mockToken,
        expiresIn: mockExpiresIn,
      });
    });

    it('should handle user without email', async () => {
      const user = {
        id: 'user-123',
      };
      const mockToken = 'mock-jwt-token';

      jwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: undefined,
        sub: user.id,
      });
      expect(result.accessToken).toBe(mockToken);
    });

    it('should handle user without id', async () => {
      const user = {
        email: 'test@example.com',
      };
      const mockToken = 'mock-jwt-token';

      jwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: undefined,
      });
      expect(result.accessToken).toBe(mockToken);
    });

    it('should handle empty user object', async () => {
      const user = {};
      const mockToken = 'mock-jwt-token';

      jwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: undefined,
        sub: undefined,
      });
      expect(result.accessToken).toBe(mockToken);
    });

    it('should propagate errors from jwtService.sign', async () => {
      const user = {
        id: 'user-123',
        email: 'test@example.com',
      };
      const error = new Error('JWT signing failed');

      jwtService.sign.mockImplementation(() => {
        throw error;
      });

      await expect(service.login(user)).rejects.toThrow(error);
    });

    it('should return expiresIn from jwtContanst', async () => {
      const user = {
        id: 'user-123',
        email: 'test@example.com',
      };
      const mockToken = 'mock-jwt-token';
      const mockExpiresIn = '7200s';

      jwtService.sign.mockReturnValue(mockToken);
      Object.defineProperty(jwtContanst, 'expiresIn', {
        value: mockExpiresIn,
        writable: true,
      });

      const result = await service.login(user);

      expect(result.expiresIn).toBe(mockExpiresIn);
    });
  });
});