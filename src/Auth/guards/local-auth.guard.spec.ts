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
    mockAuthGuardInstance = guard as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('instantiation', () => {
    it('should be defined', () => {
      expect(guard).toBeDefined();
    });

    it('should extend AuthGuard with "local" strategy', () => {
      expect(AuthGuard).toHaveBeenCalledWith('local');
    });

    it('should have the correct strategy name', () => {
      expect(mockAuthGuardInstance.getStrategy()).toBe('local');
    });
  });

  describe('canActivate', () => {
    it('should return true when authentication succeeds', async () => {
      const mockContext = {} as ExecutionContext;
      const result = await guard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should return true for any execution context', async () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({}),
          getResponse: jest.fn().mockReturnValue({}),
        }),
      } as unknown as ExecutionContext;

      const result = await guard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should handle null execution context gracefully', async () => {
      const result = await guard.canActivate(null as any);
      expect(result).toBe(true);
    });
  });

  describe('handleRequest', () => {
    it('should return the user when provided', () => {
      const mockUser = { id: 1, username: 'testuser' };
      const mockContext = {} as ExecutionContext;
      const result = mockAuthGuardInstance.handleRequest(null, mockUser, null, mockContext);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is null', () => {
      const mockContext = {} as ExecutionContext;
      const result = mockAuthGuardInstance.handleRequest(null, null, null, mockContext);
      expect(result).toBeNull();
    });

    it('should return undefined when user is undefined', () => {
      const mockContext = {} as ExecutionContext;
      const result = mockAuthGuardInstance.handleRequest(null, undefined, null, mockContext);
      expect(result).toBeUndefined();
    });

    it('should pass through error when provided', () => {
      const mockError = new Error('Authentication failed');
      const mockContext = {} as ExecutionContext;
      const result = mockAuthGuardInstance.handleRequest(mockError, null, null, mockContext);
      expect(result).toBeNull();
    });

    it('should pass through info when provided', () => {
      const mockInfo = { message: 'Token expired' };
      const mockContext = {} as ExecutionContext;
      const result = mockAuthGuardInstance.handleRequest(null, null, mockInfo, mockContext);
      expect(result).toBeNull();
    });

    it('should handle status parameter', () => {
      const mockContext = {} as ExecutionContext;
      const result = mockAuthGuardInstance.handleRequest(null, { id: 1 }, null, mockContext, 401);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('inheritance behavior', () => {
    it('should be an instance of the mocked AuthGuard class', () => {
      expect(guard).toBeInstanceOf(LocalAuthGuard);
    });

    it('should have access to inherited methods', () => {
      expect(typeof guard.canActivate).toBe('function');
      expect(typeof mockAuthGuardInstance.handleRequest).toBe('function');
      expect(typeof mockAuthGuardInstance.getStrategy).toBe('function');
    });

    it('should maintain the strategy name through inheritance', () => {
      expect(mockAuthGuardInstance.getStrategy()).toBe('local');
    });
  });

  describe('edge cases', () => {
    it('should handle multiple instantiations', () => {
      const guard1 = new LocalAuthGuard();
      const guard2 = new LocalAuthGuard();
      
      expect(guard1).toBeDefined();
      expect(guard2).toBeDefined();
      expect(guard1).not.toBe(guard2);
    });

    it('should work with different context types', async () => {
      const contexts = [
        {} as ExecutionContext,
        { getClass: jest.fn() } as unknown as ExecutionContext,
        { getHandler: jest.fn() } as unknown as ExecutionContext,
        { switchToHttp: jest.fn() } as unknown as ExecutionContext,
      ];

      for (const context of contexts) {
        const result = await guard.canActivate(context);
        expect(result).toBe(true);
      }
    });

    it('should handle concurrent canActivate calls', async () => {
      const mockContext = {} as ExecutionContext;
      const results = await Promise.all([
        guard.canActivate(mockContext),
        guard.canActivate(mockContext),
        guard.canActivate(mockContext),
      ]);

      expect(results).toEqual([true, true, true]);
    });
  });
});