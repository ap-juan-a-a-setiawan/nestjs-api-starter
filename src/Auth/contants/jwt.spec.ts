import { Test } from '@nestjs/testing';
import { jwtContanst } from './jwt';

describe('JwtContanst', () => {
  const JWT_TOKEN = 'JWT_CONSTANT';
  let jwt: { secret: string; expiresIn: string };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: JWT_TOKEN,
          useValue: jwtContanst,
        },
      ],
    }).compile();

    jwt = moduleRef.get(JWT_TOKEN);
  });

  it('should be defined', () => {
    expect(jwt).toBeDefined();
  });

  it('should have secret and expiresIn properties', () => {
    expect(jwt).toHaveProperty('secret');
    expect(jwt).toHaveProperty('expiresIn');
  });

  it('should have a non-empty secret string', () => {
    expect(typeof jwt.secret).toBe('string');
    expect(jwt.secret.length).toBeGreaterThan(0);
  });

  it('should have a non-empty expiresIn string', () => {
    expect(typeof jwt.expiresIn).toBe('string');
    expect(jwt.expiresIn.length).toBeGreaterThan(0);
  });

  it('should have a valid expiration format', () => {
    expect(jwt.expiresIn).toMatch(/^\d+[smhd]$/);
  });

  it('should match the expected secret value', () => {
    expect(jwt.secret).toBe('ZUazAIQYqljDxpPX');
  });

  it('should match the expected expiration value', () => {
    expect(jwt.expiresIn).toBe('24h');
  });

  it('should not be null or undefined', () => {
    expect(jwt).not.toBeNull();
    expect(jwt).not.toBeUndefined();
    expect(jwt.secret).not.toBeNull();
    expect(jwt.secret).not.toBeUndefined();
    expect(jwt.expiresIn).not.toBeNull();
    expect(jwt.expiresIn).not.toBeUndefined();
  });

  it('should not have empty secret or expiresIn', () => {
    expect(jwt.secret.trim()).not.toBe('');
    expect(jwt.expiresIn.trim()).not.toBe('');
  });
});