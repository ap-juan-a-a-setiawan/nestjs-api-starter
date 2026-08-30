import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserService } from "../../Users/services/user.service";
import { jwtContanst } from "../contants/jwt";

describe("AuthService", () => {
  let service: AuthService;
  let userServiceMock: jest.Mocked<Partial<UserService>>;
  let jwtServiceMock: jest.Mocked<Partial<JwtService>>;

  const mockUser = {
    id: 1,
    email: "test@example.com",
    password: "hashedPassword",
    validatePassword: jest.fn(),
  };

  beforeEach(async () => {
    userServiceMock = {
      getByEmail: jest.fn(),
    };

    jwtServiceMock = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("validateUser", () => {
    it("should return user when credentials are valid", async () => {
      const email = "test@example.com";
      const password = "correctPassword";

      userServiceMock.getByEmail.mockResolvedValue(mockUser);
      mockUser.validatePassword.mockResolvedValue(true);

      const result = await service.validateUser(email, password);

      expect(userServiceMock.getByEmail).toHaveBeenCalledWith(email);
      expect(mockUser.validatePassword).toHaveBeenCalledWith(password);
      expect(result).toEqual(mockUser);
    });

    it("should throw UnauthorizedException when user is not found", async () => {
      const email = "nonexistent@example.com";
      const password = "anyPassword";

      userServiceMock.getByEmail.mockResolvedValue(null);

      await expect(service.validateUser(email, password)).rejects.toThrow(
        UnauthorizedException
      );
      await expect(service.validateUser(email, password)).rejects.toThrow(
        "These credentials do not match our records."
      );

      expect(userServiceMock.getByEmail).toHaveBeenCalledWith(email);
      expect(mockUser.validatePassword).not.toHaveBeenCalled();
    });

    it("should return null when password is invalid", async () => {
      const email = "test@example.com";
      const password = "wrongPassword";

      userServiceMock.getByEmail.mockResolvedValue(mockUser);
      mockUser.validatePassword.mockResolvedValue(false);

      const result = await service.validateUser(email, password);

      expect(userServiceMock.getByEmail).toHaveBeenCalledWith(email);
      expect(mockUser.validatePassword).toHaveBeenCalledWith(password);
      expect(result).toBeNull();
    });

    it("should handle user without validatePassword method", async () => {
      const email = "test@example.com";
      const password = "anyPassword";
      const userWithoutValidate = { ...mockUser, validatePassword: undefined };

      userServiceMock.getByEmail.mockResolvedValue(userWithoutValidate);

      await expect(service.validateUser(email, password)).rejects.toThrow(
        TypeError
      );
    });

    it("should propagate errors from userService.getByEmail", async () => {
      const email = "test@example.com";
      const password = "anyPassword";
      const error = new Error("Database connection failed");

      userServiceMock.getByEmail.mockRejectedValue(error);

      await expect(service.validateUser(email, password)).rejects.toThrow(
        error
      );
    });

    it("should propagate errors from validatePassword", async () => {
      const email = "test@example.com";
      const password = "anyPassword";
      const error = new Error("Password validation failed");

      userServiceMock.getByEmail.mockResolvedValue(mockUser);
      mockUser.validatePassword.mockRejectedValue(error);

      await expect(service.validateUser(email, password)).rejects.toThrow(
        error
      );
    });
  });

  describe("login", () => {
    it("should return access token and expiration time", async () => {
      const user = {
        id: 1,
        email: "test@example.com",
      };
      const mockToken = "mock.jwt.token";
      const mockExpiresIn = jwtContanst.expiresIn;

      jwtServiceMock.sign.mockReturnValue(mockToken);

      const result = await service.login(user);

      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
      });
      expect(result).toEqual({
        accessToken: mockToken,
        expiresIn: mockExpiresIn,
      });
    });

    it("should handle user without id", async () => {
      const user = {
        email: "test@example.com",
      };
      const mockToken = "mock.jwt.token";

      jwtServiceMock.sign.mockReturnValue(mockToken);

      const result = await service.login(user);

      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: undefined,
      });
      expect(result.accessToken).toBe(mockToken);
      expect(result.expiresIn).toBe(jwtContanst.expiresIn);
    });

    it("should handle user without email", async () => {
      const user = {
        id: 1,
      };
      const mockToken = "mock.jwt.token";

      jwtServiceMock.sign.mockReturnValue(mockToken);

      const result = await service.login(user);

      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        email: undefined,
        sub: user.id,
      });
      expect(result.accessToken).toBe(mockToken);
      expect(result.expiresIn).toBe(jwtContanst.expiresIn);
    });

    it("should handle empty user object", async () => {
      const user = {};
      const mockToken = "mock.jwt.token";

      jwtServiceMock.sign.mockReturnValue(mockToken);

      const result = await service.login(user);

      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        email: undefined,
        sub: undefined,
      });
      expect(result.accessToken).toBe(mockToken);
      expect(result.expiresIn).toBe(jwtContanst.expiresIn);
    });

    it("should propagate errors from jwtService.sign", async () => {
      const user = {
        id: 1,
        email: "test@example.com",
      };
      const error = new Error("JWT signing failed");

      jwtServiceMock.sign.mockImplementation(() => {
        throw error;
      });

      expect(() => service.login(user)).toThrow(error);
    });

    it("should return correct expiresIn from jwtContanst", async () => {
      const user = {
        id: 1,
        email: "test@example.com",
      };
      const mockToken = "mock.jwt.token";

      jwtServiceMock.sign.mockReturnValue(mockToken);

      const result = await service.login(user);

      expect(result.expiresIn).toBe(jwtContanst.expiresIn);
      expect(result.expiresIn).toBeDefined();
      expect(typeof result.expiresIn).toBe("string");
    });
  });
});