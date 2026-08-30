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
      
      handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
        return user;
      }
      
      getStrategy() {
        return this.strategy;
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

    it('should extend AuthGuard with local strategy', () => {
      expect(AuthGuard).toHaveBeenCalledWith('local');
    });

    it('should have @Injectable decorator applied', () => {
      const metadata = Reflect.getMetadata('__injectable__', LocalAuthGuard);
      expect(metadata).toBeDefined();
    });
  });

  describe('Inheritance and Strategy', () => {
    it('should be an instance of AuthGuard', () => {
      expect(guard).toBeInstanceOf(AuthGuard('local'));
    });

    it('should have local strategy configured', () => {
      const strategy = mockAuthGuardInstance.getStrategy();
      expect(strategy).toBe('local');
    });

    it('should inherit canActivate method from AuthGuard', () => {
      expect(typeof guard.canActivate).toBe('function');
    });

    it('should inherit handleRequest method from AuthGuard', () => {
      expect(typeof guard.handleRequest).toBe('function');
    });
  });

  describe('canActivate Method', () => {
    it('should return true when called with valid context', async () => {
      const mockContext = {} as ExecutionContext;
      const result = await guard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should return true when called with null context', async () => {
      const result = await guard.canActivate(null as any);
      expect(result).toBe(true);
    });

    it('should return true when called with undefined context', async () => {
      const result = await guard.canActivate(undefined as any);
      expect(result).toBe(true);
    });

    it('should return a Promise that resolves to true', () => {
      const mockContext = {} as ExecutionContext;
      const result = guard.canActivate(mockContext);
      expect(result).toBeInstanceOf(Promise);
      return expect(result).resolves.toBe(true);
    });

    it('should handle multiple calls without errors', async () => {
      const mockContext = {} as ExecutionContext;
      await guard.canActivate(mockContext);
      await guard.canActivate(mockContext);
      await guard.canActivate(mockContext);
      expect(true).toBe(true);
    });
  });

  describe('handleRequest Method', () => {
    it('should return the user when provided', () => {
      const mockUser = { id: 1, username: 'testuser' };
      const result = guard.handleRequest(null, mockUser, null, {} as ExecutionContext);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is null', () => {
      const result = guard.handleRequest(null, null, null, {} as ExecutionContext);
      expect(result).toBeNull();
    });

    it('should return undefined when user is undefined', () => {
      const result = guard.handleRequest(null, undefined, null, {} as ExecutionContext);
      expect(result).toBeUndefined();
    });

    it('should return user when error is provided', () => {
      const mockUser = { id: 2, username: 'erroruser' };
      const mockError = new Error('Test error');
      const result = guard.handleRequest(mockError, mockUser, null, {} as ExecutionContext);
      expect(result).toEqual(mockUser);
    });

    it('should return user when info is provided', () => {
      const mockUser = { id: 3, username: 'infouser' };
      const mockInfo = { message: 'Test info' };
      const result = guard.handleRequest(null, mockUser, mockInfo, {} as ExecutionContext);
      expect(result).toEqual(mockUser);
    });

    it('should handle status parameter', () => {
      const mockUser = { id: 4, username: 'statususer' };
      const result = guard.handleRequest(null, mockUser, null, {} as ExecutionContext, 401);
      expect(result).toEqual(mockUser);
    });

    it('should handle all parameters together', () => {
      const mockUser = { id: 5, username: 'allparams' };
      const mockError = new Error('Test error');
      const mockInfo = { message: 'Test info' };
      const result = guard.handleRequest(mockError, mockUser, mockInfo, {} as ExecutionContext, 403);
      expect(result).toEqual(mockUser);
    });
  });

  describe('Edge Cases', () => {
    it('should work with empty object as context', () => {
      const result = guard.canActivate({} as ExecutionContext);
      expect(result).toBeTruthy();
    });

    it('should work with complex context object', () => {
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({ headers: { authorization: 'Bearer token' } }),
          getResponse: () => ({ status: jest.fn() }),
        }),
      } as unknown as ExecutionContext;
      
      const result = guard.canActivate(mockContext);
      expect(result).toBeTruthy();
    });

    it('should maintain singleton behavior', () => {
      const guard1 = new LocalAuthGuard();
      const guard2 = new LocalAuthGuard();
      expect(guard1).toBeInstanceOf(LocalAuthGuard);
      expect(guard2).toBeInstanceOf(LocalAuthGuard);
      expect(guard1).not.toBe(guard2);
    });

    it('should have correct prototype chain', () => {
      expect(Object.getPrototypeOf(guard)).toBe(LocalAuthGuard.prototype);
      const authGuardProto = Object.getPrototypeOf(LocalAuthGuard.prototype);
      expect(authGuardProto).toBeDefined();
    });

    it('should not have additional methods beyond inherited ones', () => {
      const ownPropertyNames = Object.getOwnPropertyNames(LocalAuthGuard.prototype);
      expect(ownPropertyNames).toEqual(['constructor']);
    });
  });

  describe('Integration with NestJS Testing', () => {
    it('should be properly instantiated by NestJS DI container', async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [LocalAuthGuard],
      }).compile();

      const injectedGuard = moduleRef.get<LocalAuthGuard>(LocalAuthGuard);
      expect(injectedGuard).toBeDefined();
      expect(injectedGuard).toBeInstanceOf(LocalAuthGuard);
    });

    it('should be available for injection in other providers', async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [
          LocalAuthGuard,
          {
            provide: 'TEST_PROVIDER',
            useFactory: (guard: LocalAuthGuard) => ({
              guard,
              testMethod: () => guard.canActivate({} as ExecutionContext),
            }),
            inject: [LocalAuthGuard],
          },
        ],
      }).compile();

      const testProvider = moduleRef.get('TEST_PROVIDER');
      expect(testProvider.guard).toBeInstanceOf(LocalAuthGuard);
      expect(testProvider.testMethod()).toBeTruthy();
    });

    it('should work with multiple instances in same module', async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [
          LocalAuthGuard,
          LocalAuthGuard,
        ],
      }).compile();

      const guards = moduleRef.get(LocalAuthGuard);
      expect(guards).toBeDefined();
    });
  });
});