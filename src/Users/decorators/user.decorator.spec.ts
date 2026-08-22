import { createParamDecorator, ExecutionContext } } from '@nestjs/common';
import { User } from './user.decorator';

describe('User Decorator', () => {
  describe('createParamDecorator', () => {
    let mockExecutionContext: jest.Mocked<ExecutionContext>;
    let mockSwitchToHttp: jest.Mock;
    let mockRequest: jest.Mock;

    beforeEach(() => {
      mockSwitchToHttp = jest.fn();
      mockRequest = jest.fn();
      
      mockExecutionContext = {
        switchToHttp: mockSwitchToHttp,
      } as unknown as jest.Mocked<ExecutionContext>;

      mockSwitchToHttp.mockReturnValue({
        getRequest: mockRequest,
      });
    });

    it('should be defined', () => {
      expect(User).toBeDefined();
    });

    it('should return the user object from the request', () => {
      const mockUser = { id: 1, username: 'testuser' };
      mockRequest.mockReturnValue({ user: mockUser });

      const decoratorFactory = (User as unknown as { 
        factory: (data: unknown, ctx: ExecutionContext) => any 
      }).factory;

      const result = decoratorFactory(null, mockExecutionContext);

      expect(mockSwitchToHttp).toHaveBeenCalled();
      expect(mockRequest).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should return undefined when user is not present in request', () => {
      mockRequest.mockReturnValue({});

      const decoratorFactory = (User as unknown as { 
        factory: (data: unknown, ctx: ExecutionContext) => any 
      }).factory;

      const result = decoratorFactory(null, mockExecutionContext);

      expect(result).toBeUndefined();
    });

    it('should return null when user is null in request', () => {
      mockRequest.mockReturnValue({ user: null });

      const decoratorFactory = (User as unknown as { 
        factory: (data: unknown, ctx: ExecutionContext) => any 
      }).factory;

      const result = decoratorFactory(null, mockExecutionContext);

      expect(result).toBeNull();
    });

    it('should handle the data parameter without affecting the result', () => {
      const mockUser = { id: 2, username: 'anotheruser' };
      mockRequest.mockReturnValue({ user: mockUser });

      const decoratorFactory = (User as unknown as { 
        factory: (data: unknown, ctx: ExecutionContext) => any 
      }).factory;

      const result = decoratorFactory('some-data', mockExecutionContext);

      expect(result).toEqual(mockUser);
    });

    it('should handle complex user objects', () => {
      const mockUser = {
        id: 3,
        username: 'complexuser',
        roles: ['admin', 'editor'],
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com'
        },
        createdAt: new Date('2023-01-01'),
        isActive: true
      };
      mockRequest.mockReturnValue({ user: mockUser });

      const decoratorFactory = (User as unknown as { 
        factory: (data: unknown, ctx: ExecutionContext) => any 
      }).factory;

      const result = decoratorFactory(null, mockExecutionContext);

      expect(result).toEqual(mockUser);
      expect(result.roles).toHaveLength(2);
      expect(result.profile.firstName).toBe('John');
      expect(result.isActive).toBe(true);
    });

    it('should handle request with additional properties', () => {
      const mockUser = { id: 4, username: 'testuser4' };
      mockRequest.mockReturnValue({ 
        user: mockUser,
        headers: { authorization: 'Bearer token' },
        query: { page: 1 },
        params: { id: 4 }
      });

      const decoratorFactory = (User as unknown as { 
        factory: (data: unknown, ctx: ExecutionContext) => any 
      }).factory;

      const result = decoratorFactory(null, mockExecutionContext);

      expect(result).toEqual(mockUser);
    });

    it('should throw an error if switchToHttp is not available', () => {
      const invalidContext = {} as ExecutionContext;

      const decoratorFactory = (User as unknown as { 
        factory: (data: unknown, ctx: ExecutionContext) => any 
      }).factory;

      expect(() => decoratorFactory(null, invalidContext)).toThrow();
    });

    it('should throw an error if getRequest is not available', () => {
      mockSwitchToHttp.mockReturnValue({});

      const decoratorFactory = (User as unknown as { 
        factory: (data: unknown, ctx: ExecutionContext) => any 
      }).factory;

      expect(() => decoratorFactory(null, mockExecutionContext)).toThrow();
    });

    it('should handle empty user object', () => {
      mockRequest.mockReturnValue({ user: {} });

      const decoratorFactory = (User as unknown as { 
        factory: (data: unknown, ctx: ExecutionContext) => any 
      }).factory;

      const result = decoratorFactory(null, mockExecutionContext);

      expect(result).toEqual({});
      expect(Object.keys(result)).toHaveLength(0);
    });

    it('should handle user object with nested null values', () => {
      const mockUser = { 
        id: 5, 
        username: 'testuser5',
        profile: null,
        settings: null
      };
      mockRequest.mockReturnValue({ user: mockUser });

      const decoratorFactory = (User as unknown as { 
        factory: (data: unknown, ctx: ExecutionContext) => any 
      }).factory;

      const result = decoratorFactory(null, mockExecutionContext);

      expect(result).toEqual(mockUser);
      expect(result.profile).toBeNull();
      expect(result.settings).toBeNull();
    });

    it('should handle user object with array properties', () => {
      const mockUser = { 
        id: 6, 
        username: 'testuser6',
        permissions: ['read', 'write', 'delete'],
        tags: ['admin', 'user']
      };
      mockRequest.mockReturnValue({ user: mockUser });

      const decoratorFactory = (User as unknown as { 
        factory: (data: unknown, ctx: ExecutionContext) => any 
      }).factory;

      const result = decoratorFactory(null, mockExecutionContext);

      expect(result).toEqual(mockUser);
      expect(result.permissions).toHaveLength(3);
      expect(result.tags).toContain('admin');
    });

    it('should handle user object with date properties', () => {
      const mockUser = { 
        id: 7, 
        username: 'testuser7',
        lastLogin: new Date('2023-06-15T10:30:00Z'),
        expiresAt: new Date('2024-06-15T10:30:00Z')
      };
      mockRequest.mockReturnValue({ user: mockUser });

      const decoratorFactory = (User as unknown as { 
        factory: (data: unknown, ctx: ExecutionContext) => any 
      }).factory;

      const result = decoratorFactory(null, mockExecutionContext);

      expect(result).toEqual(mockUser);
      expect(result.lastLogin).toBeInstanceOf(Date);
      expect(result.expiresAt).toBeInstanceOf(Date);
    });

    it('should handle user object with boolean properties', () => {
      const mockUser = { 
        id: 8, 
        username: 'testuser8',
        isAdmin: true,
        isVerified: false,
        isDeleted: false
      };
      mockRequest.mockReturnValue({ user: mockUser });

      const decoratorFactory = (User as unknown as { 
        factory: (data: unknown, ctx: ExecutionContext) => any 
      }).factory;

      const result = decoratorFactory(null, mockExecutionContext);

      expect(result).toEqual(mockUser);
      expect(result.isAdmin).toBe(true);
      expect(result.isVerified).toBe(false);
      expect(result.isDeleted).toBe(false);
    });

    it('should handle user object with numeric properties', () => {
      const mockUser = { 
        id: 9, 
        username: 'testuser9',
        age: 25,
        score: 98.5,
        attempts: 0
      };
      mockRequest.mockReturnValue({ user: mockUser });

      const decoratorFactory = (User as unknown as { 
        factory: (data: unknown, ctx: ExecutionContext) => any 
      }).factory;

      const result = decoratorFactory(null, mockExecutionContext);

      expect(result).toEqual(mockUser);
      expect(result.age).toBe(25);
      expect(result.score).toBe(98.5);
      expect(result.attempts).toBe(0);
    });

    it('should handle user object with string properties', () => {
      const mockUser = { 
        id: 10, 
        username: 'testuser10',
        email: 'test@example.com',
        phone: '+1234567890',
        address: '123 Main St'
      };
      mockRequest.mockReturnValue({ user: mockUser });

      const decoratorFactory = (User as unknown as { 
        factory: (data: unknown, ctx: ExecutionContext) => any 
      }).factory;

      const result = decoratorFactory(null, mockExecutionContext);

      expect(result).toEqual(mockUser);
      expect(result.email).toContain('@');
      expect(result.phone).toMatch(/^\+/);
      expect(result.address).toContain('Main St');
    });
  });
});