import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UserService } from "../../Users/services/user.service";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException } from "@nestjs/common";
import { jwtContanst } from "../contants/jwt";

describe("AuthService", () => {
  let authService: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: 1,
    email: "test@example.com",
    password: "hashedPassword",
    validatePassword: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            getByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get(UserService);
    jwtService = moduleRef.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("validateUser", () => {
    it("should return user when credentials are valid", async () => {
      // Arrange
      const email = "test@example.com";
      const password = "correctPassword";
      mockUser.validatePassword.mockResolvedValue(true);
      userService.getByEmail.mockResolvedValue(mockUser);

      // Act
      const result = await authService.validateUser(email, password);

      // Assert
      expect(userService.getByEmail).toHaveBeenCalledWith(email);
      expect(mockUser.validatePassword).toHaveBeenCalledWith(password);
      expect(result).toEqual(mockUser);
    });

    it("should throw UnauthorizedException when user does not exist", async () => {
      // Arrange
      const email = "nonexistent@example.com";
      const password = "anyPassword";
      userService.getByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(authService.validateUser(email, password)).rejects.toThrow(
        UnauthorizedException
      );
      await expect(authService.validateUser(email, password)).rejects.toThrow(
        "These credentials do not match our records."
      );
      expect(userService.getByEmail).toHaveBeenCalledWith(email);
      expect(mockUser.validatePassword).not.toHaveBeenCalled();
    });

    it("should return null when password is invalid", async () => {
      // Arrange
      const email = "test@example.com";
      const password = "wrongPassword";
      mockUser.validatePassword.mockResolvedValue(false);
      userService.getByEmail.mockResolvedValue(mockUser);

      // Act
      const result = await authService.validateUser(email, password);

      // Assert
      expect(userService.getByEmail).toHaveBeenCalledWith(email);
      expect(mockUser.validatePassword).toHaveBeenCalledWith(password);
      expect(result).toBeNull();
    });

    it("should handle user without validatePassword method", async () => {
      // Arrange
      const email = "test@example.com";
      const password = "anyPassword";
      const userWithoutValidate = { ...mockUser, validatePassword: undefined };
      userService.getByEmail.mockResolvedValue(userWithoutValidate);

      // Act
      const result = await authService.validateUser(email, password);

      // Assert
      expect(result).toBeNull();
    });

    it("should propagate errors from userService.getByEmail", async () => {
      // Arrange
      const email = "test@example.com";
      const password = "anyPassword";
      const error = new Error("Database connection failed");
      userService.getByEmail.mockRejectedValue(error);

      // Act & Assert
      await expect(authService.validateUser(email, password)).rejects.toThrow(
        error
      );
    });

    it("should propagate errors from validatePassword", async () => {
      // Arrange
      const email = "test@example.com";
      const password = "anyPassword";
      const error = new Error("Password validation failed");
      mockUser.validatePassword.mockRejectedValue(error);
      userService.getByEmail.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(authService.validateUser(email, password)).rejects.toThrow(
        error
      );
    });
  });

  describe("login", () => {
    it("should return access token and expiration time", async () => {
      // Arrange
      const user = { id: 1, email: "test@example.com" };
      const mockToken = "mock.jwt.token";
      jwtService.sign.mockReturnValue(mockToken);

      // Act
      const result = await authService.login(user);

      // Assert
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
      });
      expect(result).toEqual({
        accessToken: mockToken,
        expiresIn: jwtContanst.expiresIn,
      });
    });

    it("should handle user with additional properties", async () => {
      // Arrange
      const user = {
        id: 2,
        email: "another@example.com",
        name: "John Doe",
        role: "admin",
      };
      const mockToken = "another.jwt.token";
      jwtService.sign.mockReturnValue(mockToken);

      // Act
      const result = await authService.login(user);

      // Assert
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
      });
      expect(result.accessToken).toBe(mockToken);
      expect(result.expiresIn).toBe(jwtContanst.expiresIn);
    });

    it("should handle user with null id", async () => {
      // Arrange
      const user = { id: null, email: "test@example.com" };
      const mockToken = "null.id.token";
      jwtService.sign.mockReturnValue(mockToken);

      // Act
      const result = await authService.login(user);

      // Assert
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: null,
      });
      expect(result.accessToken).toBe(mockToken);
    });

    it("should handle user with null email", async () => {
      // Arrange
      const user = { id: 1, email: null };
      const mockToken = "null.email.token";
      jwtService.sign.mockReturnValue(mockToken);

      // Act
      const result = await authService.login(user);

      // Assert
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: null,
        sub: user.id,
      });
      expect(result.accessToken).toBe(mockToken);
    });

    it("should propagate errors from jwtService.sign", async () => {
      // Arrange
      const user = { id: 1, email: "test@example.com" };
      const error = new Error("JWT signing failed");
      jwtService.sign.mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      await expect(authService.login(user)).rejects.toThrow(error);
    });

    it("should return expiresIn from jwtContanst", async () => {
      // Arrange
      const user = { id: 1, email: "test@example.com" };
      const mockToken = "mock.token";
      jwtService.sign.mockReturnValue(mockToken);

      // Act
      const result = await authService.login(user);

      // Assert
      expect(result.expiresIn).toBe(jwtContanst.expiresIn);
      expect(result.expiresIn).toBeDefined();
      expect(typeof result.expiresIn).toBe("number");
    });
  });
});