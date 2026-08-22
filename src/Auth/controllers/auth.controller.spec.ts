import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { LoginDto } from '../dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { login: jest.Mock };

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useGuard({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with the user and return the result', async () => {
      const user: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };
      const expectedResult = { accessToken: 'jwt-token' };

      authService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(user);

      expect(authService.login).toHaveBeenCalledWith(user);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from authService.login', async () => {
      const user: LoginDto = {
        username: 'testuser',
        password: 'wrong-password',
      };
      const error = new Error('Invalid credentials');

      authService.login.mockRejectedValue(error);

      await expect(controller.login(user)).rejects.toThrow('Invalid credentials');
      expect(authService.login).toHaveBeenCalledWith(user);
    });

    it('should handle an empty user object', async () => {
      const user = {} as LoginDto;
      const expectedResult = { accessToken: 'token' };

      authService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(user);

      expect(authService.login).toHaveBeenCalledWith(user);
      expect(result).toEqual(expectedResult);
    });
  });
});