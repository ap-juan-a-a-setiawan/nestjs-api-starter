typescript
import { Test } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { User } from './user.decorator';

describe('UserDecorator', () => {
  let mockRequest: any;
  let mockCtx: ExecutionContext;
  let switchToHttpMock: jest.Mock;
  let getRequestMock: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    getRequestMock = jest.fn().mockReturnValue(mockRequest);
    switchToHttpMock = jest.fn().mockReturnValue({ getRequest: getRequestMock });
    mockCtx = {
      switchToHttp: switchToHttpMock,
    } as unknown as ExecutionContext;
  });

  it('should be defined', () => {
    expect(User).toBeDefined();
  });

  it('should return request.user when request.user exists', () => {
    const user = { id: 1, name: 'John Doe' };
    mockRequest.user = user;

    const result = User('some data', mockCtx);

    expect(result).toBe(user);
    expect(switchToHttpMock).toHaveBeenCalledTimes(1);
    expect(getRequestMock).toHaveBeenCalledTimes(1);
  });

  it('should return undefined when request.user is not set', () => {
    const result = User('data', mockCtx);

    expect(result).toBeUndefined();
  });

  it('should return null when request.user is null', () => {
    mockRequest.user = null;

    const result = User(undefined, mockCtx);

    expect(result).toBeNull();
  });

  it('should return 0 when request.user is 0', () => {
    mockRequest.user = 0;

    const result = User(null, mockCtx);

    expect(result).toBe(0);
  });

  it('should return false when request.user is false', () => {
    mockRequest.user = false;

    const result = User(false, mockCtx);

    expect(result).toBe(false);
  });

  it('should return empty string when request.user is an empty string', () => {
    mockRequest.user = '';

    const result = User('ignored', mockCtx);

    expect(result).toBe('');
  });

  it('should return the full request.user object regardless of data parameter', () => {
    const user = { id: 42, email: 'test@example.com' };
    mockRequest.user = user;

    const dataVariations = [undefined, null, 'metadata', { key: 'value' }, 123, true];

    for (const data of dataVariations) {
      expect(User(data, mockCtx)).toBe(user);
    }
  });

  it('should call switchToHttp and getRequest exactly once when invoked', () => {
    User('data', mockCtx);

    expect(switchToHttpMock).toHaveBeenCalledTimes(1);
    expect(getRequestMock).toHaveBeenCalledTimes(1);
    expect(getRequestMock).toHaveBeenCalledWith();
  });

  it('should be usable with a NestJS testing module', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [],
    }).compile();

    expect(moduleRef).toBeDefined();
  });
});