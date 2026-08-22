import { Test } from "@nestjs/testing";
import { ExecutionContext } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { AuthGuard } from "@nestjs/passport";

describe("JwtAuthGuard", () => {
  let jwtAuthGuard: JwtAuthGuard;
  let mockAuthGuard: jest.Mocked<AuthGuard>;

  beforeEach(async () => {
    mockAuthGuard = {
      canActivate: jest.fn(),
      handleRequest: jest.fn(),
      getAuthenticateOptions: jest.fn(),
      logIn: jest.fn(),
      logOut: jest.fn(),
    } as unknown as jest.Mocked<AuthGuard>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: AuthGuard,
          useValue: mockAuthGuard,
        },
      ],
    }).compile();

    jwtAuthGuard = moduleRef.get<JwtAuthGuard>(JwtAuthGuard);
  });

  describe("canActivate", () => {
    it("should be defined", () => {
      expect(jwtAuthGuard.canActivate).toBeDefined();
    });

    it("should call AuthGuard canActivate method", async () => {
      const mockContext = {} as ExecutionContext;
      mockAuthGuard.canActivate.mockResolvedValue(true);

      const result = await jwtAuthGuard.canActivate(mockContext);

      expect(mockAuthGuard.canActivate).toHaveBeenCalledWith(mockContext);
      expect(result).toBe(true);
    });

    it("should return false when AuthGuard canActivate returns false", async () => {
      const mockContext = {} as ExecutionContext;
      mockAuthGuard.canActivate.mockResolvedValue(false);

      const result = await jwtAuthGuard.canActivate(mockContext);

      expect(mockAuthGuard.canActivate).toHaveBeenCalledWith(mockContext);
      expect(result).toBe(false);
    });

    it("should propagate errors from AuthGuard canActivate", async () => {
      const mockContext = {} as ExecutionContext;
      const error = new Error("Unauthorized");
      mockAuthGuard.canActivate.mockRejectedValue(error);

      await expect(jwtAuthGuard.canActivate(mockContext)).rejects.toThrow(error);
      expect(mockAuthGuard.canActivate).toHaveBeenCalledWith(mockContext);
    });
  });

  describe("handleRequest", () => {
    it("should be defined", () => {
      expect(jwtAuthGuard.handleRequest).toBeDefined();
    });

    it("should call AuthGuard handleRequest method", () => {
      const err = null;
      const user = { id: 1, username: "test" };
      const info = undefined;
      const context = {} as ExecutionContext;
      const status = 200;

      mockAuthGuard.handleRequest.mockReturnValue(user);

      const result = jwtAuthGuard.handleRequest(err, user, info, context, status);

      expect(mockAuthGuard.handleRequest).toHaveBeenCalledWith(err, user, info, context, status);
      expect(result).toBe(user);
    });

    it("should return user when no error", () => {
      const err = null;
      const user = { id: 2, username: "test2" };
      const info = undefined;
      const context = {} as ExecutionContext;
      const status = 200;

      mockAuthGuard.handleRequest.mockReturnValue(user);

      const result = jwtAuthGuard.handleRequest(err, user, info, context, status);

      expect(result).toBe(user);
    });

    it("should throw error when error is provided", () => {
      const err = new Error("Invalid token");
      const user = null;
      const info = undefined;
      const context = {} as ExecutionContext;
      const status = 200;

      mockAuthGuard.handleRequest.mockImplementation(() => {
        throw err;
      });

      expect(() => jwtAuthGuard.handleRequest(err, user, info, context, status)).toThrow(err);
      expect(mockAuthGuard.handleRequest).toHaveBeenCalledWith(err, user, info, context, status);
    });

    it("should return false when user is null and no error", () => {
      const err = null;
      const user = null;
      const info = undefined;
      const context = {} as ExecutionContext;
      const status = 200;

      mockAuthGuard.handleRequest.mockReturnValue(false);

      const result = jwtAuthGuard.handleRequest(err, user, info, context, status);

      expect(result).toBe(false);
    });
  });

  describe("getAuthenticateOptions", () => {
    it("should be defined", () => {
      expect(jwtAuthGuard.getAuthenticateOptions).toBeDefined();
    });

    it("should call AuthGuard getAuthenticateOptions method", () => {
      const mockOptions = { session: false };
      mockAuthGuard.getAuthenticateOptions.mockReturnValue(mockOptions);

      const result = jwtAuthGuard.getAuthenticateOptions();

      expect(mockAuthGuard.getAuthenticateOptions).toHaveBeenCalled();
      expect(result).toBe(mockOptions);
    });
  });

  describe("logIn", () => {
    it("should be defined", () => {
      expect(jwtAuthGuard.logIn).toBeDefined();
    });

    it("should call AuthGuard logIn method", async () => {
      const mockRequest = { user: { id: 1 } };
      mockAuthGuard.logIn.mockResolvedValue(undefined);

      await jwtAuthGuard.logIn(mockRequest);

      expect(mockAuthGuard.logIn).toHaveBeenCalledWith(mockRequest);
    });

    it("should propagate errors from logIn", async () => {
      const mockRequest = { user: { id: 1 } };
      const error = new Error("Login failed");
      mockAuthGuard.logIn.mockRejectedValue(error);

      await expect(jwtAuthGuard.logIn(mockRequest)).rejects.toThrow(error);
      expect(mockAuthGuard.logIn).toHaveBeenCalledWith(mockRequest);
    });
  });

  describe("logOut", () => {
    it("should be defined", () => {
      expect(jwtAuthGuard.logOut).toBeDefined();
    });

    it("should call AuthGuard logOut method", async () => {
      const mockRequest = { user: { id: 1 } };
      mockAuthGuard.logOut.mockResolvedValue(undefined);

      await jwtAuthGuard.logOut(mockRequest);

      expect(mockAuthGuard.logOut).toHaveBeenCalledWith(mockRequest);
    });

    it("should propagate errors from logOut", async () => {
      const mockRequest = { user: { id: 1 } };
      const error = new Error("Logout failed");
      mockAuthGuard.logOut.mockRejectedValue(error);

      await expect(jwtAuthGuard.logOut(mockRequest)).rejects.toThrow(error);
      expect(mockAuthGuard.logOut).toHaveBeenCalledWith(mockRequest);
    });
  });

  describe("inheritance", () => {
    it("should be instance of AuthGuard", () => {
      expect(jwtAuthGuard).toBeInstanceOf(AuthGuard);
    });

    it("should have the correct strategy name", () => {
      expect(JwtAuthGuard.name).toBe("JwtAuthGuard");
    });
  });
});