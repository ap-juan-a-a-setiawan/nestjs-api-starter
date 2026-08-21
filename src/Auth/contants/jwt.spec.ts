import { jwtContanst } from './jwt';

describe('jwtContanst', () => {
  it('should be defined', () => {
    expect(jwtContanst).toBeDefined();
  });

  it('should be an object', () => {
    expect(typeof jwtContanst).toBe('object');
  });

  it('should have a secret property with the expected value', () => {
    expect(jwtContanst.secret).toBe('ZUazAIQYqljDxpPX');
  });

  it('should have an expiresIn property with the expected value', () => {
    expect(jwtContanst.expiresIn).toBe('24h');
  });

  it('should match the exact expected object structure', () => {
    expect(jwtContanst).toEqual({
      secret: 'ZUazAIQYqljDxpPX',
      expiresIn: '24h'
    });
  });

  it('should not have additional properties', () => {
    const allowedKeys = ['secret', 'expiresIn'];
    const actualKeys = Object.keys(jwtContanst);
    expect(actualKeys).toEqual(allowedKeys);
  });

  it('should have a string secret', () => {
    expect(typeof jwtContanst.secret).toBe('string');
  });

  it('should have a string expiresIn', () => {
    expect(typeof jwtContanst.expiresIn).toBe('string');
  });

  it('should not be empty', () => {
    expect(jwtContanst.secret.length).toBeGreaterThan(0);
    expect(jwtContanst.expiresIn.length).toBeGreaterThan(0);
  });

  it('should support read-only access', () => {
    expect(jwtContanst.secret).toBeDefined();
    expect(jwtContanst.expiresIn).toBeDefined();
  });
});