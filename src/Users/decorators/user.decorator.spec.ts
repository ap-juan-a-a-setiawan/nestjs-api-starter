import { createParamDecorator, ExecutionContext } } from '@nestjs/common';
import { User } from './user.decorator';

jest.mock('@nestjs/common', () => ({
  createParamDecorator: jest.fn().mockImplementation((fn) => fn),
}));

describe('UserDecorator', () => {
  let mockExecutionContext: jest.Mocked<ExecutionContext>;
  let mockRequest: any;

  beforeEach(() => {
    mockRequest = {
      user: {
        id: 1,
        email: 'test@example.com',
        roles: ['admin'],
      },
    };

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as unknown as jest.Mocked<ExecutionContext>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('User decorator factory function', () => {
    it('should be defined', () => {
      expect(User).toBeDefined();
    });

    it('should return the user object from the request', () => {
      const result = User(undefined, mockExecutionContext);
      expect(result).toEqual(mockRequest.user);
    });

    it('should return undefined when request has no user property', () => {
      mockRequest = {};
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue(mockRequest);

      const result = User(undefined, mockExecutionContext);
      expect(result).toBeUndefined();
    });

    it('should return null when request.user is null', () => {
      mockRequest.user = null;
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue(mockRequest);

      const result = User(undefined, mockExecutionContext);
      expect(result).toBeNull();
    });

    it('should return the user object when data parameter is provided', () => {
      const data = 'some-data';
      const result = User(data, mockExecutionContext);
      expect(result).toEqual(mockRequest.user);
    });

    it('should handle missing request object', () => {
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue(undefined);

      const result = User(undefined, mockExecutionContext);
      expect(result).toBeUndefined();
    });

    it('should handle null request object', () => {
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue(null);

      const result = User(undefined, mockExecutionContext);
      expect(result).toBeUndefined();
    });

    it('should call switchToHttp and getRequest methods', () => {
      User(undefined, mockExecutionContext);

      expect(mockExecutionContext.switchToHttp).toHaveBeenCalledTimes(1);
      expect(mockExecutionContext.switchToHttp().getRequest).toHaveBeenCalledTimes(1);
    });

    it('should return the exact user object reference', () => {
      const userObject = { id: 123, name: 'John Doe' };
      mockRequest.user = userObject;
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue(mockRequest);

      const result = User(undefined, mockExecutionContext);
      expect(result).toBe(userObject);
    });

    it('should work with complex user objects', () => {
      const complexUser = {
        id: 1,
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          address: {
            street: '123 Main St',
            city: 'Anytown',
          },
        },
        permissions: ['read', 'write', 'delete'],
        metadata: {
          lastLogin: new Date('2024-01-01'),
          isActive: true,
        },
      };
      mockRequest.user = complexUser;
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue(mockRequest);

      const result = User(undefined, mockExecutionContext);
      expect(result).toEqual(complexUser);
      expect(result.profile.firstName).toBe('John');
      expect(result.permissions).toContain('write');
      expect(result.metadata.isActive).toBe(true);
    });

    it('should handle request with user as empty object', () => {
      mockRequest.user = {};
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue(mockRequest);

      const result = User(undefined, mockExecutionContext);
      expect(result).toEqual({});
    });

    it('should handle request with user as primitive value', () => {
      mockRequest.user = 'user-string';
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue(mockRequest);

      const result = User(undefined, mockExecutionContext);
      expect(result).toBe('user-string');
    });

    it('should handle request with user as number', () => {
      mockRequest.user = 42;
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue(mockRequest);

      const result = User(undefined, mockExecutionContext);
      expect(result).toBe(42);
    });

    it('should handle request with user as boolean', () => {
      mockRequest.user = true;
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue(mockRequest);

      const result = User(undefined, mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should handle request with user as array', () => {
      mockRequest.user = [1, 2, 3];
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue(mockRequest);

      const result = User(undefined, mockExecutionContext);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle switchToHttp throwing an error', () => {
      mockExecutionContext.switchToHttp.mockImplementation(() => {
        throw new Error('HTTP context not available');
      });

      expect(() => User(undefined, mockExecutionContext)).toThrow('HTTP context not available');
    });

    it('should handle getRequest throwing an error', () => {
      mockExecutionContext.switchToHttp().getRequest.mockImplementation(() => {
        throw new Error('Request not available');
      });

      expect(() => User(undefined, mockExecutionContext)).toThrow('Request not available');
    });

    it('should handle undefined execution context', () => {
      expect(() => User(undefined, undefined as any)).toThrow();
    });

    it('should handle null execution context', () => {
      expect(() => User(undefined, null as any)).toThrow();
    });
  });
});