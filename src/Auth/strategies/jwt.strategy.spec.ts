ts
import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { ExtractJwt } from 'passport-jwt';
import { JwtStrategy } from './jwt.strategy';

jest.mock('@nestjs/passport', () => ({
  PassportStrategy: jest.fn().mockImplementation((strategy: any) => {
    return class MockPassportStrategy {
      public options: any;
      constructor(options: any) {
        this.options = options;
      }
    };
  }),
}));

jest.mock('passport-jwt', () => ({
  ExtractJwt: {
    fromAuthHeaderAsBearerToken: jest.fn(() => jest.fn()),
  },
  Strategy: jest.fn(),
}));

jest.mock('../contants/jwt', () => ({
  jwtContanst: {
    secret: 'test-secret',
  },
}));

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    jwtStrategy = moduleRef.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should call super with correct options', () => {
    expect(ExtractJwt.fromAuthHeaderAsBearerToken).toHaveBeenCalled();

    const options = (jwtStrategy as any).options;
    expect(options.ignoreExpiration).toBe(false);
    expect(options.secretOrKey).toBe('test-secret');
    expect(typeof options.jwtFromRequest).toBe('function');
  });

  describe('validate', () => {
    it('should return an object with userId and email from payload', async () => {
      const payload = { sub: 1, email: 'test@example.com' };

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({ userId: 1, email: 'test@example.com' });
    });

    it('should ignore extra payload properties', async () => {
      const payload = { sub: 1, email: 'test@example.com', extra: 'ignored' };

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({ userId: 1, email: 'test@example.com' });
    });

    it('should handle payload with undefined sub and email', async () => {
      const payload = { sub: undefined, email: undefined };

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({ userId: undefined, email: undefined });
    });

    it('should handle empty payload', async () => {
      const payload = {};

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({ userId: undefined, email: undefined });
    });

    it('should throw if payload is null', async () => {
      await expect(jwtStrategy.validate(null as any)).rejects.toThrow();
    });

    it('should throw if payload is undefined', async () => {
      await expect(jwtStrategy.validate(undefined as any)).rejects.toThrow();
    });
  });
});