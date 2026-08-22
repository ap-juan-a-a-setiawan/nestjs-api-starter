import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../services/auth.service';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
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

    strategy = moduleRef.get<LocalStrategy>(LocalStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should be an instance of passport-local Strategy', () => {
    expect(strategy).toBeInstanceOf(Strategy);
  });

  it('should be configured with usernameField email', () => {
    expect((strategy as any)._usernameField).toBe('email');
  });

  describe('validate', () => {
    const email = 'test@example.com';
    const password = 'password123';

    it('should call authService.validateUser with email and password', async () => {
      const user = { id: 1, email };
      authService.validateUser.mockResolvedValue(user);

      await strategy.validate(email, password);

      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
    });

    it('should return the user when authService.validateUser returns a user', async () => {
      const user = { id: 1, email };
      authService.validateUser.mockResolvedValue(user);

      const result = await strategy.validate(email, password);

      expect(result).toBe(user);
    });

    it('should throw UnauthorizedException when authService.validateUser returns null', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(strategy.validate(email, password)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when authService.validateUser returns undefined', async () => {
      authService.validateUser.mockResolvedValue(undefined);

      await expect(strategy.validate(email, password)).rejects.toThrow(UnauthorizedException);
    });

    it('should propagate errors thrown by authService.validateUser', async () => {
      const error = new Error('validation error');
      authService.validateUser.mockRejectedValue(error);

      await expect(strategy.validate(email, password)).rejects.toThrow(error);
    });
  });
});