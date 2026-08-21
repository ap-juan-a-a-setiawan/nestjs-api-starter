import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { login: jest.Mock };

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService) as any;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with the user and return the result', async () => {
      const user: LoginDto = {
        username: 'testuser',
        password: 'password',
      } as LoginDto;
      const expectedResult = { accessToken: 'jwt' };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(user);

      expect(mockAuthService.login).toHaveBeenCalledWith(user);
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from authService.login', async () => {
      const user: LoginDto = {
        username: 'testuser',
        password: 'wrong',
      } as LoginDto;
      const error = new Error('Invalid credentials');

      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(user)).rejects.toThrow(error);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
    });

    it('should call authService.login with undefined when user is not provided', async () => {
      const expectedResult = { accessToken: 'jwt' };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(undefined as unknown as LoginDto);

      expect(mockAuthService.login).toHaveBeenCalledWith(undefined);
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });
});