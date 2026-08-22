import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../services/auth.service';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: jest.Mocked<AuthService>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    localStrategy = moduleRef.get<LocalStrategy>(LocalStrategy);
    authService = moduleRef.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should be defined', () => {
      expect(localStrategy).toBeDefined();
    });

    it('should return the user when validation succeeds', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(
        localStrategy.validate('nonexistent@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'nonexistent@example.com',
        'wrongpassword',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException when validateUser returns undefined', async () => {
      authService.validateUser.mockResolvedValue(undefined);

      await expect(
        localStrategy.validate('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
    });

    it('should throw UnauthorizedException when validateUser returns empty object', async () => {
      authService.validateUser.mockResolvedValue({} as any);

      await expect(
        localStrategy.validate('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
    });

    it('should propagate errors from authService.validateUser', async () => {
      const error = new Error('Database connection failed');
      authService.validateUser.mockRejectedValue(error);

      await expect(
        localStrategy.validate('test@example.com', 'password123'),
      ).rejects.toThrow(error);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
    });

    it('should handle empty email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('', '');

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith('', '');
    });

    it('should handle special characters in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(
        'user+tag@example.com',
        'p@ssw0rd!$#',
      );

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'user+tag@example.com',
        'p@ssw0rd!$#',
      );
    });

    it('should handle long email and password strings', async () => {
      const longEmail = 'a'.repeat(255) + '@example.com';
      const longPassword = 'b'.repeat(1000);
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(longEmail, longPassword);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(longEmail, longPassword);
    });

    it('should handle null email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(null as any, null as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(null, null);
    });

    it('should handle undefined email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(undefined as any, undefined as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(undefined, undefined);
    });

    it('should handle numeric email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(123 as any, 456 as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(123, 456);
    });

    it('should handle boolean email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(true as any, false as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(true, false);
    });

    it('should handle object email and password', async () => {
      const emailObj = { email: 'test@example.com' };
      const passwordObj = { password: 'password123' };
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailObj as any, passwordObj as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(emailObj, passwordObj);
    });

    it('should handle array email and password', async () => {
      const emailArray = ['test@example.com'];
      const passwordArray = ['password123'];
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailArray as any, passwordArray as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(emailArray, passwordArray);
    });

    it('should handle symbol email and password', async () => {
      const emailSymbol = Symbol('email');
      const passwordSymbol = Symbol('password');
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailSymbol as any, passwordSymbol as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(emailSymbol, passwordSymbol);
    });

    it('should handle bigint email and password', async () => {
      const emailBigInt = BigInt(123);
      const passwordBigInt = BigInt(456);
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailBigInt as any, passwordBigInt as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(emailBigInt, passwordBigInt);
    });

    it('should handle function email and password', async () => {
      const emailFunc = () => 'test@example.com';
      const passwordFunc = () => 'password123';
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailFunc as any, passwordFunc as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(emailFunc, passwordFunc);
    });

    it('should handle multiple consecutive calls', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      await localStrategy.validate('test1@example.com', 'password1');
      await localStrategy.validate('test2@example.com', 'password2');
      await localStrategy.validate('test3@example.com', 'password3');

      expect(authService.validateUser).toHaveBeenCalledTimes(3);
      expect(authService.validateUser).toHaveBeenNthCalledWith(
        1,
        'test1@example.com',
        'password1',
      );
      expect(authService.validateUser).toHaveBeenNthCalledWith(
        2,
        'test2@example.com',
        'password2',
      );
      expect(authService.validateUser).toHaveBeenNthCalledWith(
        3,
        'test3@example.com',
        'password3',
      );
    });

    it('should handle different return types from validateUser', async () => {
      const userWithExtraFields = {
        ...mockUser,
        roles: ['admin'],
        createdAt: new Date(),
      };
      authService.validateUser.mockResolvedValue(userWithExtraFields);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(userWithExtraFields);
      expect(result).toHaveProperty('roles');
      expect(result).toHaveProperty('createdAt');
    });

    it('should handle validateUser returning a promise that resolves to a falsy value', async () => {
      authService.validateUser.mockResolvedValue(false as any);

      await expect(
        localStrategy.validate('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should handle validateUser returning 0', async () => {
      authService.validateUser.mockResolvedValue(0 as any);

      await expect(
        localStrategy.validate('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should handle validateUser returning empty string', async () => {
      authService.validateUser.mockResolvedValue('' as any);

      await expect(
        localStrategy.validate('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should handle validateUser returning NaN', async () => {
      authService.validateUser.mockResolvedValue(NaN as any);

      await expect(
        localStrategy.validate('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});