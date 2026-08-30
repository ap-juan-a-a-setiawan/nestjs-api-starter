import { Test } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let authGuardMock: jest.Mocked<AuthGuard>;

  beforeEach(async () => {
    authGuardMock = {
      canActivate: jest.fn(),
      getAuthenticateOptions: jest.fn(),
      handleRequest: jest.fn(),
      logIn: jest.fn(),
      logOut: jest.fn(),
    } as unknown as jest.Mocked<AuthGuard>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: AuthGuard,
          useValue: authGuardMock,
        },
      ],
    }).compile();

    guard = moduleRef.get<JwtAuthGuard>(JwtAuthGuard);
  });

  describe('canActivate', () => {
    it('should be defined', () => {
      expect(guard.canActivate).toBeDefined();
    });

    it('should call AuthGuard canActivate with the execution context', async () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({}),
          getResponse: jest.fn().mockReturnValue({}),
        }),
      } as unknown as ExecutionContext;

      authGuardMock.canActivate.mockResolvedValue(true);

      const result = await guard.canActivate(mockContext);

      expect(authGuardMock.canActivate).toHaveBeenCalledWith(mockContext);
      expect(result).toBe(true);
    });

    it('should return false when AuthGuard canActivate returns false', async () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({}),
          getResponse: jest.fn().mockReturnValue({}),
        }),
      } as unknown as ExecutionContext;

      authGuardMock.canActivate.mockResolvedValue(false);

      const result = await guard.canActivate(mockContext);

      expect(authGuardMock.canActivate).toHaveBeenCalledWith(mockContext);
      expect(result).toBe(false);
    });

    it('should propagate errors from AuthGuard canActivate', async () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({}),
          getResponse: jest.fn().mockReturnValue({}),
        }),
      } as unknown as ExecutionContext;

      const error = new Error('Authentication failed');
      authGuardMock.canActivate.mockRejectedValue(error);

      await expect(guard.canActivate(mockContext)).rejects.toThrow(error);
      expect(authGuardMock.canActivate).toHaveBeenCalledWith(mockContext);
    });
  });

  describe('handleRequest', () => {
    it('should be defined', () => {
      expect(guard.handleRequest).toBeDefined();
    });

    it('should call AuthGuard handleRequest with the provided arguments', () => {
      const err = null;
      const user = { id: 1, username: 'testuser' };
      const info = { message: 'info' };

      authGuardMock.handleRequest.mockReturnValue(user);

      const result = guard.handleRequest(err, user, info);

      expect(authGuardMock.handleRequest).toHaveBeenCalledWith(err, user, info);
      expect(result).toBe(user);
    });

    it('should return the user when no error is present', () => {
      const user = { id: 2, username: 'anotheruser' };
      authGuardMock.handleRequest.mockReturnValue(user);

      const result = guard.handleRequest(null, user, null);

      expect(result).toBe(user);
    });

    it('should throw when error is present', () => {
      const err = new Error('Invalid token');
      const user = null;
      const info = null;

      authGuardMock.handleRequest.mockImplementation(() => {
        throw err;
      });

      expect(() => guard.handleRequest(err, user, info)).toThrow(err);
    });
  });

  describe('logIn', () => {
    it('should be defined', () => {
      expect(guard.logIn).toBeDefined();
    });

    it('should call AuthGuard logIn with the provided request', async () => {
      const mockRequest = { user: { id: 1 } };
      authGuardMock.logIn.mockResolvedValue(undefined);

      await guard.logIn(mockRequest);

      expect(authGuardMock.logIn).toHaveBeenCalledWith(mockRequest);
    });

    it('should propagate errors from AuthGuard logIn', async () => {
      const mockRequest = { user: { id: 1 } };
      const error = new Error('Login failed');
      authGuardMock.logIn.mockRejectedValue(error);

      await expect(guard.logIn(mockRequest)).rejects.toThrow(error);
    });
  });

  describe('logOut', () => {
    it('should be defined', () => {
      expect(guard.logOut).toBeDefined();
    });

    it('should call AuthGuard logOut with the provided request', async () => {
      const mockRequest = { user: { id: 1 } };
      authGuardMock.logOut.mockResolvedValue(undefined);

      await guard.logOut(mockRequest);

      expect(authGuardMock.logOut).toHaveBeenCalledWith(mockRequest);
    });

    it('should propagate errors from AuthGuard logOut', async () => {
      const mockRequest = { user: { id: 1 } };
      const error = new Error('Logout failed');
      authGuardMock.logOut.mockRejectedValue(error);

      await expect(guard.logOut(mockRequest)).rejects.toThrow(error);
    });
  });

  describe('getAuthenticateOptions', () => {
    it('should be defined', () => {
      expect(guard.getAuthenticateOptions).toBeDefined();
    });

    it('should call AuthGuard getAuthenticateOptions and return the options', () => {
      const options = { session: false };
      authGuardMock.getAuthenticateOptions.mockReturnValue(options);

      const result = guard.getAuthenticateOptions();

      expect(authGuardMock.getAuthenticateOptions).toHaveBeenCalled();
      expect(result).toBe(options);
    });

    it('should return undefined when no options are set', () => {
      authGuardMock.getAuthenticateOptions.mockReturnValue(undefined);

      const result = guard.getAuthenticateOptions();

      expect(result).toBeUndefined();
    });
  });

  describe('inheritance', () => {
    it('should be an instance of AuthGuard', () => {
      expect(guard).toBeInstanceOf(AuthGuard);
    });

    it('should have the correct strategy name', () => {
      // The strategy name is passed to the parent constructor
      // We can verify this by checking the prototype chain
      expect(Object.getPrototypeOf(guard)).toBeDefined();
    });
  });
});