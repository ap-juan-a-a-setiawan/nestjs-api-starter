import { Test } from '@nestjs/testing';
import { jwtContanst } from './jwt';

describe('jwtContanst', () => {
  it('should be defined', () => {
    expect(jwtContanst).toBeDefined();
  });

  it('should have the correct secret', () => {
    expect(jwtContanst.secret).toBe('ZUazAIQYqljDxpPX');
  });

  it('should have the correct expiration time', () => {
    expect(jwtContanst.expiresIn).toBe('24h');
  });

  it('should have string values for all properties', () => {
    expect(typeof jwtContanst.secret).toBe('string');
    expect(typeof jwtContanst.expiresIn).toBe('string');
  });

  it('should be injectable via Nest testing module', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: 'JWT_CONSTANT',
          useValue: jwtContanst,
        },
      ],
    }).compile();

    const constant = moduleRef.get('JWT_CONSTANT');
    expect(constant).toEqual(jwtContanst);
  });
});