import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { login: jest.Mock };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService) as unknown as {
      login: jest.Mock;
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return the result from authService.login', async () => {
      const user = { username: 'test', password: 'secret' } as LoginDto;
      const result = { accessToken: 'jwt-token' };
      authService.login.mockResolvedValue(result);

      await expect(controller.login(user)).resolves.toBe(result);
      expect(authService.login).toHaveBeenCalledWith(user);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors when authService.login rejects', async () => {
      const user = { username: 'test', password: 'wrong' } as LoginDto;
      const error = new Error('Invalid credentials');
      authService.login.mockRejectedValue(error);

      await expect(controller.login(user)).rejects.toThrow('Invalid credentials');
      expect(authService.login).toHaveBeenCalledWith(user);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });

    it('should pass undefined user when none is provided', async () => {
      const user = undefined as unknown as LoginDto;
      authService.login.mockResolvedValue(null);

      await expect(controller.login(user)).resolves.toBeNull();
      expect(authService.login).toHaveBeenCalledWith(undefined);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });
  });
});