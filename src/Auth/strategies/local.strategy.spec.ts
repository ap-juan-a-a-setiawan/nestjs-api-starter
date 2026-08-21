import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../services/auth.service';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: { validateUser: jest.Mock };

  beforeEach(async () => {
    authService = {
      validateUser: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        { provide: AuthService, useValue: authService },
      ],
    }).compile();

    localStrategy = moduleRef.get<LocalStrategy>(LocalStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should call authService.validateUser with the provided email and password', async () => {
      const user = { id: 1, email: 'test@example.com' };
      authService.validateUser.mockResolvedValue(user);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(result).toBe(user);
    });

    it('should return the user when credentials are valid', async () => {
      const user = { id: 1, email: 'test@example.com' };
      authService.validateUser.mockResolvedValue(user);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException when authService returns null', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(
        localStrategy.validate('test@example.com', 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when authService returns undefined', async () => {
      authService.validateUser.mockResolvedValue(undefined);

      await expect(
        localStrategy.validate('test@example.com', 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should propagate errors thrown by authService.validateUser', async () => {
      const error = new Error('auth service failure');
      authService.validateUser.mockRejectedValue(error);

      await expect(
        localStrategy.validate('test@example.com', 'password'),
      ).rejects.toThrow('auth service failure');
    });
  });
});