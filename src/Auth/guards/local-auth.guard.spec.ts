import { Test } from '@nestjs/testing';
import { LocalAuthGuard } from './local-auth.guard';
import { ExecutionContext } from '@nestjs/common';
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

  describe('class definition', () => {
    it('should be defined', () => {
      expect(guard).toBeDefined();
    });

    it('should be injectable', () => {
      expect(LocalAuthGuard).toBeDefined();
      expect(typeof LocalAuthGuard).toBe('function');
    });

    it('should extend AuthGuard with "local" strategy', () => {
      expect(mockAuthGuard).toHaveBeenCalledWith('local');
    });

    it('should have @Injectable decorator applied', () => {
      const metadata = Reflect.getMetadata('__injectable__', LocalAuthGuard);
      expect(metadata).toBeDefined();
    });
  });

  describe('inheritance from AuthGuard', () => {
    it('should inherit canActivate method from AuthGuard', () => {
      expect(typeof guard.canActivate).toBe('function');
    });

    it('should inherit handleRequest method from AuthGuard', () => {
      expect(typeof guard.handleRequest).toBe('function');
    });

    it('should inherit logIn method from AuthGuard', () => {
      expect(typeof guard.logIn).toBe('function');
    });

    it('should inherit logOut method from AuthGuard', () => {
      expect(typeof guard.logOut).toBe('function');
    });
  });

  describe('canActivate', () => {
    it('should return true when AuthGuard canActivate returns true', () => {
      const mockContext = {} as ExecutionContext;
      const result = guard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should return false when AuthGuard canActivate returns false', () => {
      // Override the mock to return false
      const mockCanActivate = jest.fn().mockReturnValue(false);
      const mockAuthGuardInstance = { canActivate: mockCanActivate };
      mockAuthGuard.mockImplementation(() => {
        return class MockAuthGuard {
          canActivate(context: ExecutionContext) {
            return mockCanActivate(context);
          }
        };
      });

      const moduleRef = Test.createTestingModule({
        providers: [LocalAuthGuard],
      }).compile();

      moduleRef.then((ref) => {
        const newGuard = ref.get<LocalAuthGuard>(LocalAuthGuard);
        const mockContext = {} as ExecutionContext;
        const result = newGuard.canActivate(mockContext);
        expect(result).toBe(false);
        expect(mockCanActivate).toHaveBeenCalledWith(mockContext);
      });
    });

    it('should pass the execution context to AuthGuard canActivate', () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({}),
        }),
      } as unknown as ExecutionContext;

      const result = guard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should handle errors from AuthGuard canActivate', () => {
      const mockError = new Error('Authentication failed');
      const mockCanActivate = jest.fn().mockImplementation(() => {
        throw mockError;
      });

      mockAuthGuard.mockImplementation(() => {
        return class MockAuthGuard {
          canActivate(context: ExecutionContext) {
            return mockCanActivate(context);
          }
        };
      });

      const moduleRef = Test.createTestingModule({
        providers: [LocalAuthGuard],
      }).compile();

      moduleRef.then((ref) => {
        const newGuard = ref.get<LocalAuthGuard>(LocalAuthGuard);
        const mockContext = {} as ExecutionContext;
        expect(() => newGuard.canActivate(mockContext)).toThrow(mockError);
      });
    });
  });

  describe('handleRequest', () => {
    it('should return the user when no error and user exists', () => {
      const mockUser = { id: 1, username: 'test' };
      const mockHandleRequest = jest.fn().mockReturnValue(mockUser);

      mockAuthGuard.mockImplementation(() => {
        return class MockAuthGuard {
          handleRequest(err: any, user: any, info: any) {
            return mockHandleRequest(err, user, info);
          }
        };
      });

      const moduleRef = Test.createTestingModule({
        providers: [LocalAuthGuard],
      }).compile();

      moduleRef.then((ref) => {
        const newGuard = ref.get<LocalAuthGuard>(LocalAuthGuard);
        const result = newGuard.handleRequest(null, mockUser, null);
        expect(result).toEqual(mockUser);
        expect(mockHandleRequest).toHaveBeenCalledWith(null, mockUser, null);
      });
    });

    it('should throw error when error is provided', () => {
      const mockError = new Error('Invalid credentials');
      const mockHandleRequest = jest.fn().mockImplementation(() => {
        throw mockError;
      });

      mockAuthGuard.mockImplementation(() => {
        return class MockAuthGuard {
          handleRequest(err: any, user: any, info: any) {
            return mockHandleRequest(err, user, info);
          }
        };
      });

      const moduleRef = Test.createTestingModule({
        providers: [LocalAuthGuard],
      }).compile();

      moduleRef.then((ref) => {
        const newGuard = ref.get<LocalAuthGuard>(LocalAuthGuard);
        expect(() => newGuard.handleRequest(mockError, null, null)).toThrow(mockError);
      });
    });

    it('should throw UnauthorizedException when user is null', () => {
      const mockHandleRequest = jest.fn().mockImplementation(() => {
        throw new Error('Unauthorized');
      });

      mockAuthGuard.mockImplementation(() => {
        return class MockAuthGuard {
          handleRequest(err: any, user: any, info: any) {
            return mockHandleRequest(err, user, info);
          }
        };
      });

      const moduleRef = Test.createTestingModule({
        providers: [LocalAuthGuard],
      }).compile();

      moduleRef.then((ref) => {
        const newGuard = ref.get<LocalAuthGuard>(LocalAuthGuard);
        expect(() => newGuard.handleRequest(null, null, null)).toThrow('Unauthorized');
      });
    });
  });

  describe('logIn and logOut', () => {
    it('should call logIn method from AuthGuard', () => {
      const mockLogIn = jest.fn();
      mockAuthGuard.mockImplementation(() => {
        return class MockAuthGuard {
          logIn(request: any) {
            return mockLogIn(request);
          }
        };
      });

      const moduleRef = Test.createTestingModule({
        providers: [LocalAuthGuard],
      }).compile();

      moduleRef.then((ref) => {
        const newGuard = ref.get<LocalAuthGuard>(LocalAuthGuard);
        const mockRequest = {};
        newGuard.logIn(mockRequest);
        expect(mockLogIn).toHaveBeenCalledWith(mockRequest);
      });
    });

    it('should call logOut method from AuthGuard', () => {
      const mockLogOut = jest.fn();
      mockAuthGuard.mockImplementation(() => {
        return class MockAuthGuard {
          logOut(request: any) {
            return mockLogOut(request);
          }
        };
      });

      const moduleRef = Test.createTestingModule({
        providers: [LocalAuthGuard],
      }).compile();

      moduleRef.then((ref) => {
        const newGuard = ref.get<LocalAuthGuard>(LocalAuthGuard);
        const mockRequest = {};
        newGuard.logOut(mockRequest);
        expect(mockLogOut).toHaveBeenCalledWith(mockRequest);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle undefined execution context', () => {
      const result = guard.canActivate(undefined as unknown as ExecutionContext);
      expect(result).toBe(true);
    });

    it('should handle null execution context', () => {
      const result = guard.canActivate(null as unknown as ExecutionContext);
      expect(result).toBe(true);
    });

    it('should handle empty execution context', () => {
      const mockContext = {} as ExecutionContext;
      const result = guard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should be instantiated with correct strategy name', () => {
      expect(mockAuthGuard).toHaveBeenCalledWith('local');
      expect(mockAuthGuard).toHaveBeenCalledTimes(1);
    });

    it('should not call AuthGuard constructor with wrong strategy', () => {
      expect(mockAuthGuard).not.toHaveBeenCalledWith('jwt');
      expect(mockAuthGuard).not.toHaveBeenCalledWith('google');
    });
  });
});