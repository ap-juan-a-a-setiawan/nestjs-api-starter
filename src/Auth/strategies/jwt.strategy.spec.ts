typescript
import { Test } from '@nestjs/testing';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtContanst } from '../contants/jwt';
import { JwtStrategy } from './jwt.strategy';

jest.mock('@nestjs/passport', () => ({
  PassportStrategy: jest.fn().mockReturnValue(
    class MockStrategy {
      constructor(public options: any) {}
    }
  ),
}));

jest.mock('passport-jwt', () => ({
  Strategy: class MockJwtStrategy {},
  ExtractJwt: {
    fromAuthHeaderAsBearerToken: jest.fn().mockReturnValue('mockJwtFromRequest'),
  },
}));

jest.mock('../contants/jwt', () => ({
  jwtContanst: { secret: 'test-secret' },
}));

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = moduleRef.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('constructor', () => {
    it('should call PassportStrategy with the passport-jwt Strategy', () => {
      const mockPassportStrategy = PassportStrategy as jest.Mock;
      expect(mockPassportStrategy).toHaveBeenCalledWith(Strategy);
    });

    it('should call ExtractJwt.fromAuthHeaderAsBearerToken', () => {
      const mockFromAuthHeaderAsBearerToken =
        ExtractJwt.fromAuthHeaderAsBearerToken as jest.Mock;
      expect(mockFromAuthHeaderAsBearerToken).toHaveBeenCalled();
    });

    it('should pass the correct options to super', () => {
      expect((strategy as any).options).toEqual({
        jwtFromRequest: 'mockJwtFromRequest',
        ignoreExpiration: false,
        secretOrKey: 'test-secret',
      });
    });
  });

  describe('validate', () => {
    it('should return userId and email from payload', async () => {
      const payload = { sub: 1, email: 'user@example.com' };
      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: 1,
        email: 'user@example.com',
      });
    });

    it('should return undefined userId and email when payload has no sub/email', async () => {
      const payload = {};
      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: undefined,
        email: undefined,
      });
    });

    it('should return a new object and not mutate the payload', async () => {
      const payload = { sub: 2, email: 'two@example.com' };
      const result = await strategy.validate(payload);

      expect(result).not.toBe(payload);
      expect(payload).toEqual({ sub: 2, email: 'two@example.com' });
    });

    it('should reject when payload is null', async () => {
      await expect(strategy.validate(null as any)).rejects.toThrow();
    });

    it('should reject when payload is undefined', async () => {
      await expect(strategy.validate(undefined as any)).rejects.toThrow();
    });
  });
});