typescript
import { Test } from '@nestjs/testing';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.decorator';

let mockCapturedFactory: any;

jest.mock('@nestjs/common', () => ({
  createParamDecorator: jest.fn().mockImplementation((factory: any) => {
    mockCapturedFactory = factory;
    return (data?: any) => {
      return (target: any, key: string, index: number) => {
        // no-op
      };
    };
  }),
}));

describe('User Decorator', () => {
  it('should call createParamDecorator with a factory function', () => {
    expect(createParamDecorator).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should create a testing module', async () => {
    const moduleRef = await Test.createTestingModule({}).compile();
    expect(moduleRef).toBeDefined();
  });

  describe('factory', () => {
    it('should return the user from the request', () => {
      const mockUser = { id: 1, name: 'John Doe' };
      const mockRequest = { user: mockUser };
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      const result = mockCapturedFactory(undefined, mockContext);
      expect(result).toBe(mockUser);
    });

    it('should return undefined when request.user is undefined', () => {
      const mockRequest = {};
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      const result = mockCapturedFactory('some-data', mockContext);
      expect(result).toBeUndefined();
    });

    it('should return null when request.user is null', () => {
      const mockRequest = { user: null };
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      const result = mockCapturedFactory(undefined, mockContext);
      expect(result).toBeNull();
    });

    it('should throw when request is undefined', () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(undefined),
        }),
      } as unknown as ExecutionContext;

      expect(() => mockCapturedFactory(undefined, mockContext)).toThrow();
    });

    it('should throw when switchToHttp is not a function', () => {
      const mockContext = {} as ExecutionContext;

      expect(() => mockCapturedFactory(undefined, mockContext)).toThrow();
    });

    it('should throw when context is undefined', () => {
      expect(() => mockCapturedFactory(undefined, undefined as any)).toThrow();
    });

    it('should ignore the data parameter and always return request.user', () => {
      const mockUser = { id: 2, name: 'Jane Doe' };
      const mockRequest = { user: mockUser };
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      expect(mockCapturedFactory('data1', mockContext)).toBe(mockUser);
      expect(mockCapturedFactory(123, mockContext)).toBe(mockUser);
      expect(mockCapturedFactory(null, mockContext)).toBe(mockUser);
    });
  });
});