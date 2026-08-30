import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../services/auth.service';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: jest.Mocked<AuthService>;

  const mockUser = {
    id: 1,
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

    it('should return user when credentials are valid', async () => {
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
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
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
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
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
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle empty email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('', '');

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith('', '');
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle special characters in email and password', async () => {
      const specialEmail = 'user+tag@example.com';
      const specialPassword = 'p@ssw0rd!$#';
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(specialEmail, specialPassword);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(
        specialEmail,
        specialPassword,
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle very long email and password', async () => {
      const longEmail = 'a'.repeat(255) + '@example.com';
      const longPassword = 'b'.repeat(1000);
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(longEmail, longPassword);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(
        longEmail,
        longPassword,
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle whitespace in email and password', async () => {
      const whitespaceEmail = '  test@example.com  ';
      const whitespacePassword = '  password123  ';
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(whitespaceEmail, whitespacePassword);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(
        whitespaceEmail,
        whitespacePassword,
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle null values for email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(null as any, null as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(null, null);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle undefined values for email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(undefined as any, undefined as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(undefined, undefined);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle numeric values for email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(123 as any, 456 as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(123, 456);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle boolean values for email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(true as any, false as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(true, false);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle object values for email and password', async () => {
      const emailObj = { email: 'test@example.com' };
      const passwordObj = { password: 'password123' };
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailObj as any, passwordObj as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(emailObj, passwordObj);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle array values for email and password', async () => {
      const emailArray = ['test@example.com'];
      const passwordArray = ['password123'];
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailArray as any, passwordArray as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(emailArray, passwordArray);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle symbol values for email and password', async () => {
      const emailSymbol = Symbol('email');
      const passwordSymbol = Symbol('password');
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailSymbol as any, passwordSymbol as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(emailSymbol, passwordSymbol);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle function values for email and password', async () => {
      const emailFn = () => 'test@example.com';
      const passwordFn = () => 'password123';
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailFn as any, passwordFn as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(emailFn, passwordFn);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple calls with different credentials', async () => {
      authService.validateUser
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null);

      const firstResult = await localStrategy.validate('user1@example.com', 'pass1');
      expect(firstResult).toEqual(mockUser);

      await expect(
        localStrategy.validate('user2@example.com', 'pass2'),
      ).rejects.toThrow(UnauthorizedException);

      expect(authService.validateUser).toHaveBeenCalledTimes(2);
      expect(authService.validateUser).toHaveBeenNthCalledWith(1, 'user1@example.com', 'pass1');
      expect(authService.validateUser).toHaveBeenNthCalledWith(2, 'user2@example.com', 'pass2');
    });

    it('should handle concurrent calls', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const results = await Promise.all([
        localStrategy.validate('user1@example.com', 'pass1'),
        localStrategy.validate('user2@example.com', 'pass2'),
        localStrategy.validate('user3@example.com', 'pass3'),
      ]);

      expect(results).toEqual([mockUser, mockUser, mockUser]);
      expect(authService.validateUser).toHaveBeenCalledTimes(3);
    });
  });
});