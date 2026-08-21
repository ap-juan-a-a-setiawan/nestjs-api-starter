import { Test } from '@nestjs/testing';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';

jest.mock('@nestjs/passport', () => ({
  AuthGuard: jest.fn(() => {
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

    guard = moduleRef.get<JwtAuthGuard>(JwtAuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should call AuthGuard with the "jwt" strategy', () => {
    expect(AuthGuard).toHaveBeenCalledWith('jwt');
    expect(AuthGuard).toHaveBeenCalledTimes(1);
  });

  it('should extend the class returned by AuthGuard("jwt")', () => {
    const baseClass = (AuthGuard as jest.Mock).mock.results[0].value;
    expect(guard).toBeInstanceOf(baseClass);
  });

  it('should expose a canActivate method from the AuthGuard base class', () => {
    expect(typeof guard.canActivate).toBe('function');
  });

  it('should delegate canActivate calls to the AuthGuard base implementation', async () => {
    const context = {};
    const canActivate = guard.canActivate as jest.Mock;

    await canActivate(context);

    expect(canActivate).toHaveBeenCalledWith(context);
    expect(canActivate).toHaveBeenCalledTimes(1);
  });
});