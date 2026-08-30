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
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      authService.validateUser.mockResolvedValue(mockUser);

      // Act
      const result = await localStrategy.validate(email, password);

      // Assert
      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      const password = 'wrongpassword';
      authService.validateUser.mockResolvedValue(null);

      // Act & Assert
      await expect(localStrategy.validate(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException when validateUser returns undefined', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      authService.validateUser.mockResolvedValue(undefined);

      // Act & Assert
      await expect(localStrategy.validate(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException when validateUser returns empty object', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      authService.validateUser.mockResolvedValue({} as any);

      // Act & Assert
      await expect(localStrategy.validate(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException when validateUser returns false', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      authService.validateUser.mockResolvedValue(false as any);

      // Act & Assert
      await expect(localStrategy.validate(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from authService.validateUser', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      const error = new Error('Database connection failed');
      authService.validateUser.mockRejectedValue(error);

      // Act & Assert
      await expect(localStrategy.validate(email, password)).rejects.toThrow(
        error,
      );
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle empty email and password', async () => {
      // Arrange
      const email = '';
      const password = '';
      authService.validateUser.mockResolvedValue(mockUser);

      // Act
      const result = await localStrategy.validate(email, password);

      // Assert
      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle special characters in email and password', async () => {
      // Arrange
      const email = 'user+tag@example.com';
      const password = 'p@ssw0rd!$#';
      authService.validateUser.mockResolvedValue(mockUser);

      // Act
      const result = await localStrategy.validate(email, password);

      // Assert
      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle very long email and password', async () => {
      // Arrange
      const email = 'a'.repeat(255) + '@example.com';
      const password = 'b'.repeat(1000);
      authService.validateUser.mockResolvedValue(mockUser);

      // Act
      const result = await localStrategy.validate(email, password);

      // Assert
      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle null email and password', async () => {
      // Arrange
      const email = null as any;
      const password = null as any;
      authService.validateUser.mockResolvedValue(mockUser);

      // Act
      const result = await localStrategy.validate(email, password);

      // Assert
      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle undefined email and password', async () => {
      // Arrange
      const email = undefined as any;
      const password = undefined as any;
      authService.validateUser.mockResolvedValue(mockUser);

      // Act
      const result = await localStrategy.validate(email, password);

      // Assert
      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle numeric email and password', async () => {
      // Arrange
      const email = 12345 as any;
      const password = 67890 as any;
      authService.validateUser.mockResolvedValue(mockUser);

      // Act
      const result = await localStrategy.validate(email, password);

      // Assert
      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle boolean email and password', async () => {
      // Arrange
      const email = true as any;
      const password = false as any;
      authService.validateUser.mockResolvedValue(mockUser);

      // Act
      const result = await localStrategy.validate(email, password);

      // Assert
      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle object email and password', async () => {
      // Arrange
      const email = { value: 'test@example.com' } as any;
      const password = { value: 'password' } as any;
      authService.validateUser.mockResolvedValue(mockUser);

      // Act
      const result = await localStrategy.validate(email, password);

      // Assert
      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle array email and password', async () => {
      // Arrange
      const email = ['test@example.com'] as any;
      const password = ['password'] as any;
      authService.validateUser.mockResolvedValue(mockUser);

      // Act
      const result = await localStrategy.validate(email, password);

      // Assert
      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle symbol email and password', async () => {
      // Arrange
      const email = Symbol('email') as any;
      const password = Symbol('password') as any;
      authService.validateUser.mockResolvedValue(mockUser);

      // Act
      const result = await localStrategy.validate(email, password);

      // Assert
      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle bigint email and password', async () => {
      // Arrange
      const email = BigInt(123456789) as any;
      const password = BigInt(987654321) as any;
      authService.validateUser.mockResolvedValue(mockUser);

      // Act
      const result = await localStrategy.validate(email, password);

      // Assert
      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle function email and password', async () => {
      // Arrange
      const email = () => 'test@example.com' as any;
      const password = () => 'password' as any;
      authService.validateUser.mockResolvedValue(mockUser);

      // Act
      const result = await localStrategy.validate(email, password);

      // Assert
      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple calls with different credentials', async () => {
      // Arrange
      const email1 = 'user1@example.com';
      const password1 = 'password1';
      const email2 = 'user2@example.com';
      const password2 = 'password2';
      const user1 = { id: 1, email: email1 };
      const user2 = { id: 2, email: email2 };
      authService.validateUser
        .mockResolvedValueOnce(user1)
        .mockResolvedValueOnce(user2);

      // Act
      const result1 = await localStrategy.validate(email1, password1);
      const result2 = await localStrategy.validate(email2, password2);

      // Assert
      expect(result1).toEqual(user1);
      expect(result2).toEqual(user2);
      expect(authService.validateUser).toHaveBeenCalledTimes(2);
      expect(authService.validateUser).toHaveBeenNthCalledWith(1, email1, password1);
      expect(authService.validateUser).toHaveBeenNthCalledWith(2, email2, password2);
    });

    it('should handle sequential calls with same credentials', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      authService.validateUser.mockResolvedValue(mockUser);

      // Act
      const result1 = await localStrategy.validate(email, password);
      const result2 = await localStrategy.validate(email, password);

      // Assert
      expect(result1).toEqual(mockUser);
      expect(result2).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledTimes(2);
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
    });

    it('should handle concurrent calls', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      authService.validateUser.mockResolvedValue(mockUser);

      // Act
      const results = await Promise.all([
        localStrategy.validate(email, password),
        localStrategy.validate(email, password),
        localStrategy.validate(email, password),
      ]);

      // Assert
      expect(results).toEqual([mockUser, mockUser, mockUser]);
      expect(authService.validateUser).toHaveBeenCalledTimes(3);
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
    });
  });
});