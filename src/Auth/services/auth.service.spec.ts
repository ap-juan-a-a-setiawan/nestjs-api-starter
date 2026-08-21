typescript
import { Test } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { UserService } from "../../Users/services/user.service";
import { jwtContanst } from "../contants/jwt";

describe("AuthService", () => {
  let service: AuthService;
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

    service = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<{ getByEmail: jest.Mock }>(UserService);
    jwtService = moduleRef.get<{ sign: jest.Mock }>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("validateUser", () => {
    it("should throw UnauthorizedException when user is not found", async () => {
      userService.getByEmail.mockResolvedValue(null);

      await expect(
        service.validateUser("nonexistent@example.com", "password")
      ).rejects.toThrow(UnauthorizedException);
      expect(userService.getByEmail).toHaveBeenCalledWith(
        "nonexistent@example.com"
      );
    });

    it("should return the user when password is valid", async () => {
      const user = {
        id: 1,
        email: "user@example.com",
        validatePassword: jest.fn().mockResolvedValue(true),
      };
      userService.getByEmail.mockResolvedValue(user);

      const result = await service.validateUser(
        "user@example.com",
        "correct-password"
      );

      expect(result).toBe(user);
      expect(user.validatePassword).toHaveBeenCalledWith("correct-password");
    });

    it("should return null when password is invalid", async () => {
      const user = {
        id: 1,
        email: "user@example.com",
        validatePassword: jest.fn().mockResolvedValue(false),
      };
      userService.getByEmail.mockResolvedValue(user);

      const result = await service.validateUser(
        "user@example.com",
        "wrong-password"
      );

      expect(result).toBeNull();
      expect(user.validatePassword).toHaveBeenCalledWith("wrong-password");
    });
  });

  describe("login", () => {
    it("should return access token and expiration", async () => {
      const user = {
        id: 42,
        email: "user@example.com",
      };
      jwtService.sign.mockReturnValue("signed-jwt-token");

      const result = await service.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
      });
      expect(result).toEqual({
        accessToken: "signed-jwt-token",
        expiresIn: jwtContanst.expiresIn,
      });
    });
  });
});