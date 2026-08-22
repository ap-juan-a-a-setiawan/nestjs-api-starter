typescript
import { Test } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

jest.mock('@nestjs/passport', () => {
  const mockCanActivate = jest.fn().mockReturnValue(true);
  const mockGetAuthenticateOptions = jest.fn().mockReturnValue({});
  const mockHandleRequest = jest.fn().mockImplementation((err: unknown, user: unknown, _info: unknown) => {
    if (err) {
      throw err;
    }
    return user;
  });
  const mockLogIn = jest.fn().mockResolvedValue(undefined);
  const mockLogOut = jest.fn().mockResolvedValue(undefined);

  return {
    AuthGuard: jest.fn().mockImplementation((_type: string) => {
      return class MockAuthGuard {
        canActivate = mockCanActivate;
        getAuthenticateOptions = mockGetAuthenticateOptions;
        handleRequest = mockHandleRequest;
        logIn = mockLogIn;
        logOut = mockLogOut;
      };
    }),
  };
});

const authGuardMock = AuthGuard as jest.Mock;
const mockAuthGuardClass = authGuardMock.mock.results[0].value;
const authGuardStrategy = authGuardMock.mock.calls[0][0];

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [JwtAuthGuard],
    }).compile();

    guard = moduleRef.get<JwtAuthGuard>(JwtAuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should call AuthGuard with "jwt" strategy', () => {
    expect(authGuardStrategy).toBe('jwt');
  });

  it('should extend the class returned by AuthGuard("jwt")', () => {
    expect(guard).toBeInstanceOf(mockAuthGuardClass);
  });

  describe('canActivate', () => {
    it('should return true for a valid context', () => {
      const context = {
        switchToHttp: () => ({ getRequest: () => ({}) }),
      };
      expect(guard.canActivate(context)).toBe(true);
    });

    it('should return true even without context', () => {
      expect(guard.canActivate(undefined)).toBe(true);
    });
  });

  describe('getAuthenticateOptions', () => {
    it('should return an empty object', () => {
      const context = {};
      expect(guard.getAuthenticateOptions(context)).toEqual({});
    });
  });

  describe('handleRequest', () => {
    it('should return the user when no error is provided', () => {
      const user = { id: 1, username: 'test' };
      expect(guard.handleRequest(null, user, null)).toBe(user);
    });

    it('should throw the error when an error is provided', () => {
      const error = new Error('Unauthorized');
      expect(() => guard.handleRequest(error, null, null)).toThrow(error);
    });
  });

  describe('logIn', () => {
    it('should resolve successfully', async () => {
      const request = {};
      await expect(guard.logIn(request)).resolves.toBeUndefined();
    });
  });

  describe('logOut', () => {
    it('should resolve successfully', async () => {
      const request = {};
      await expect(guard.logOut(request)).resolves.toBeUndefined();
    });
  });
});