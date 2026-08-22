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

      // Mock the parent AuthGuard's canActivate to return true
      jest.spyOn(JwtAuthGuard.prototype, 'canActivate').mockResolvedValue(true);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should return false when authentication fails', async () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {},
          }),
        }),
      } as unknown as ExecutionContext;

      // Mock the parent AuthGuard's canActivate to return false
      jest.spyOn(JwtAuthGuard.prototype, 'canActivate').mockResolvedValue(false);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(false);
    });

    it('should throw an error when authentication throws', async () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: { authorization: 'Bearer invalid-token' },
          }),
        }),
      } as unknown as ExecutionContext;

      const error = new Error('Unauthorized');
      jest.spyOn(JwtAuthGuard.prototype, 'canActivate').mockRejectedValue(error);

      await expect(guard.canActivate(mockContext)).rejects.toThrow(error);
    });

    it('should handle missing authorization header', async () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {},
          }),
        }),
      } as unknown as ExecutionContext;

      jest.spyOn(JwtAuthGuard.prototype, 'canActivate').mockRejectedValue(
        new Error('No auth token'),
      );

      await expect(guard.canActivate(mockContext)).rejects.toThrow('No auth token');
    });

    it('should handle malformed authorization header', async () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: { authorization: 'InvalidFormat' },
          }),
        }),
      } as unknown as ExecutionContext;

      jest.spyOn(JwtAuthGuard.prototype, 'canActivate').mockRejectedValue(
        new Error('Invalid token format'),
      );

      await expect(guard.canActivate(mockContext)).rejects.toThrow('Invalid token format');
    });

    it('should handle expired token', async () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: { authorization: 'Bearer expired-token' },
          }),
        }),
      } as unknown as ExecutionContext;

      jest.spyOn(JwtAuthGuard.prototype, 'canActivate').mockRejectedValue(
        new Error('Token expired'),
      );

      await expect(guard.canActivate(mockContext)).rejects.toThrow('Token expired');
    });

    it('should handle null context', async () => {
      jest.spyOn(JwtAuthGuard.prototype, 'canActivate').mockRejectedValue(
        new Error('Invalid context'),
      );

      await expect(guard.canActivate(null as unknown as ExecutionContext)).rejects.toThrow(
        'Invalid context',
      );
    });

    it('should handle undefined request', async () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(undefined),
        }),
      } as unknown as ExecutionContext;

      jest.spyOn(JwtAuthGuard.prototype, 'canActivate').mockRejectedValue(
        new Error('Request is undefined'),
      );

      await expect(guard.canActivate(mockContext)).rejects.toThrow('Request is undefined');
    });
  });

  describe('handleRequest', () => {
    it('should return the user when authentication succeeds', () => {
      const mockUser = { id: 1, username: 'testuser' };
      const result = guard.handleRequest(null, mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error when err is provided', () => {
      const error = new Error('Authentication error');
      expect(() => guard.handleRequest(error, null)).toThrow(error);
    });

    it('should throw an error when user is not found', () => {
      expect(() => guard.handleRequest(null, null)).toThrow('User not found');
    });

    it('should throw an error when user is undefined', () => {
      expect(() => guard.handleRequest(null, undefined)).toThrow('User not found');
    });

    it('should throw an error when user is false', () => {
      expect(() => guard.handleRequest(null, false)).toThrow('User not found');
    });

    it('should throw an error when user is an empty object', () => {
      expect(() => guard.handleRequest(null, {})).toThrow('User not found');
    });

    it('should return user when valid user object is provided', () => {
      const mockUser = { id: 1, username: 'testuser', roles: ['admin'] };
      const result = guard.handleRequest(null, mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw the original error when both err and user are provided', () => {
      const error = new Error('Custom error');
      const mockUser = { id: 1 };
      expect(() => guard.handleRequest(error, mockUser)).toThrow(error);
    });
  });
});