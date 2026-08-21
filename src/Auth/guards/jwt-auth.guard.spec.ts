typescript
import { Test } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';

jest.mock('@nestjs/passport', () => ({
  AuthGuard: jest.fn().mockImplementation(() => {
    return class MockAuthGuard {
      canActivate = jest.fn();
    };
  }),
}));

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [JwtAuthGuard],
    }).compile();

    guard = moduleRef.get(JwtAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should call AuthGuard with the jwt strategy', () => {
    expect(AuthGuard as unknown as jest.Mock).toHaveBeenCalledTimes(1);
    expect(AuthGuard as unknown as jest.Mock).toHaveBeenCalledWith('jwt');
  });

  it('should delegate canActivate to the parent AuthGuard and resolve with true', async () => {
    const context = {
      switchToHttp: jest.fn(),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    const canActivate = guard.canActivate as unknown as jest.Mock;
    canActivate.mockResolvedValue(true);

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(canActivate).toHaveBeenCalledWith(context);
  });

  it('should return false when parent AuthGuard returns false', async () => {
    const context = {} as ExecutionContext;
    const canActivate = guard.canActivate as unknown as jest.Mock;
    canActivate.mockResolvedValue(false);

    await expect(guard.canActivate(context)).resolves.toBe(false);
  });

  it('should propagate an exception thrown by parent AuthGuard', async () => {
    const context = {} as ExecutionContext;
    const canActivate = guard.canActivate as unknown as jest.Mock;
    canActivate.mockRejectedValue(new Error('Unauthorized'));

    await expect(guard.canActivate(context)).rejects.toThrow('Unauthorized');
  });

  it('should pass the raw execution context to parent AuthGuard even if it is null', () => {
    const context = null as unknown as ExecutionContext;
    const canActivate = guard.canActivate as unknown as jest.Mock;
    canActivate.mockReturnValue(false);

    const result = guard.canActivate(context);

    expect(canActivate).toHaveBeenCalledWith(null);
    expect(result).toBe(false);
  });
});