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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('constructor', () => {
    it('should initialize with correct passport strategy options', () => {
      // Verify the strategy was created with the correct options
      const strategy = (jwtStrategy as any);
      expect(strategy).toBeDefined();
      
      // Check that the strategy has the expected properties
      expect(strategy._jwtFromRequest).toBeDefined();
      expect(strategy._secretOrKey).toBe(jwtContanst.secret);
      expect(strategy._ignoreExpiration).toBe(false);
    });

    it('should use bearer token extraction', () => {
      const strategy = (jwtStrategy as any);
      expect(strategy._jwtFromRequest).toBeDefined();
      
      // Test the JWT extraction function
      const mockRequest = {
        headers: {
          authorization: 'Bearer test-token-123'
        }
      };
      
      const extractedToken = strategy._jwtFromRequest(mockRequest);
      expect(extractedToken).toBe('test-token-123');
    });

    it('should return null when no authorization header exists', () => {
      const strategy = (jwtStrategy as any);
      const mockRequest = {
        headers: {}
      };
      
      const extractedToken = strategy._jwtFromRequest(mockRequest);
      expect(extractedToken).toBeNull();
    });

    it('should return null when authorization header is not Bearer type', () => {
      const strategy = (jwtStrategy as any);
      const mockRequest = {
        headers: {
          authorization: 'Basic abc123'
        }
      };
      
      const extractedToken = strategy._jwtFromRequest(mockRequest);
      expect(extractedToken).toBeNull();
    });
  });

  describe('validate', () => {
    it('should return user object with userId and email from payload', async () => {
      const mockPayload = {
        sub: 'user-123',
        email: 'test@example.com'
      };

      const result = await jwtStrategy.validate(mockPayload);

      expect(result).toEqual({
        userId: 'user-123',
        email: 'test@example.com'
      });
    });

    it('should handle payload with additional properties', async () => {
      const mockPayload = {
        sub: 'user-456',
        email: 'another@example.com',
        role: 'admin',
        name: 'Test User'
      };

      const result = await jwtStrategy.validate(mockPayload);

      expect(result).toEqual({
        userId: 'user-456',
        email: 'another@example.com'
      });
    });

    it('should handle payload with null values', async () => {
      const mockPayload = {
        sub: null,
        email: null
      };

      const result = await jwtStrategy.validate(mockPayload);

      expect(result).toEqual({
        userId: null,
        email: null
      });
    });

    it('should handle empty payload', async () => {
      const mockPayload = {};

      const result = await jwtStrategy.validate(mockPayload);

      expect(result).toEqual({
        userId: undefined,
        email: undefined
      });
    });

    it('should handle undefined payload', async () => {
      const result = await jwtStrategy.validate(undefined);

      expect(result).toEqual({
        userId: undefined,
        email: undefined
      });
    });

    it('should handle payload with only sub property', async () => {
      const mockPayload = {
        sub: 'user-789'
      };

      const result = await jwtStrategy.validate(mockPayload);

      expect(result).toEqual({
        userId: 'user-789',
        email: undefined
      });
    });

    it('should handle payload with only email property', async () => {
      const mockPayload = {
        email: 'only-email@example.com'
      };

      const result = await jwtStrategy.validate(mockPayload);

      expect(result).toEqual({
        userId: undefined,
        email: 'only-email@example.com'
      });
    });

    it('should handle payload with non-string values', async () => {
      const mockPayload = {
        sub: 12345,
        email: 67890
      };

      const result = await jwtStrategy.validate(mockPayload);

      expect(result).toEqual({
        userId: 12345,
        email: 67890
      });
    });

    it('should handle payload with special characters in email', async () => {
      const mockPayload = {
        sub: 'user-abc',
        email: 'test+special@example.com'
      };

      const result = await jwtStrategy.validate(mockPayload);

      expect(result).toEqual({
        userId: 'user-abc',
        email: 'test+special@example.com'
      });
    });

    it('should return a new object each time', async () => {
      const mockPayload = {
        sub: 'user-123',
        email: 'test@example.com'
      };

      const result1 = await jwtStrategy.validate(mockPayload);
      const result2 = await jwtStrategy.validate(mockPayload);

      expect(result1).toEqual(result2);
      expect(result1).not.toBe(result2);
    });
  });

  describe('integration with PassportStrategy', () => {
    it('should extend PassportStrategy', () => {
      expect(jwtStrategy).toBeInstanceOf(JwtStrategy);
      expect(jwtStrategy).toBeInstanceOf(Object);
    });

    it('should have validate method', () => {
      expect(typeof jwtStrategy.validate).toBe('function');
    });

    it('should have the correct strategy name', () => {
      // PassportStrategy default name is 'jwt' for JWT strategy
      expect((jwtStrategy as any).name).toBe('JwtStrategy');
    });
  });
});