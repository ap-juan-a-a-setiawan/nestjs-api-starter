typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: { validateUser: jest.Mock };

  beforeEach(async () => {
    authService = {
      validateUser: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
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

  it('should be defined', () => {
    expect(localStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return the user when authService.validateUser returns a user', async () => {
      const mockUser = { id: 1, email: 'user@example.com' };
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('user@example.com', 'password');

      expect(authService.validateUser).toHaveBeenCalledWith(
        'user@example.com',
        'password',
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when authService.validateUser returns null', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(
        localStrategy.validate('user@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);

      expect(authService.validateUser).toHaveBeenCalledWith(
        'user@example.com',
        'password',
      );
    });

    it('should throw UnauthorizedException when authService.validateUser returns undefined', async () => {
      authService.validateUser.mockResolvedValue(undefined);

      await expect(
        localStrategy.validate('user@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);

      expect(authService.validateUser).toHaveBeenCalledWith(
        'user@example.com',
        'password',
      );
    });

    it('should propagate errors thrown by authService.validateUser', async () => {
      const error = new Error('service error');
      authService.validateUser.mockRejectedValue(error);

      await expect(
        localStrategy.validate('user@example.com', 'password'),
      ).rejects.toThrow(error);

      expect(authService.validateUser).toHaveBeenCalledWith(
        'user@example.com',
        'password',
      );
    });
  });
});