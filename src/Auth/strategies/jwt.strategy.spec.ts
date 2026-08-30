import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { jwtContanst } from '../contants/jwt';

// Mock passport-jwt
jest.mock('passport-jwt', () => ({
  ExtractJwt: {
    fromAuthHeaderAsBearerToken: jest.fn().mockReturnValue('mock-extractor')
  },
  Strategy: jest.fn().mockImplementation((options) => {
    return {
      options,
      validate: jest.fn()
    };
  })
}));

// Mock @nestjs/passport
jest.mock('@nestjs/passport', () => ({
  PassportStrategy: jest.fn().mockImplementation((Strategy) => {
    return class MockPassportStrategy {
      constructor(options: any) {
        this.strategy = new Strategy(options);
      }
      strategy: any;
    };
  })
}));

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy]
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(jwtStrategy).toBeDefined();
    });

    it('should call super with correct options', () => {
      const mockStrategy = jest.requireMock('passport-jwt').Strategy;
      const mockExtractJwt = jest.requireMock('passport-jwt').ExtractJwt;
      
      expect(mockStrategy).toHaveBeenCalledWith({
        jwtFromRequest: mockExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: jwtContanst.secret
      });
    });

    it('should use the correct secret from constants', () => {
      const mockStrategy = jest.requireMock('passport-jwt').Strategy;
      const mockCall = mockStrategy.mock.calls[0][0];
      
      expect(mockCall.secretOrKey).toBe(jwtContanst.secret);
      expect(mockCall.ignoreExpiration).toBe(false);
    });

    it('should use bearer token extraction', () => {
      const mockExtractJwt = jest.requireMock('passport-jwt').ExtractJwt;
      const mockStrategy = jest.requireMock('passport-jwt').Strategy;
      const mockCall = mockStrategy.mock.calls[0][0];
      
      expect(mockExtractJwt.fromAuthHeaderAsBearerToken).toHaveBeenCalled();
      expect(mockCall.jwtFromRequest).toBe('mock-extractor');
    });
  });

  describe('validate', () => {
    it('should return user object with userId and email', async () => {
      const payload = {
        sub: '1234567890',
        email: 'test@example.com'
      };

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({
        userId: '1234567890',
        email: 'test@example.com'
      });
    });

    it('should handle payload with additional properties', async () => {
      const payload = {
        sub: 'user-123',
        email: 'user@example.com',
        name: 'John Doe',
        role: 'admin',
        iat: 1234567890,
        exp: 1234567890
      };

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({
        userId: 'user-123',
        email: 'user@example.com'
      });
    });

    it('should handle payload with null values', async () => {
      const payload = {
        sub: null,
        email: null
      };

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({
        userId: null,
        email: null
      });
    });

    it('should handle empty payload', async () => {
      const payload = {};

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({
        userId: undefined,
        email: undefined
      });
    });

    it('should handle payload with undefined values', async () => {
      const payload = {
        sub: undefined,
        email: undefined
      };

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({
        userId: undefined,
        email: undefined
      });
    });

    it('should handle payload with numeric sub', async () => {
      const payload = {
        sub: 12345,
        email: 'numeric@example.com'
      };

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({
        userId: 12345,
        email: 'numeric@example.com'
      });
    });

    it('should handle payload with special characters in email', async () => {
      const payload = {
        sub: 'user-123',
        email: 'user+tag@example.co.uk'
      };

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({
        userId: 'user-123',
        email: 'user+tag@example.co.uk'
      });
    });

    it('should return a new object each time', async () => {
      const payload = {
        sub: '123',
        email: 'test@example.com'
      };

      const result1 = await jwtStrategy.validate(payload);
      const result2 = await jwtStrategy.validate(payload);

      expect(result1).toEqual(result2);
      expect(result1).not.toBe(result2);
    });

    it('should not mutate the original payload', async () => {
      const payload = {
        sub: '123',
        email: 'test@example.com',
        extra: 'data'
      };

      const originalPayload = { ...payload };
      await jwtStrategy.validate(payload);

      expect(payload).toEqual(originalPayload);
    });
  });
});