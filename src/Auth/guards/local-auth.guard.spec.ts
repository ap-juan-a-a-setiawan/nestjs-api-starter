import { Test } from "@nestjs/testing";
import { ExecutionContext } from "@nestjs/common";
import { LocalAuthGuard } from "./local-auth.guard";
import { AuthGuard } from "@nestjs/passport";

jest.mock("@nestjs/passport", () => ({
  AuthGuard: jest.fn().mockImplementation((strategy: string) => {
    return class MockAuthGuard {
      constructor() {
        expect(strategy).toBe("local");
      }
      canActivate = jest.fn();
    };
  }),
}));

describe("LocalAuthGuard", () => {
  let guard: LocalAuthGuard;
  let mockAuthGuardInstance: any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [LocalAuthGuard],
    }).compile();

    guard = moduleRef.get<LocalAuthGuard>(LocalAuthGuard);
    mockAuthGuardInstance = (guard as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  it("should extend AuthGuard with 'local' strategy", () => {
    expect(AuthGuard).toHaveBeenCalledWith("local");
  });

  describe("canActivate", () => {
    it("should call the parent canActivate method", async () => {
      const mockContext = {} as ExecutionContext;
      const mockCanActivate = jest.fn().mockReturnValue(true);
      
      // Get the prototype to access the inherited canActivate
      const prototype = Object.getPrototypeOf(guard);
      prototype.canActivate = mockCanActivate;

      const result = await guard.canActivate(mockContext);

      expect(mockCanActivate).toHaveBeenCalledWith(mockContext);
      expect(result).toBe(true);
    });

    it("should return false when parent canActivate returns false", async () => {
      const mockContext = {} as ExecutionContext;
      const mockCanActivate = jest.fn().mockReturnValue(false);
      
      const prototype = Object.getPrototypeOf(guard);
      prototype.canActivate = mockCanActivate;

      const result = await guard.canActivate(mockContext);

      expect(mockCanActivate).toHaveBeenCalledWith(mockContext);
      expect(result).toBe(false);
    });

    it("should propagate errors from parent canActivate", async () => {
      const mockContext = {} as ExecutionContext;
      const error = new Error("Authentication failed");
      const mockCanActivate = jest.fn().mockRejectedValue(error);
      
      const prototype = Object.getPrototypeOf(guard);
      prototype.canActivate = mockCanActivate;

      await expect(guard.canActivate(mockContext)).rejects.toThrow(error);
      expect(mockCanActivate).toHaveBeenCalledWith(mockContext);
    });

    it("should handle undefined context", async () => {
      const mockCanActivate = jest.fn().mockReturnValue(true);
      
      const prototype = Object.getPrototypeOf(guard);
      prototype.canActivate = mockCanActivate;

      const result = await guard.canActivate(undefined as any);

      expect(mockCanActivate).toHaveBeenCalledWith(undefined);
      expect(result).toBe(true);
    });

    it("should handle null context", async () => {
      const mockCanActivate = jest.fn().mockReturnValue(true);
      
      const prototype = Object.getPrototypeOf(guard);
      prototype.canActivate = mockCanActivate;

      const result = await guard.canActivate(null as any);

      expect(mockCanActivate).toHaveBeenCalledWith(null);
      expect(result).toBe(true);
    });
  });

  describe("inheritance", () => {
    it("should have canActivate method from parent class", () => {
      expect(typeof guard.canActivate).toBe("function");
    });

    it("should have the correct prototype chain", () => {
      const prototype = Object.getPrototypeOf(guard);
      expect(prototype).toBeDefined();
      expect(typeof prototype.canActivate).toBe("function");
    });

    it("should be an instance of the mocked AuthGuard class", () => {
      const MockAuthGuard = (AuthGuard as jest.Mock).mock.results[0].value;
      expect(guard).toBeInstanceOf(MockAuthGuard);
    });
  });

  describe("strategy configuration", () => {
    it("should use 'local' as the strategy name", () => {
      expect(AuthGuard).toHaveBeenCalledTimes(1);
      expect(AuthGuard).toHaveBeenCalledWith("local");
    });

    it("should not use any other strategy", () => {
      expect(AuthGuard).not.toHaveBeenCalledWith("jwt");
      expect(AuthGuard).not.toHaveBeenCalledWith("google");
      expect(AuthGuard).not.toHaveBeenCalledWith("facebook");
    });
  });

  describe("edge cases", () => {
    it("should handle multiple canActivate calls", async () => {
      const mockContext1 = { switchToHttp: jest.fn() } as unknown as ExecutionContext;
      const mockContext2 = { switchToHttp: jest.fn() } as unknown as ExecutionContext;
      const mockCanActivate = jest.fn().mockReturnValue(true);
      
      const prototype = Object.getPrototypeOf(guard);
      prototype.canActivate = mockCanActivate;

      await guard.canActivate(mockContext1);
      await guard.canActivate(mockContext2);

      expect(mockCanActivate).toHaveBeenCalledTimes(2);
      expect(mockCanActivate).toHaveBeenCalledWith(mockContext1);
      expect(mockCanActivate).toHaveBeenCalledWith(mockContext2);
    });

    it("should handle async canActivate that returns a promise", async () => {
      const mockContext = {} as ExecutionContext;
      const mockCanActivate = jest.fn().mockResolvedValue(true);
      
      const prototype = Object.getPrototypeOf(guard);
      prototype.canActivate = mockCanActivate;

      const result = await guard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it("should handle canActivate that returns a non-boolean value", async () => {
      const mockContext = {} as ExecutionContext;
      const mockCanActivate = jest.fn().mockReturnValue("authenticated");
      
      const prototype = Object.getPrototypeOf(guard);
      prototype.canActivate = mockCanActivate;

      const result = await guard.canActivate(mockContext);
      expect(result).toBe("authenticated");
    });
  });
});