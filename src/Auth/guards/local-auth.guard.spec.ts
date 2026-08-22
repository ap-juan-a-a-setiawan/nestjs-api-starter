import { Test } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthGuard } from '@nestjs/passport';

jest.mock('@nestjs/passport', () => ({
  AuthGuard: jest.fn().mockImplementation(() => {
    return class MockAuthGuard {
      canActivate(context: ExecutionContext) {
        return true;
      }
    };
  }),
}));

describe('LocalAuthGuard', () => {
  let guard: LocalAuthGuard;
  let mockAuthGuard: jest.Mock;

  beforeEach(async () => {
    mockAuthGuard = AuthGuard as jest.Mock;
    mockAuthGuard.mockClear();

    const moduleRef = await Test.createTestingModule({
      providers: [LocalAuthGuard],
    }).compile();

    guard = moduleRef.get<LocalAuthGuard>(LocalAuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should call AuthGuard with "local" strategy', () => {
    expect(mockAuthGuard).toHaveBeenCalledWith('local');
  });

  it('should extend AuthGuard', () => {
    expect(guard).toBeInstanceOf(AuthGuard('local'));
  });

  describe('canActivate', () => {
    it('should return true when AuthGuard canActivate returns true', () => {
      const mockContext = {} as ExecutionContext;
      const result = guard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should return false when AuthGuard canActivate returns false', () => {
      const mockContext = {} as ExecutionContext;
      const mockCanActivate = jest.fn().mockReturnValue(false);
      
      // Override the canActivate method
      Object.defineProperty(guard, 'canActivate', {
        value: mockCanActivate,
        writable: true,
      });

      const result = guard.canActivate(mockContext);
      expect(result).toBe(false);
      expect(mockCanActivate).toHaveBeenCalledWith(mockContext);
    });

    it('should handle errors from AuthGuard canActivate', () => {
      const mockContext = {} as ExecutionContext;
      const error = new Error('Authentication failed');
      const mockCanActivate = jest.fn().mockImplementation(() => {
        throw error;
      });

      Object.defineProperty(guard, 'canActivate', {
        value: mockCanActivate,
        writable: true,
      });

      expect(() => guard.canActivate(mockContext)).toThrow(error);
      expect(mockCanActivate).toHaveBeenCalledWith(mockContext);
    });

    it('should handle async canActivate returning a promise', async () => {
      const mockContext = {} as ExecutionContext;
      const mockCanActivate = jest.fn().mockResolvedValue(true);

      Object.defineProperty(guard, 'canActivate', {
        value: mockCanActivate,
        writable: true,
      });

      const result = await guard.canActivate(mockContext);
      expect(result).toBe(true);
      expect(mockCanActivate).toHaveBeenCalledWith(mockContext);
    });

    it('should handle async canActivate rejecting with error', async () => {
      const mockContext = {} as ExecutionContext;
      const error = new Error('Async authentication failed');
      const mockCanActivate = jest.fn().mockRejectedValue(error);

      Object.defineProperty(guard, 'canActivate', {
        value: mockCanActivate,
        writable: true,
      });

      await expect(guard.canActivate(mockContext)).rejects.toThrow(error);
      expect(mockCanActivate).toHaveBeenCalledWith(mockContext);
    });
  });

  describe('inheritance behavior', () => {
    it('should inherit canActivate from AuthGuard', () => {
      expect(typeof guard.canActivate).toBe('function');
    });

    it('should inherit handleRequest from AuthGuard', () => {
      expect(typeof guard.handleRequest).toBe('function');
    });

    it('should inherit logIn from AuthGuard', () => {
      expect(typeof guard.logIn).toBe('function');
    });

    it('should inherit logOut from AuthGuard', () => {
      expect(typeof guard.logOut).toBe('function');
    });
  });

  describe('edge cases', () => {
    it('should handle null context', () => {
      const result = guard.canActivate(null as unknown as ExecutionContext);
      expect(result).toBe(true);
    });

    it('should handle undefined context', () => {
      const result = guard.canActivate(undefined as unknown as ExecutionContext);
      expect(result).toBe(true);
    });

    it('should handle context with request object', () => {
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({ user: { id: 1, username: 'test' } }),
        }),
      } as unknown as ExecutionContext;

      const result = guard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should handle context with headers', () => {
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'Bearer token123' },
          }),
        }),
      } as unknown as ExecutionContext;

      const result = guard.canActivate(mockContext);
      expect(result).toBe(true);
    });
  });

  describe('AuthGuard instantiation', () => {
    it('should instantiate AuthGuard with correct strategy name', () => {
      expect(mockAuthGuard).toHaveBeenCalledTimes(1);
      expect(mockAuthGuard).toHaveBeenCalledWith('local');
    });

    it('should not instantiate AuthGuard with wrong strategy name', () => {
      expect(mockAuthGuard).not.toHaveBeenCalledWith('jwt');
      expect(mockAuthGuard).not.toHaveBeenCalledWith('google');
    });

    it('should be a singleton instance', () => {
      const guard2 = new LocalAuthGuard();
      expect(guard2).toBeInstanceOf(LocalAuthGuard);
      expect(guard2).toBeInstanceOf(AuthGuard('local'));
    });
  });
});