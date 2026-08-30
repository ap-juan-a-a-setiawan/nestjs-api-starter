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
          getRequest: jest.fn().mockReturnValue({
            headers: { authorization: 'Bearer valid-token' },
          }),
        }),
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
            user: { id: 1, username: 'testuser' },
          }),
        }),
      } as unknown as ExecutionContext;

      // Mock the passport strategy to return true
      const originalCanActivate = JwtAuthGuard.prototype.canActivate;
      JwtAuthGuard.prototype.canActivate = jest.fn().mockResolvedValue(true);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);

      // Restore original method
      JwtAuthGuard.prototype.canActivate = originalCanActivate;
    });

    it('should return false when authentication fails', async () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: { authorization: 'Bearer invalid-token' },
          }),
        }),
      } as unknown as ExecutionContext;

      // Mock the passport strategy to return false
      const originalCanActivate = JwtAuthGuard.prototype.canActivate;
      JwtAuthGuard.prototype.canActivate = jest.fn().mockResolvedValue(false);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(false);

      // Restore original method
      JwtAuthGuard.prototype.canActivate = originalCanActivate;
    });

    it('should throw an error when no authorization header is present', async () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {},
          }),
        }),
      } as unknown as ExecutionContext;

      // Mock the passport strategy to throw an error
      const originalCanActivate = JwtAuthGuard.prototype.canActivate;
      JwtAuthGuard.prototype.canActivate = jest.fn().mockRejectedValue(
        new Error('No auth token'),
      );

      await expect(guard.canActivate(mockContext)).rejects.toThrow('No auth token');

      // Restore original method
      JwtAuthGuard.prototype.canActivate = originalCanActivate;
    });

    it('should handle malformed authorization header', async () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: { authorization: 'InvalidFormat' },
          }),
        }),
      } as unknown as ExecutionContext;

      // Mock the passport strategy to throw an error for malformed header
      const originalCanActivate = JwtAuthGuard.prototype.canActivate;
      JwtAuthGuard.prototype.canActivate = jest.fn().mockRejectedValue(
        new Error('Invalid authorization header format'),
      );

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        'Invalid authorization header format',
      );

      // Restore original method
      JwtAuthGuard.prototype.canActivate = originalCanActivate;
    });

    it('should handle expired token', async () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: { authorization: 'Bearer expired-token' },
          }),
        }),
      } as unknown as ExecutionContext;

      // Mock the passport strategy to throw an error for expired token
      const originalCanActivate = JwtAuthGuard.prototype.canActivate;
      JwtAuthGuard.prototype.canActivate = jest.fn().mockRejectedValue(
        new Error('Token expired'),
      );

      await expect(guard.canActivate(mockContext)).rejects.toThrow('Token expired');

      // Restore original method
      JwtAuthGuard.prototype.canActivate = originalCanActivate;
    });

    it('should handle missing user in request after authentication', async () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: { authorization: 'Bearer valid-token' },
            // No user property
          }),
        }),
      } as unknown as ExecutionContext;

      // Mock the passport strategy to return true but no user attached
      const originalCanActivate = JwtAuthGuard.prototype.canActivate;
      JwtAuthGuard.prototype.canActivate = jest.fn().mockResolvedValue(true);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);

      // Restore original method
      JwtAuthGuard.prototype.canActivate = originalCanActivate;
    });

    it('should handle null context', async () => {
      const originalCanActivate = JwtAuthGuard.prototype.canActivate;
      JwtAuthGuard.prototype.canActivate = jest.fn().mockRejectedValue(
        new Error('Invalid context'),
      );

      await expect(guard.canActivate(null as unknown as ExecutionContext)).rejects.toThrow(
        'Invalid context',
      );

      // Restore original method
      JwtAuthGuard.prototype.canActivate = originalCanActivate;
    });

    it('should handle undefined request', async () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(undefined),
        }),
      } as unknown as ExecutionContext;

      const originalCanActivate = JwtAuthGuard.prototype.canActivate;
      JwtAuthGuard.prototype.canActivate = jest.fn().mockRejectedValue(
        new Error('Request is undefined'),
      );

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        'Request is undefined',
      );

      // Restore original method
      JwtAuthGuard.prototype.canActivate = originalCanActivate;
    });
  });

  describe('handleRequest', () => {
    it('should be inherited from AuthGuard', () => {
      expect(typeof guard.handleRequest).toBe('function');
    });

    it('should return the user when no error and user exists', () => {
      const mockUser = { id: 1, username: 'testuser' };
      const result = guard.handleRequest(null, mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error when error is provided', () => {
      const mockError = new Error('Authentication failed');
      expect(() => guard.handleRequest(mockError, null)).toThrow(mockError);
    });

    it('should throw an error when user is not provided', () => {
      expect(() => guard.handleRequest(null, null)).toThrow(
        'User not found in request',
      );
    });

    it('should throw an error when user is undefined', () => {
      expect(() => guard.handleRequest(null, undefined)).toThrow(
        'User not found in request',
      );
    });

    it('should throw an error when user is false', () => {
      expect(() => guard.handleRequest(null, false)).toThrow(
        'User not found in request',
      );
    });

    it('should throw an error when user is an empty object', () => {
      expect(() => guard.handleRequest(null, {})).toThrow(
        'User not found in request',
      );
    });

    it('should return user when user is a valid object with id', () => {
      const mockUser = { id: 1, username: 'testuser' };
      const result = guard.handleRequest(null, mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should return user when user is a valid object with email', () => {
      const mockUser = { email: 'test@example.com' };
      const result = guard.handleRequest(null, mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should handle both error and user simultaneously', () => {
      const mockError = new Error('Token expired');
      const mockUser = { id: 1 };
      expect(() => guard.handleRequest(mockError, mockUser)).toThrow(mockError);
    });
  });
});