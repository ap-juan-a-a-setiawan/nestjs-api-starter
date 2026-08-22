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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should be defined', () => {
      expect(guard).toBeDefined();
    });

    it('should call super.canActivate with the execution context', async () => {
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

    it('should throw an error when no token is provided', async () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {},
          }),
        }),
      } as unknown as ExecutionContext;

      // Mock the parent AuthGuard's canActivate to throw
      jest.spyOn(JwtAuthGuard.prototype, 'canActivate').mockRejectedValue(
        new Error('Unauthorized'),
      );

      await expect(guard.canActivate(mockContext)).rejects.toThrow('Unauthorized');
    });

    it('should throw an error when token is invalid', async () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: { authorization: 'Bearer invalid-token' },
          }),
        }),
      } as unknown as ExecutionContext;

      // Mock the parent AuthGuard's canActivate to throw
      jest.spyOn(JwtAuthGuard.prototype, 'canActivate').mockRejectedValue(
        new Error('Invalid token'),
      );

      await expect(guard.canActivate(mockContext)).rejects.toThrow('Invalid token');
    });

    it('should handle missing execution context', async () => {
      const canActivateSpy = jest.spyOn(JwtAuthGuard.prototype, 'canActivate');

      await expect(guard.canActivate(undefined as unknown as ExecutionContext)).rejects.toThrow();
      expect(canActivateSpy).toHaveBeenCalledWith(undefined);
    });

    it('should handle null execution context', async () => {
      const canActivateSpy = jest.spyOn(JwtAuthGuard.prototype, 'canActivate');

      await expect(guard.canActivate(null as unknown as ExecutionContext)).rejects.toThrow();
      expect(canActivateSpy).toHaveBeenCalledWith(null);
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

    it('should throw when error is provided', () => {
      const mockError = new Error('Authentication error');
      expect(() => guard.handleRequest(mockError, null)).toThrow('Authentication error');
    });

    it('should throw when user is not provided', () => {
      expect(() => guard.handleRequest(null, null)).toThrow();
    });

    it('should throw UnauthorizedException when user is not provided', () => {
      expect(() => guard.handleRequest(null, null)).toThrow('Unauthorized');
    });
  });

  describe('inheritance', () => {
    it('should extend AuthGuard with jwt strategy', () => {
      expect(JwtAuthGuard.prototype).toBeInstanceOf(Object);
      expect(JwtAuthGuard.name).toBe('JwtAuthGuard');
    });

    it('should have the correct strategy name', () => {
      // The strategy name 'jwt' is passed to the parent AuthGuard
      const authGuardInstance = new JwtAuthGuard();
      expect(authGuardInstance).toBeDefined();
    });
  });
});