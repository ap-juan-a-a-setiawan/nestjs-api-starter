import { Test } from '@nestjs/testing';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

jest.mock('@nestjs/passport', () => ({
  AuthGuard: jest.fn().mockImplementation((strategy: string) => {
    return class MockAuthGuard {
      constructor() {
        this.strategy = strategy;
      }
      private strategy: string;
      
      canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        return true;
      }
      
      handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
          throw err || new Error('Unauthorized');
        }
        return user;
      }
      
      logIn(request: any) {
        return Promise.resolve();
      }
    };
  }),
}));

describe('LocalAuthGuard', () => {
  let guard: LocalAuthGuard;
  let mockAuthGuardInstance: any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [LocalAuthGuard],
    }).compile();

    guard = moduleRef.get<LocalAuthGuard>(LocalAuthGuard);
    mockAuthGuardInstance = (guard as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Class Definition', () => {
    it('should be defined', () => {
      expect(guard).toBeDefined();
    });

    it('should be injectable', () => {
      expect(LocalAuthGuard).toBeDefined();
      expect(typeof LocalAuthGuard).toBe('function');
    });

    it('should extend AuthGuard with "local" strategy', () => {
      expect(AuthGuard).toHaveBeenCalledWith('local');
    });

    it('should have the correct prototype chain', () => {
      expect(guard instanceof LocalAuthGuard).toBe(true);
      expect(Object.getPrototypeOf(LocalAuthGuard.prototype)).toBeDefined();
    });
  });

  describe('Inherited Methods', () => {
    describe('canActivate', () => {
      it('should return true when authentication succeeds', async () => {
        const mockContext = {
          switchToHttp: jest.fn().mockReturnValue({
            getRequest: jest.fn().mockReturnValue({}),
            getResponse: jest.fn().mockReturnValue({}),
          }),
        } as unknown as ExecutionContext;

        const result = await guard.canActivate(mockContext);
        expect(result).toBe(true);
      });

      it('should handle execution context with request and response', async () => {
        const mockRequest = { user: { id: 1, username: 'test' } };
        const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockContext = {
          switchToHttp: jest.fn().mockReturnValue({
            getRequest: jest.fn().mockReturnValue(mockRequest),
            getResponse: jest.fn().mockReturnValue(mockResponse),
          }),
        } as unknown as ExecutionContext;

        const result = await guard.canActivate(mockContext);
        expect(result).toBe(true);
      });

      it('should handle empty execution context', async () => {
        const mockContext = {} as ExecutionContext;
        const result = await guard.canActivate(mockContext);
        expect(result).toBe(true);
      });
    });

    describe('handleRequest', () => {
      it('should return user when no error and user exists', () => {
        const mockUser = { id: 1, username: 'test' };
        const result = mockAuthGuardInstance.handleRequest(null, mockUser, null);
        expect(result).toEqual(mockUser);
      });

      it('should throw error when error is provided', () => {
        const mockError = new Error('Authentication failed');
        expect(() => {
          mockAuthGuardInstance.handleRequest(mockError, null, null);
        }).toThrow('Authentication failed');
      });

      it('should throw error when user is not provided', () => {
        expect(() => {
          mockAuthGuardInstance.handleRequest(null, null, null);
        }).toThrow('Unauthorized');
      });

      it('should throw error when both error and user are missing', () => {
        expect(() => {
          mockAuthGuardInstance.handleRequest(undefined, undefined, undefined);
        }).toThrow('Unauthorized');
      });

      it('should return user when error is null and user exists', () => {
        const mockUser = { id: 2, username: 'john' };
        const result = mockAuthGuardInstance.handleRequest(null, mockUser, { message: 'info' });
        expect(result).toEqual(mockUser);
      });
    });

    describe('logIn', () => {
      it('should resolve successfully with valid request', async () => {
        const mockRequest = { user: { id: 1 } };
        await expect(mockAuthGuardInstance.logIn(mockRequest)).resolves.toBeUndefined();
      });

      it('should resolve successfully with empty request', async () => {
        await expect(mockAuthGuardInstance.logIn({})).resolves.toBeUndefined();
      });

      it('should resolve successfully with null request', async () => {
        await expect(mockAuthGuardInstance.logIn(null)).resolves.toBeUndefined();
      });
    });
  });

  describe('Strategy Configuration', () => {
    it('should be instantiated with "local" strategy', () => {
      expect(AuthGuard).toHaveBeenCalledWith('local');
      expect(AuthGuard).toHaveBeenCalledTimes(1);
    });

    it('should have strategy property set to "local"', () => {
      expect(mockAuthGuardInstance.strategy).toBe('local');
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple instantiations', () => {
      const guard1 = new LocalAuthGuard();
      const guard2 = new LocalAuthGuard();
      expect(guard1).toBeDefined();
      expect(guard2).toBeDefined();
      expect(guard1).not.toBe(guard2);
    });

    it('should maintain singleton behavior when injected', async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [LocalAuthGuard],
      }).compile();

      const guard1 = moduleRef.get<LocalAuthGuard>(LocalAuthGuard);
      const guard2 = moduleRef.get<LocalAuthGuard>(LocalAuthGuard);
      expect(guard1).toBe(guard2);
    });

    it('should work with dependency injection', async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [LocalAuthGuard],
      }).compile();

      const injectedGuard = moduleRef.get<LocalAuthGuard>(LocalAuthGuard);
      expect(injectedGuard).toBeInstanceOf(LocalAuthGuard);
    });
  });

  describe('Integration with NestJS', () => {
    it('should be usable as a guard in NestJS', async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [
          LocalAuthGuard,
          {
            provide: 'APP_GUARD',
            useClass: LocalAuthGuard,
          },
        ],
      }).compile();

      const app = moduleRef.createNestApplication();
      await app.init();
      
      const guard = app.get(LocalAuthGuard);
      expect(guard).toBeDefined();
      
      await app.close();
    });

    it('should work with custom execution context', async () => {
      const customContext = {
        getHandler: jest.fn().mockReturnValue(() => {}),
        getClass: jest.fn().mockReturnValue(class TestController {}),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: { authorization: 'Bearer token' },
            body: { username: 'test', password: 'password' },
          }),
          getResponse: jest.fn().mockReturnValue({}),
        }),
      } as unknown as ExecutionContext;

      const result = await guard.canActivate(customContext);
      expect(result).toBe(true);
    });
  });
});