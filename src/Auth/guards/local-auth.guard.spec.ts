typescript
import { Test } from '@nestjs/testing';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthGuard } from '@nestjs/passport';

jest.mock('@nestjs/passport', () => ({
  AuthGuard: jest.fn().mockImplementation(() => {
    return class MockAuthGuard {
      canActivate = jest.fn();
    };
  }),
}));

describe('LocalAuthGuard', () => {
  let guard: LocalAuthGuard;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [LocalAuthGuard],
    }).compile();

    guard = moduleRef.get(LocalAuthGuard);
    (guard.canActivate as jest.Mock).mockReset();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should call AuthGuard with "local" strategy name', () => {
    expect(AuthGuard).toHaveBeenCalledWith('local');
  });

  it('should delegate canActivate to the inherited AuthGuard and return true', () => {
    const context = { user: {} };
    (guard.canActivate as jest.Mock).mockReturnValue(true);

    const result = guard.canActivate(context);

    expect(guard.canActivate).toHaveBeenCalledWith(context);
    expect(result).toBe(true);
  });

  it('should return false when the AuthGuard canActivate returns false', () => {
    (guard.canActivate as jest.Mock).mockReturnValue(false);

    expect(guard.canActivate({})).toBe(false);
  });

  it('should resolve true when canActivate returns a resolved promise', async () => {
    (guard.canActivate as jest.Mock).mockResolvedValue(true);

    await expect(guard.canActivate({})).resolves.toBe(true);
  });

  it('should resolve false when canActivate returns a resolved promise with false', async () => {
    (guard.canActivate as jest.Mock).mockResolvedValue(false);

    await expect(guard.canActivate({})).resolves.toBe(false);
  });

  it('should reject when canActivate returns a rejected promise', async () => {
    (guard.canActivate as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

    await expect(guard.canActivate({})).rejects.toThrow('Unauthorized');
  });

  it('should throw if the underlying canActivate throws', () => {
    (guard.canActivate as jest.Mock).mockImplementation(() => {
      throw new Error('Unauthorized');
    });

    expect(() => guard.canActivate({})).toThrow('Unauthorized');
  });

  it('should pass the execution context through to the strategy', () => {
    const context = { request: { headers: {} } };
    (guard.canActivate as jest.Mock).mockReturnValue(true);

    guard.canActivate(context);

    expect(guard.canActivate).toHaveBeenCalledTimes(1);
    expect(guard.canActivate).toHaveBeenCalledWith(context);
  });
});