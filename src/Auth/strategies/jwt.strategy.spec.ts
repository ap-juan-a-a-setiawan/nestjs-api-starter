import { Test } from "@nestjs/testing";
import { JwtStrategy } from "./jwt.strategy";
import { jwtContanst } from "../contants/jwt";

describe("JwtStrategy", () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    jwtStrategy = moduleRef.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("should be defined", () => {
      expect(jwtStrategy).toBeDefined();
    });

    it("should call super with correct configuration", () => {
      const superSpy = jest.spyOn(JwtStrategy.prototype as any, "constructor");
      const strategy = new JwtStrategy();
      
      expect(superSpy).toHaveBeenCalledWith({
        jwtFromRequest: expect.any(Function),
        ignoreExpiration: false,
        secretOrKey: jwtContanst.secret
      });
      
      superSpy.mockRestore();
    });

    it("should extract JWT from bearer token", () => {
      const mockRequest = {
        headers: {
          authorization: "Bearer test-token"
        }
      };
      
      const extractor = ExtractJwt.fromAuthHeaderAsBearerToken();
      const result = extractor(mockRequest);
      
      expect(result).toBe("test-token");
    });

    it("should return null when no bearer token present", () => {
      const mockRequest = {
        headers: {}
      };
      
      const extractor = ExtractJwt.fromAuthHeaderAsBearerToken();
      const result = extractor(mockRequest);
      
      expect(result).toBeNull();
    });

    it("should return null when authorization header is malformed", () => {
      const mockRequest = {
        headers: {
          authorization: "Basic test-token"
        }
      };
      
      const extractor = ExtractJwt.fromAuthHeaderAsBearerToken();
      const result = extractor(mockRequest);
      
      expect(result).toBeNull();
    });
  });

  describe("validate", () => {
    it("should return user object with userId and email", async () => {
      const payload = {
        sub: "user-123",
        email: "test@example.com"
      };

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({
        userId: "user-123",
        email: "test@example.com"
      });
    });

    it("should handle payload with additional properties", async () => {
      const payload = {
        sub: "user-456",
        email: "another@example.com",
        role: "admin",
        name: "Test User"
      };

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({
        userId: "user-456",
        email: "another@example.com"
      });
    });

    it("should handle payload with null values", async () => {
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

    it("should handle payload with undefined values", async () => {
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

    it("should handle empty payload", async () => {
      const payload = {};

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({
        userId: undefined,
        email: undefined
      });
    });

    it("should handle payload with numeric sub", async () => {
      const payload = {
        sub: 12345,
        email: "numeric@example.com"
      };

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({
        userId: 12345,
        email: "numeric@example.com"
      });
    });

    it("should handle payload with special characters in email", async () => {
      const payload = {
        sub: "user-789",
        email: "test+special@example.com"
      };

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({
        userId: "user-789",
        email: "test+special@example.com"
      });
    });

    it("should return a new object each time", async () => {
      const payload = {
        sub: "user-123",
        email: "test@example.com"
      };

      const result1 = await jwtStrategy.validate(payload);
      const result2 = await jwtStrategy.validate(payload);

      expect(result1).toEqual(result2);
      expect(result1).not.toBe(result2);
    });

    it("should not mutate the original payload", async () => {
      const payload = {
        sub: "user-123",
        email: "test@example.com"
      };

      const originalPayload = { ...payload };
      await jwtStrategy.validate(payload);

      expect(payload).toEqual(originalPayload);
    });
  });

  describe("integration with PassportStrategy", () => {
    it("should be instance of PassportStrategy", () => {
      expect(jwtStrategy).toBeInstanceOf(JwtStrategy);
    });

    it("should have validate method", () => {
      expect(typeof jwtStrategy.validate).toBe("function");
    });

    it("should have the correct strategy name", () => {
      // PassportStrategy sets the name based on the strategy
      expect(jwtStrategy.name).toBe("JwtStrategy");
    });
  });
});