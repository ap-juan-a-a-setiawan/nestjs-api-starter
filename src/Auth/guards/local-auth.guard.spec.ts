typescript
import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { LocalAuthGuard } from './local-auth.guard';

jest.mock('@nestjs/passport', () => ({
  AuthGuard: jest.fn().mockImplementation(() => {
    return class MockBaseGuard {
      canActivate(): boolean {
        return true;
      }
    };
  }),
}));

jest.mock('@nestjs/common', () => {
  const actual = jest.requireActual('@nestjs/common');
  return {
    ...actual,
    Injectable: jest.fn(() => actual.Injectable()),
  };
});

const mockedAuthGuard = AuthGuard as jest.Mock;
const mockedInjectable = Injectable as jest.Mock;

describe('LocalAuthGuard', () => {
  it('should call AuthGuard with "local"', () => {
    expect(mockedAuthGuard).toHaveBeenCalledWith('local');
  });

  it('should call AuthGuard exactly once', () => {
    expect(mockedAuthGuard).toHaveBeenCalledTimes(1);
  });

  it('should call Injectable', () => {
    expect(mockedInjectable).toHaveBeenCalled();
  });

  it('should be defined', () => {
    const guard = new LocalAuthGuard();
    expect(guard).toBeDefined();
  });

  it('should be an instance of LocalAuthGuard', () => {
    const guard = new LocalAuthGuard();
    expect(guard).toBeInstanceOf(LocalAuthGuard);
  });

  it('should extend the guard returned by AuthGuard', () => {
    const guard = new LocalAuthGuard();
    expect(guard.canActivate()).toBe(true);
  });

  it('should be instantiable multiple times', () => {
    const guard1 = new LocalAuthGuard();
    const guard2 = new LocalAuthGuard();
    expect(guard1).toBeInstanceOf(LocalAuthGuard);
    expect(guard2).toBeInstanceOf(LocalAuthGuard);
  });

  it('should be usable as a Nest provider', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [LocalAuthGuard],
    }).compile();

    const guard = moduleRef.get(LocalAuthGuard);
    expect(guard).toBeInstanceOf(LocalAuthGuard);
  });
});