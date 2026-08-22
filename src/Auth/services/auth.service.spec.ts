import { Test } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { UserService } from "../../Users/services/user.service";
import { jwtContanst } from "../contants/jwt";

describe("AuthService", () => {
  let authService: AuthService;
  let userService: { getByEmail: jest.Mock };
  let jwtService: { sign: jest.Mock };

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

    authService = moduleRef.get(AuthService);
    userService = moduleRef.get(UserService);
    jwtService = moduleRef.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("validateUser", () => {
    it("should throw UnauthorizedException when user is not found", async () => {
      userService.getByEmail.mockResolvedValue(null);

      await expect(
        authService.validateUser("test@example.com", "password")
      ).rejects.toThrow(UnauthorizedException);
      expect(userService.getByEmail).toHaveBeenCalledWith("test@example.com");
    });

    it("should throw UnauthorizedException with the correct message when user is not found", async () => {
      userService.getByEmail.mockResolvedValue(null);

      await expect(
        authService.validateUser("test@example.com", "password")
      ).rejects.toThrow("These credentials do not match our records.");
    });

    it("should return the user when the password is valid", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        validatePassword: jest.fn().mockResolvedValue(true),
      };
      userService.getByEmail.mockResolvedValue(mockUser as any);

      const result = await authService.validateUser(
        "test@example.com",
        "correct-password"
      );

      expect(result).toEqual(mockUser);
      expect(mockUser.validatePassword).toHaveBeenCalledWith("correct-password");
      expect(userService.getByEmail).toHaveBeenCalledWith("test@example.com");
    });

    it("should return null when the password is invalid", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        validatePassword: jest.fn().mockResolvedValue(false),
      };
      userService.getByEmail.mockResolvedValue(mockUser as any);

      const result = await authService.validateUser(
        "test@example.com",
        "wrong-password"
      );

      expect(result).toBeNull();
      expect(mockUser.validatePassword).toHaveBeenCalledWith("wrong-password");
      expect(userService.getByEmail).toHaveBeenCalledWith("test@example.com");
    });
  });

  describe("login", () => {
    it("should return an access token and expiration time", async () => {
      const user = { id: 1, email: "test@example.com" };
      jwtService.sign.mockReturnValue("signed-jwt-token");

      const result = await authService.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
      });
      expect(result).toEqual({
        accessToken: "signed-jwt-token",
        expiresIn: jwtContanst.expiresIn,
      });
    });

    it("should call jwtService.sign with the correct payload", async () => {
      const user = { id: 42, email: "user@example.com" };
      jwtService.sign.mockReturnValue("token");

      await authService.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: "user@example.com",
        sub: 42,
      });
    });
  });
});