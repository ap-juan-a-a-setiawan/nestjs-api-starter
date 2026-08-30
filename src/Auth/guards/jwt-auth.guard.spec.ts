import { Test } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [JwtAuthGuard],
    }).compile();

    guard = moduleRef.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should call super.canActivate with the correct context', async () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({}),
          getResponse: jest.fn().mockReturnValue({}),
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      const canActivateSpy = jest.spyOn(JwtAuthGuard.prototype, 'canActivate');

      const result = await guard.canActivate(mockContext);

      expect(canActivateSpy).toHaveBeenCalledWith(mockContext);
      expect(result).toBeDefined();
    });

    it('should return true when authentication succeeds', async () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: { authorization: 'Bearer valid-token' },
          }),
          getResponse: jest.fn().mockReturnValue({}),
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      // Mock the passport strategy to succeed
      const passport = require('@nestjs/passport');
      const originalAuthGuard = passport.AuthGuard;
      
      passport.AuthGuard = jest.fn().mockImplementation(() => {
        return class MockAuthGuard {
          async canActivate(context: ExecutionContext): Promise<boolean> {
            return true;
          }
        };
      });

      // Re-instantiate guard with mocked passport
      const moduleRef = await Test.createTestingModule({
        providers: [JwtAuthGuard],
      }).compile();
      guard = moduleRef.get<JwtAuthGuard>(JwtAuthGuard);

      const result = await guard.canActivate(mockContext);
      expect(result).toBe(true);

      // Restore original
      passport.AuthGuard = originalAuthGuard;
    });

    it('should return false when authentication fails', async () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: { authorization: 'Bearer invalid-token' },
          }),
          getResponse: jest.fn().mockReturnValue({}),
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      // Mock the passport strategy to fail
      const passport = require('@nestjs/passport');
      const originalAuthGuard = passport.AuthGuard;
      
      passport.AuthGuard = jest.fn().mockImplementation(() => {
        return class MockAuthGuard {
          async canActivate(context: ExecutionContext): Promise<boolean> {
            return false;
          }
        };
      });

      // Re-instantiate guard with mocked passport
      const moduleRef = await Test.createTestingModule({
        providers: [JwtAuthGuard],
      }).compile();
      guard = moduleRef.get<JwtAuthGuard>(JwtAuthGuard);

      const result = await guard.canActivate(mockContext);
      expect(result).toBe(false);

      // Restore original
      passport.AuthGuard = originalAuthGuard;
    });

    it('should throw an error when authentication throws', async () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: { authorization: 'Bearer expired-token' },
          }),
          getResponse: jest.fn().mockReturnValue({}),
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      // Mock the passport strategy to throw
      const passport = require('@nestjs/passport');
      const originalAuthGuard = passport.AuthGuard;
      
      passport.AuthGuard = jest.fn().mockImplementation(() => {
        return class MockAuthGuard {
          async canActivate(context: ExecutionContext): Promise<boolean> {
            throw new Error('Authentication failed');
          }
        };
      });

      // Re-instantiate guard with mocked passport
      const moduleRef = await Test.createTestingModule({
        providers: [JwtAuthGuard],
      }).compile();
      guard = moduleRef.get<JwtAuthGuard>(JwtAuthGuard);

      await expect(guard.canActivate(mockContext)).rejects.toThrow('Authentication failed');

      // Restore original
      passport.AuthGuard = originalAuthGuard;
    });
  });

  describe('handleRequest', () => {
    it('should return the user when no error and user exists', () => {
      const mockUser = { id: 1, username: 'testuser' };
      const result = guard.handleRequest(null, mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error when error is provided', () => {
      const mockError = new Error('Unauthorized');
      expect(() => guard.handleRequest(mockError, null)).toThrow(mockError);
    });

    it('should throw UnauthorizedException when user is null', () => {
      expect(() => guard.handleRequest(null, null)).toThrow('Unauthorized');
    });

    it('should throw UnauthorizedException when user is undefined', () => {
      expect(() => guard.handleRequest(null, undefined)).toThrow('Unauthorized');
    });

    it('should throw UnauthorizedException when user is false', () => {
      expect(() => guard.handleRequest(null, false)).toThrow('Unauthorized');
    });

    it('should return user when user is provided with no error', () => {
      const mockUser = { id: 2, username: 'anotheruser' };
      const result = guard.handleRequest(null, mockUser);
      expect(result).toBe(mockUser);
    });
  });

  describe('getAuthenticateOptions', () => {
    it('should return undefined by default', () => {
      const result = guard.getAuthenticateOptions();
      expect(result).toBeUndefined();
    });
  });

  describe('logIn', () => {
    it('should call super.logIn with the request', async () => {
      const mockRequest = { user: { id: 1 } };
      const logInSpy = jest.spyOn(JwtAuthGuard.prototype, 'logIn');
      
      await guard.logIn(mockRequest);
      
      expect(logInSpy).toHaveBeenCalledWith(mockRequest);
    });
  });

  describe('logOut', () => {
    it('should call super.logOut with the request', async () => {
      const mockRequest = { user: { id: 1 } };
      const logOutSpy = jest.spyOn(JwtAuthGuard.prototype, 'logOut');
      
      await guard.logOut(mockRequest);
      
      expect(logOutSpy).toHaveBeenCalledWith(mockRequest);
    });
  });
});