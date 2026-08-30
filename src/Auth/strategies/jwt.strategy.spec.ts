import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { jwtContanst } from '../contants/jwt';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('constructor', () => {
    it('should initialize with correct passport strategy options', () => {
      // Verify the strategy is properly configured
      expect(jwtStrategy).toBeInstanceOf(JwtStrategy);
      expect(jwtStrategy).toBeInstanceOf(PassportStrategy(Strategy));
      
      // Verify the strategy options
      const strategy = jwtStrategy as any;
      expect(strategy._jwtFromRequest).toBeDefined();
      expect(strategy._ignoreExpiration).toBe(false);
      expect(strategy._secretOrKey).toBe(jwtContanst.secret);
    });

    it('should use bearer token extraction', () => {
      const strategy = jwtStrategy as any;
      const extractor = strategy._jwtFromRequest;
      
      // Test the extractor with a bearer token
      const mockRequest = {
        headers: {
          authorization: 'Bearer test-token-123'
        }
      };
      
      expect(extractor(mockRequest)).toBe('test-token-123');
    });

    it('should return null when no bearer token is present', () => {
      const strategy = jwtStrategy as any;
      const extractor = strategy._jwtFromRequest;
      
      const mockRequest = {
        headers: {}
      };
      
      expect(extractor(mockRequest)).toBeNull();
    });

    it('should return null when authorization header is malformed', () => {
      const strategy = jwtStrategy as any;
      const extractor = strategy._jwtFromRequest;
      
      const mockRequest = {
        headers: {
          authorization: 'Basic credentials'
        }
      };
      
      expect(extractor(mockRequest)).toBeNull();
    });
  });

  describe('validate', () => {
    it('should return user object with userId and email from payload', async () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com'
      };

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({
        userId: 'user-123',
        email: 'test@example.com'
      });
    });

    it('should handle payload with additional properties', async () => {
      const payload = {
        sub: 'user-456',
        email: 'another@example.com',
        role: 'admin',
        name: 'Test User'
      };

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({
        userId: 'user-456',
        email: 'another@example.com'
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
        sub: 'user-789',
        email: 'test+special@example.com'
      };

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({
        userId: 'user-789',
        email: 'test+special@example.com'
      });
    });

    it('should return a new object each time', async () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com'
      };

      const result1 = await jwtStrategy.validate(payload);
      const result2 = await jwtStrategy.validate(payload);

      expect(result1).toEqual(result2);
      expect(result1).not.toBe(result2);
    });

    it('should not mutate the original payload', async () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        extra: 'data'
      };

      const originalPayload = { ...payload };
      await jwtStrategy.validate(payload);

      expect(payload).toEqual(originalPayload);
    });
  });

  describe('integration with PassportStrategy', () => {
    it('should have the correct strategy name', () => {
      expect(jwtStrategy.constructor.name).toBe('JwtStrategy');
    });

    it('should be properly registered as a passport strategy', () => {
      // Verify the strategy has the required passport methods
      expect(typeof jwtStrategy.validate).toBe('function');
      expect(typeof jwtStrategy.authenticate).toBe('function');
      expect(typeof jwtStrategy.success).toBe('function');
      expect(typeof jwtStrategy.fail).toBe('function');
      expect(typeof jwtStrategy.redirect).toBe('function');
      expect(typeof jwtStrategy.pass).toBe('function');
      expect(typeof jwtStrategy.error).toBe('function');
    });

    it('should have the correct secret key configured', () => {
      const strategy = jwtStrategy as any;
      expect(strategy._secretOrKey).toBe(jwtContanst.secret);
    });

    it('should have ignoreExpiration set to false', () => {
      const strategy = jwtStrategy as any;
      expect(strategy._ignoreExpiration).toBe(false);
    });
  });
});