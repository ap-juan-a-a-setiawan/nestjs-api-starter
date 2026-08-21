typescript
jest.mock('@nestjs/passport', () => ({
  AuthGuard: jest.fn().mockImplementation((type: string) => {
    return class MockAuthGuard {
      canActivate(context: any): boolean {
        return context && context.type === type;
      }
    };
  }),
}));

import { AuthGuard } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { LocalAuthGuard } from './local-auth.guard';

describe('LocalAuthGuard', () => {
  it('should call AuthGuard with "local"', () => {
    expect(AuthGuard).toHaveBeenCalledWith('local');
  });

  it('should be instantiated via Nest testing module', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [LocalAuthGuard],
    }).compile();

    const guard = moduleRef.get<LocalAuthGuard>(LocalAuthGuard);

    expect(guard).toBeDefined();
    expect(guard).toBeInstanceOf(LocalAuthGuard);
  });

  it('should expose canActivate method from AuthGuard', () => {
    const guard = new LocalAuthGuard();

    expect(guard.canActivate).toBeDefined();
    expect(typeof guard.canActivate).toBe('function');
  });

  it('should delegate canActivate to AuthGuard implementation', () => {
    const guard = new LocalAuthGuard();
    const localContext = { type: 'local' };
    const jwtContext = { type: 'jwt' };

    expect(guard.canActivate(localContext)).toBe(true);
    expect(guard.canActivate(jwtContext)).toBe(false);
  });

  it('should return false for null or undefined context', () => {
    const guard = new LocalAuthGuard();

    expect(guard.canActivate(null)).toBe(false);
    expect(guard.canActivate(undefined)).toBe(false);
  });
});