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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('User decorator', () => {
    it('should be defined', () => {
      expect(User).toBeDefined();
    });

    it('should return the user object from the request', () => {
      const result = User('data', mockExecutionContext);
      expect(result).toEqual(mockRequest.user);
    });

    it('should call switchToHttp and getRequest', () => {
      User('data', mockExecutionContext);
      expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
      expect(mockExecutionContext.switchToHttp().getRequest).toHaveBeenCalled();
    });

    it('should return undefined when request has no user property', () => {
      mockRequest = {};
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue(mockRequest);
      
      const result = User('data', mockExecutionContext);
      expect(result).toBeUndefined();
    });

    it('should return null when request.user is null', () => {
      mockRequest = { user: null };
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue(mockRequest);
      
      const result = User('data', mockExecutionContext);
      expect(result).toBeNull();
    });

    it('should handle different data parameter values', () => {
      const testData = ['someData', 123, { key: 'value' }, null, undefined];
      
      testData.forEach((data) => {
        const result = User(data, mockExecutionContext);
        expect(result).toEqual(mockRequest.user);
      });
    });

    it('should handle request with additional properties', () => {
      mockRequest = {
        user: { id: '456', name: 'John Doe' },
        otherProperty: 'test',
        headers: { authorization: 'Bearer token' },
      };
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue(mockRequest);
      
      const result = User('data', mockExecutionContext);
      expect(result).toEqual({ id: '456', name: 'John Doe' });
    });

    it('should handle complex user objects', () => {
      const complexUser = {
        id: '789',
        profile: {
          firstName: 'Jane',
          lastName: 'Smith',
          address: {
            street: '123 Main St',
            city: 'Springfield',
          },
        },
        permissions: ['read', 'write', 'delete'],
        metadata: {
          lastLogin: new Date('2024-01-01'),
          isActive: true,
        },
      };
      
      mockRequest = { user: complexUser };
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue(mockRequest);
      
      const result = User('data', mockExecutionContext);
      expect(result).toEqual(complexUser);
    });

    it('should handle empty user object', () => {
      mockRequest = { user: {} };
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue(mockRequest);
      
      const result = User('data', mockExecutionContext);
      expect(result).toEqual({});
    });

    it('should handle request with user as primitive value', () => {
      mockRequest = { user: 'string-user' };
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue(mockRequest);
      
      const result = User('data', mockExecutionContext);
      expect(result).toBe('string-user');
    });

    it('should handle request with user as number', () => {
      mockRequest = { user: 12345 };
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue(mockRequest);
      
      const result = User('data', mockExecutionContext);
      expect(result).toBe(12345);
    });

    it('should handle request with user as boolean', () => {
      mockRequest = { user: true };
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue(mockRequest);
      
      const result = User('data', mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should handle request with user as array', () => {
      const userArray = [{ id: '1' }, { id: '2' }];
      mockRequest = { user: userArray };
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue(mockRequest);
      
      const result = User('data', mockExecutionContext);
      expect(result).toEqual(userArray);
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

    it('should handle getRequest returning undefined', () => {
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue(undefined);
      
      const result = User('data', mockExecutionContext);
      expect(result).toBeUndefined();
    });

    it('should handle getRequest returning null', () => {
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue(null);
      
      const result = User('data', mockExecutionContext);
      expect(result).toBeUndefined();
    });

    it('should handle getRequest throwing an error', () => {
      mockExecutionContext.switchToHttp().getRequest.mockImplementation(() => {
        throw new Error('Request retrieval failed');
      });
      
      expect(() => User('data', mockExecutionContext)).toThrow('Request retrieval failed');
    });

    it('should handle switchToHttp throwing an error', () => {
      mockExecutionContext.switchToHttp.mockImplementation(() => {
        throw new Error('HTTP context switch failed');
      });
      
      expect(() => User('data', mockExecutionContext)).toThrow('HTTP context switch failed');
    });
  });
});