typescript
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './user.decorator';

var mockCreateParamDecorator: jest.Mock;

jest.mock('@nestjs/common', () => {
  mockCreateParamDecorator = jest.fn((factory: any) => factory);
  return { createParamDecorator: mockCreateParamDecorator };
});

describe('UserDecorator', () => {
  let testingModule: TestingModule;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({}).compile();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  it('should create a testing module', () => {
    expect(testingModule).toBeDefined();
  });

  it('should be defined', () => {
    expect(User).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof User).toBe('function');
  });

  it('should call createParamDecorator with a factory function', () => {
    expect(mockCreateParamDecorator).toHaveBeenCalledTimes(1);
    expect(mockCreateParamDecorator).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should return the user from the request', () => {
    const request = { user: { id: 1, name: 'John Doe' } };
    const ctx = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
      }),
    } as any;

    const result = User('data', ctx);

    expect(result).toEqual(request.user);
    expect(ctx.switchToHttp).toHaveBeenCalled();
    expect(ctx.switchToHttp().getRequest).toHaveBeenCalled();
  });

  it('should return undefined when request.user is undefined', () => {
    const ctx = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
      }),
    } as any;

    expect(User('data', ctx)).toBeUndefined();
  });

  it('should return null when request.user is null', () => {
    const ctx = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user: null }),
      }),
    } as any;

    expect(User('data', ctx)).toBeNull();
  });

  it('should ignore the data parameter', () => {
    const request = { user: { id: 42 } };
    const ctx = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
      }),
    } as any;

    expect(User('ignored', ctx)).toEqual({ id: 42 });
    expect(User({ some: 'data' }, ctx)).toEqual({ id: 42 });
    expect(User(null, ctx)).toEqual({ id: 42 });
  });

  it('should return falsy user values as-is', () => {
    const ctx = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user: '' }),
      }),
    } as any;

    expect(User('', ctx)).toBe('');
  });

  it('should throw when request is missing', () => {
    const ctx = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(undefined),
      }),
    } as any;

    expect(() => User('data', ctx)).toThrow();
  });
});