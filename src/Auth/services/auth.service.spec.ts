import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../Users/services/user.service';
import { AuthService } from './auth.service';
import { jwtContanst } from '../contants/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserService: { getByEmail: jest.Mock };
  let mockJwtService: { sign: jest.Mock };

  beforeEach(async () => {
    mockUserService = {
      getByEmail: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should throw UnauthorizedException when user is not found', async () => {
      mockUserService.getByEmail.mockResolvedValue(null);

      await expect(
        service.validateUser('test@test.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockUserService.getByEmail).toHaveBeenCalledWith('test@test.com');
    });

    it('should return null when password is invalid', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        validatePassword: jest.fn().mockResolvedValue(false),
      };

      mockUserService.getByEmail.mockResolvedValue(user);

      const result = await service.validateUser('test@test.com', 'wrong-password');

      expect(result).toBeNull();
      expect(user.validatePassword).toHaveBeenCalledWith('wrong-password');
    });

    it('should return the user when password is valid', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        validatePassword: jest.fn().mockResolvedValue(true),
      };

      mockUserService.getByEmail.mockResolvedValue(user);

      const result = await service.validateUser('test@test.com', 'correct-password');

      expect(result).toBe(user);
      expect(mockUserService.getByEmail).toHaveBeenCalledWith('test@test.com');
      expect(user.validatePassword).toHaveBeenCalledWith('correct-password');
    });
  });

  describe('login', () => {
    it('should return access token and expiration', async () => {
      const user = { id: 42, email: 'user@test.com' };
      mockJwtService.sign.mockReturnValue('signed-token');

      const result = await service.login(user);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
      });
      expect(result).toEqual({
        accessToken: 'signed-token',
        expiresIn: jwtContanst.expiresIn,
      });
    });
  });
});