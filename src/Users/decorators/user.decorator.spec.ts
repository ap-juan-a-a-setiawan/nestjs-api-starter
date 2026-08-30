import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.decorator';

jest.mock('@nestjs/common', () => ({
  createParamDecorator: jest.fn((fn: Function) => fn),
}));

describe('UserDecorator', () => {
  let mockExecutionContext: jest.Mocked<ExecutionContext>;
  let mockRequest: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      user: {
        id: '123',
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

  describe('User decorator', () => {
    it('should be defined', () => {
      expect(User).toBeDefined();
    });

    it('should return the user object from the request', () => {
      const result = User('data', mockExecutionContext);
      expect(result).toEqual(mockRequest.user);
    });

    it('should call switchToHttp and getRequest methods', () => {
      User('data', mockExecutionContext);

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

      const result = User('data', mockExecutionContext);
      expect(result).toBeUndefined();
    });

    it('should return null when request.user is null', () => {
      mockRequest = { user: null };
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as jest.Mocked<ExecutionContext>;

      const result = User('data', mockExecutionContext);
      expect(result).toBeNull();
    });

    it('should handle different data parameter values', () => {
      const dataValues = [undefined, null, 'string', 123, {}, [], true];

      dataValues.forEach((data) => {
        const result = User(data, mockExecutionContext);
        expect(result).toEqual(mockRequest.user);
      });
    });

    it('should handle complex user objects', () => {
      const complexUser = {
        id: '456',
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

      mockRequest = { user: complexUser };
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as jest.Mocked<ExecutionContext>;

      const result = User('data', mockExecutionContext);
      expect(result).toEqual(complexUser);
    });

    it('should handle request with additional properties', () => {
      mockRequest = {
        user: { id: '789' },
        headers: { authorization: 'Bearer token' },
        query: { page: 1 },
        params: { id: '123' },
        body: { name: 'Test' },
      };

      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as jest.Mocked<ExecutionContext>;

      const result = User('data', mockExecutionContext);
      expect(result).toEqual({ id: '789' });
    });

    it('should handle empty user object', () => {
      mockRequest = { user: {} };
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as jest.Mocked<ExecutionContext>;

      const result = User('data', mockExecutionContext);
      expect(result).toEqual({});
    });

    it('should handle user with primitive values', () => {
      const primitiveUsers = [
        { user: 'string-user' },
        { user: 123 },
        { user: true },
        { user: ['array', 'user'] },
      ];

      primitiveUsers.forEach((request) => {
        mockExecutionContext = {
          switchToHttp: jest.fn().mockReturnValue({
            getRequest: jest.fn().mockReturnValue(request),
          }),
        } as unknown as jest.Mocked<ExecutionContext>;

        const result = User('data', mockExecutionContext);
        expect(result).toEqual(request.user);
      });
    });

    it('should handle missing switchToHttp method', () => {
      mockExecutionContext = {} as jest.Mocked<ExecutionContext>;

      expect(() => User('data', mockExecutionContext)).toThrow();
    });

    it('should handle missing getRequest method', () => {
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({}),
      } as unknown as jest.Mocked<ExecutionContext>;

      expect(() => User('data', mockExecutionContext)).toThrow();
    });

    it('should handle switchToHttp returning null', () => {
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue(null),
      } as unknown as jest.Mocked<ExecutionContext>;

      expect(() => User('data', mockExecutionContext)).toThrow();
    });

    it('should handle getRequest returning null', () => {
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(null),
        }),
      } as unknown as jest.Mocked<ExecutionContext>;

      const result = User('data', mockExecutionContext);
      expect(result).toBeNull();
    });
  });
});