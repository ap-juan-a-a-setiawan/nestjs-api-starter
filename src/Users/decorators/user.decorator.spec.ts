import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.decorator';

jest.mock('@nestjs/common', () => ({
  createParamDecorator: jest.fn((fn) => fn),
}));

describe('UserDecorator', () => {
  let mockExecutionContext: jest.Mocked<ExecutionContext>;
  let mockRequest: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      user: {
        id: 'user-123',
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

  describe('User decorator factory function', () => {
    it('should be created with createParamDecorator', () => {
      expect(createParamDecorator).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should return the user object from the request', () => {
      const result = User(undefined, mockExecutionContext);
      expect(result).toEqual(mockRequest.user);
    });

    it('should call switchToHttp and getRequest methods', () => {
      User(undefined, mockExecutionContext);

      expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
      expect(mockExecutionContext.switchToHttp().getRequest).toHaveBeenCalled();
    });

    it('should return undefined when request has no user property', () => {
      mockRequest = {};
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as jest.Mocked<ExecutionContext>;

      const result = User(undefined, mockExecutionContext);
      expect(result).toBeUndefined();
    });

    it('should return null when request.user is null', () => {
      mockRequest = { user: null };
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as jest.Mocked<ExecutionContext>;

      const result = User(undefined, mockExecutionContext);
      expect(result).toBeNull();
    });

    it('should handle data parameter without affecting the result', () => {
      const data = { some: 'data' };
      const result = User(data, mockExecutionContext);
      expect(result).toEqual(mockRequest.user);
    });

    it('should handle different user object shapes', () => {
      const customUser = {
        username: 'john_doe',
        permissions: ['read', 'write'],
        metadata: { lastLogin: '2024-01-01' },
      };
      mockRequest = { user: customUser };
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as jest.Mocked<ExecutionContext>;

      const result = User(undefined, mockExecutionContext);
      expect(result).toEqual(customUser);
    });

    it('should handle empty user object', () => {
      mockRequest = { user: {} };
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as jest.Mocked<ExecutionContext>;

      const result = User(undefined, mockExecutionContext);
      expect(result).toEqual({});
    });

    it('should handle request without switchToHttp method', () => {
      mockExecutionContext = {} as unknown as jest.Mocked<ExecutionContext>;

      expect(() => User(undefined, mockExecutionContext)).toThrow();
    });

    it('should handle getRequest returning undefined', () => {
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(undefined),
        }),
      } as unknown as jest.Mocked<ExecutionContext>;

      const result = User(undefined, mockExecutionContext);
      expect(result).toBeUndefined();
    });

    it('should handle getRequest throwing an error', () => {
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockImplementation(() => {
            throw new Error('Request retrieval failed');
          }),
        }),
      } as unknown as jest.Mocked<ExecutionContext>;

      expect(() => User(undefined, mockExecutionContext)).toThrow(
        'Request retrieval failed',
      );
    });

    it('should handle switchToHttp throwing an error', () => {
      mockExecutionContext = {
        switchToHttp: jest.fn().mockImplementation(() => {
          throw new Error('HTTP context unavailable');
        }),
      } as unknown as jest.Mocked<ExecutionContext>;

      expect(() => User(undefined, mockExecutionContext)).toThrow(
        'HTTP context unavailable',
      );
    });

    it('should handle complex nested user objects', () => {
      const complexUser = {
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          address: {
            street: '123 Main St',
            city: 'Springfield',
            country: 'USA',
          },
        },
        settings: {
          theme: 'dark',
          notifications: {
            email: true,
            push: false,
          },
        },
        createdAt: new Date('2024-01-01T00:00:00Z'),
      };
      mockRequest = { user: complexUser };
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as jest.Mocked<ExecutionContext>;

      const result = User(undefined, mockExecutionContext);
      expect(result).toEqual(complexUser);
    });

    it('should handle user object with array properties', () => {
      const userWithArrays = {
        tags: ['admin', 'moderator'],
        permissions: ['create', 'read', 'update', 'delete'],
        scores: [95, 87, 92],
      };
      mockRequest = { user: userWithArrays };
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as jest.Mocked<ExecutionContext>;

      const result = User(undefined, mockExecutionContext);
      expect(result).toEqual(userWithArrays);
    });

    it('should handle user object with boolean and number values', () => {
      const userWithPrimitives = {
        isActive: true,
        isVerified: false,
        age: 30,
        loginCount: 42,
        rating: 4.5,
      };
      mockRequest = { user: userWithPrimitives };
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as jest.Mocked<ExecutionContext>;

      const result = User(undefined, mockExecutionContext);
      expect(result).toEqual(userWithPrimitives);
    });

    it('should handle user object with Date objects', () => {
      const userWithDates = {
        createdAt: new Date('2024-01-15T10:30:00Z'),
        updatedAt: new Date('2024-02-20T15:45:00Z'),
        lastLogin: new Date('2024-03-01T08:00:00Z'),
      };
      mockRequest = { user: userWithDates };
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as jest.Mocked<ExecutionContext>;

      const result = User(undefined, mockExecutionContext);
      expect(result).toEqual(userWithDates);
    });

    it('should handle user object with nested null values', () => {
      const userWithNulls = {
        profile: null,
        settings: {
          theme: 'light',
          preferences: null,
        },
        metadata: {
          lastLogin: null,
          ipAddress: '192.168.1.1',
        },
      };
      mockRequest = { user: userWithNulls };
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as jest.Mocked<ExecutionContext>;

      const result = User(undefined, mockExecutionContext);
      expect(result).toEqual(userWithNulls);
    });

    it('should handle user object with undefined values', () => {
      const userWithUndefined = {
        name: 'John Doe',
        email: undefined,
        phone: undefined,
        address: {
          street: '123 Main St',
          zipCode: undefined,
        },
      };
      mockRequest = { user: userWithUndefined };
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as jest.Mocked<ExecutionContext>;

      const result = User(undefined, mockExecutionContext);
      expect(result).toEqual(userWithUndefined);
    });
  });
});