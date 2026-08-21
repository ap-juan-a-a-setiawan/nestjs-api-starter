typescript
import { Test } from '@nestjs/testing';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtStrategy } from './jwt.strategy';

jest.mock('@nestjs/passport', () => {
  class MockStrategyBase {
    constructor(public readonly options: any) {
      (MockStrategyBase as any).lastOptions = options;
    }
  }
  return {
    PassportStrategy: jest.fn().mockImplementation(() => MockStrategyBase),
  };
});

jest.mock('passport-jwt', () => ({
  ExtractJwt: {
    fromAuthHeaderAsBearerToken: jest.fn(),
  },
  Strategy: jest.fn(),
}));

jest.mock('../contants/jwt', () => ({
  jwtContanst: { secret: 'test-secret' },
}));

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let mockStrategyBase: any;

  const mockPassportStrategy = PassportStrategy as jest.Mock;
  const mockFromAuthHeader = ExtractJwt.fromAuthHeaderAsBearerToken as jest.Mock;

  beforeAll(async () => {
    mockFromAuthHeader.mockReturnValue('jwt-from-header');

    const moduleRef = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = moduleRef.get(JwtStrategy);
    mockStrategyBase = mockPassportStrategy.mock.results[0].value;
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should call PassportStrategy with Strategy', () => {
    expect(mockPassportStrategy).toHaveBeenCalledWith(Strategy);
  });

  it('should configure the strategy with the correct options', () => {
    expect(mockStrategyBase.lastOptions).toEqual({
      jwtFromRequest: 'jwt-from-header',
      ignoreExpiration: false,
      secretOrKey: 'test-secret',
    });
  });

  describe('validate', () => {
    it('should return userId and email from payload', async () => {
      const result = await strategy.validate({
        sub: 123,
        email: 'test@example.com',
      });

      expect(result).toEqual({
        userId: 123,
        email: 'test@example.com',
      });
    });

    it('should return userId and undefined email when email is missing', async () => {
      const result = await strategy.validate({ sub: 123 });

      expect(result).toEqual({ userId: 123, email: undefined });
    });

    it('should handle an empty payload', async () => {
      const result = await strategy.validate({});

      expect(result).toEqual({ userId: undefined, email: undefined });
    });

    it('should reject when payload is null', async () => {
      await expect(strategy.validate(null as any)).rejects.toThrow(TypeError);
    });

    it('should reject when payload is undefined', async () => {
      await expect(strategy.validate(undefined as any)).rejects.toThrow(TypeError);
    });
  });
});