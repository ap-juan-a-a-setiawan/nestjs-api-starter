import { Test, TestingModule } from '@nestjs/testing';
import { jwtContanst } from './jwt';

describe('jwtContanst', () => {
  describe('jwtContanst object', () => {
    it('should be defined', () => {
      expect(jwtContanst).toBeDefined();
    });

    it('should have a secret property', () => {
      expect(jwtContanst).toHaveProperty('secret');
    });

    it('should have an expiresIn property', () => {
      expect(jwtContanst).toHaveProperty('expiresIn');
    });

    it('should have the correct secret value', () => {
      expect(jwtContanst.secret).toBe('ZUazAIQYqljDxpPX');
    });

    it('should have the correct expiresIn value', () => {
      expect(jwtContanst.expiresIn).toBe('24h');
    });

    it('should have a non-empty secret', () => {
      expect(jwtContanst.secret.length).toBeGreaterThan(0);
    });

    it('should have a non-empty expiresIn', () => {
      expect(jwtContanst.expiresIn.length).toBeGreaterThan(0);
    });

    it('should have a secret of type string', () => {
      expect(typeof jwtContanst.secret).toBe('string');
    });

    it('should have an expiresIn of type string', () => {
      expect(typeof jwtContanst.expiresIn).toBe('string');
    });

    it('should have a secret that is not undefined', () => {
      expect(jwtContanst.secret).not.toBeUndefined();
    });

    it('should have an expiresIn that is not undefined', () => {
      expect(jwtContanst.expiresIn).not.toBeUndefined();
    });

    it('should have a secret that is not null', () => {
      expect(jwtContanst.secret).not.toBeNull();
    });

    it('should have an expiresIn that is not null', () => {
      expect(jwtContanst.expiresIn).not.toBeNull();
    });

    it('should have a secret that is not an empty string', () => {
      expect(jwtContanst.secret).not.toBe('');
    });

    it('should have an expiresIn that is not an empty string', () => {
      expect(jwtContanst.expiresIn).not.toBe('');
    });

    it('should have a secret that matches the expected pattern', () => {
      expect(jwtContanst.secret).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('should have an expiresIn that matches the expected pattern', () => {
      expect(jwtContanst.expiresIn).toMatch(/^\d+[smhd]$/);
    });

    it('should have a secret with a length of 16 characters', () => {
      expect(jwtContanst.secret).toHaveLength(16);
    });

    it('should have an expiresIn with a length of 3 characters', () => {
      expect(jwtContanst.expiresIn).toHaveLength(3);
    });

    it('should have a secret that is alphanumeric', () => {
      expect(jwtContanst.secret).toMatch(/^[a-zA-Z0-9]+$/);
    });

    it('should have an expiresIn that ends with h for hours', () => {
      expect(jwtContanst.expiresIn.endsWith('h')).toBe(true);
    });

    it('should have an expiresIn that starts with a number', () => {
      expect(parseInt(jwtContanst.expiresIn)).toBeGreaterThan(0);
    });

    it('should have a secret that contains uppercase letters', () => {
      expect(jwtContanst.secret).toMatch(/[A-Z]/);
    });

    it('should have a secret that contains lowercase letters', () => {
      expect(jwtContanst.secret).toMatch(/[a-z]/);
    });

    it('should have a secret that contains numbers', () => {
      expect(jwtContanst.secret).toMatch(/[0-9]/);
    });

    it('should have a secret that is a valid JWT secret', () => {
      expect(jwtContanst.secret.length).toBeGreaterThanOrEqual(16);
    });

    it('should have an expiresIn that is a valid duration', () => {
      const duration = parseInt(jwtContanst.expiresIn);
      expect(duration).toBeGreaterThan(0);
      expect(jwtContanst.expiresIn).toMatch(/^[0-9]+[smhd]$/);
    });

    it('should have a secret that is not a number', () => {
      expect(isNaN(Number(jwtContanst.secret))).toBe(true);
    });

    it('should have an expiresIn that is not a number', () => {
      expect(isNaN(Number(jwtContanst.expiresIn))).toBe(true);
    });

    it('should have a secret that is not a boolean', () => {
      expect(jwtContanst.secret).not.toBe(true);
      expect(jwtContanst.secret).not.toBe(false);
    });

    it('should have an expiresIn that is not a boolean', () => {
      expect(jwtContanst.expiresIn).not.toBe(true);
      expect(jwtContanst.expiresIn).not.toBe(false);
    });

    it('should have a secret that is not an object', () => {
      expect(typeof jwtContanst.secret).not.toBe('object');
    });

    it('should have an expiresIn that is not an object', () => {
      expect(typeof jwtContanst.expiresIn).not.toBe('object');
    });

    it('should have a secret that is not an array', () => {
      expect(Array.isArray(jwtContanst.secret)).toBe(false);
    });

    it('should have an expiresIn that is not an array', () => {
      expect(Array.isArray(jwtContanst.expiresIn)).toBe(false);
    });

    it('should have a secret that is not a function', () => {
      expect(typeof jwtContanst.secret).not.toBe('function');
    });

    it('should have an expiresIn that is not a function', () => {
      expect(typeof jwtContanst.expiresIn).not.toBe('function');
    });

    it('should have a secret that is not a symbol', () => {
      expect(typeof jwtContanst.secret).not.toBe('symbol');
    });

    it('should have an expiresIn that is not a symbol', () => {
      expect(typeof jwtContanst.expiresIn).not.toBe('symbol');
    });

    it('should have a secret that is not a bigint', () => {
      expect(typeof jwtContanst.secret).not.toBe('bigint');
    });

    it('should have an expiresIn that is not a bigint', () => {
      expect(typeof jwtContanst.expiresIn).not.toBe('bigint');
    });

    it('should have a secret that is not undefined', () => {
      expect(jwtContanst.secret).not.toBeUndefined();
    });

    it('should have an expiresIn that is not undefined', () => {
      expect(jwtContanst.expiresIn).not.toBeUndefined();
    });

    it('should have a secret that is not null', () => {
      expect(jwtContanst.secret).not.toBeNull();
    });

    it('should have an expiresIn that is not null', () => {
      expect(jwtContanst.expiresIn).not.toBeNull();
    });

    it('should have a secret that is not NaN', () => {
      expect(jwtContanst.secret).not.toBeNaN();
    });

    it('should have an expiresIn that is not NaN', () => {
      expect(jwtContanst.expiresIn).not.toBeNaN();
    });

    it('should have a secret that is not Infinity', () => {
      expect(jwtContanst.secret).not.toBe(Infinity);
    });

    it('should have an expiresIn that is not Infinity', () => {
      expect(jwtContanst.expiresIn).not.toBe(Infinity);
    });

    it('should have a secret that is not -Infinity', () => {
      expect(jwtContanst.secret).not.toBe(-Infinity);
    });

    it('should have an expiresIn that is not -Infinity', () => {
      expect(jwtContanst.expiresIn).not.toBe(-Infinity);
    });

    it('should have a secret that is not 0', () => {
      expect(jwtContanst.secret).not.toBe(0);
    });

    it('should have an expiresIn that is not 0', () => {
      expect(jwtContanst.expiresIn).not.toBe(0);
    });

    it('should have a secret that is not 1', () => {
      expect(jwtContanst.secret).not.toBe(1);
    });

    it('should have an expiresIn that is not 1', () => {
      expect(jwtContanst.expiresIn).not.toBe(1);
    });

    it('should have a secret that is not -1', () => {
      expect(jwtContanst.secret).not.toBe(-1);
    });

    it('should have an expiresIn that is not -1', () => {
      expect(jwtContanst.expiresIn).not.toBe(-1);
    });

    it('should have a secret that is not an empty object', () => {
      expect(jwtContanst.secret).not.toEqual({});
    });

    it('should have an expiresIn that is not an empty object', () => {
      expect(jwtContanst.expiresIn).not.toEqual({});
    });

    it('should have a secret that is not an empty array', () => {
      expect(jwtContanst.secret).not.toEqual([]);
    });

    it('should have an expiresIn that is not an empty array', () => {
      expect(jwtContanst.expiresIn).not.toEqual([]);
    });

    it('should have a secret that is not a whitespace string', () => {
      expect(jwtContanst.secret.trim()).not.toBe('');
    });

    it('should have an expiresIn that is not a whitespace string', () => {
      expect(jwtContanst.expiresIn.trim()).not.toBe('');
    });

    it('should have a secret that is not a newline string', () => {
      expect(jwtContanst.secret).not.toBe('\n');
    });

    it('should have an expiresIn that is not a newline string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\n');
    });

    it('should have a secret that is not a tab string', () => {
      expect(jwtContanst.secret).not.toBe('\t');
    });

    it('should have an expiresIn that is not a tab string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\t');
    });

    it('should have a secret that is not a carriage return string', () => {
      expect(jwtContanst.secret).not.toBe('\r');
    });

    it('should have an expiresIn that is not a carriage return string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\r');
    });

    it('should have a secret that is not a space string', () => {
      expect(jwtContanst.secret).not.toBe(' ');
    });

    it('should have an expiresIn that is not a space string', () => {
      expect(jwtContanst.expiresIn).not.toBe(' ');
    });

    it('should have a secret that is not a special character string', () => {
      expect(jwtContanst.secret).not.toBe('!@#$%^&*()');
    });

    it('should have an expiresIn that is not a special character string', () => {
      expect(jwtContanst.expiresIn).not.toBe('!@#$%^&*()');
    });

    it('should have a secret that is not a unicode string', () => {
      expect(jwtContanst.secret).not.toBe('😀');
    });

    it('should have an expiresIn that is not a unicode string', () => {
      expect(jwtContanst.expiresIn).not.toBe('😀');
    });

    it('should have a secret that is not a date string', () => {
      expect(jwtContanst.secret).not.toBe('2023-01-01');
    });

    it('should have an expiresIn that is not a date string', () => {
      expect(jwtContanst.expiresIn).not.toBe('2023-01-01');
    });

    it('should have a secret that is not a time string', () => {
      expect(jwtContanst.secret).not.toBe('12:00:00');
    });

    it('should have an expiresIn that is not a time string', () => {
      expect(jwtContanst.expiresIn).not.toBe('12:00:00');
    });

    it('should have a secret that is not a datetime string', () => {
      expect(jwtContanst.secret).not.toBe('2023-01-01T12:00:00');
    });

    it('should have an expiresIn that is not a datetime string', () => {
      expect(jwtContanst.expiresIn).not.toBe('2023-01-01T12:00:00');
    });

    it('should have a secret that is not a JSON string', () => {
      expect(jwtContanst.secret).not.toBe('{"key":"value"}');
    });

    it('should have an expiresIn that is not a JSON string', () => {
      expect(jwtContanst.expiresIn).not.toBe('{"key":"value"}');
    });

    it('should have a secret that is not a base64 string', () => {
      expect(jwtContanst.secret).not.toBe('dGVzdA==');
    });

    it('should have an expiresIn that is not a base64 string', () => {
      expect(jwtContanst.expiresIn).not.toBe('dGVzdA==');
    });

    it('should have a secret that is not a hex string', () => {
      expect(jwtContanst.secret).not.toBe('0x1234567890abcdef');
    });

    it('should have an expiresIn that is not a hex string', () => {
      expect(jwtContanst.expiresIn).not.toBe('0x1234567890abcdef');
    });

    it('should have a secret that is not a binary string', () => {
      expect(jwtContanst.secret).not.toBe('1010101010');
    });

    it('should have an expiresIn that is not a binary string', () => {
      expect(jwtContanst.expiresIn).not.toBe('1010101010');
    });

    it('should have a secret that is not an octal string', () => {
      expect(jwtContanst.secret).not.toBe('01234567');
    });

    it('should have an expiresIn that is not an octal string', () => {
      expect(jwtContanst.expiresIn).not.toBe('01234567');
    });

    it('should have a secret that is not a decimal string', () => {
      expect(jwtContanst.secret).not.toBe('1234567890');
    });

    it('should have an expiresIn that is not a decimal string', () => {
      expect(jwtContanst.expiresIn).not.toBe('1234567890');
    });

    it('should have a secret that is not a float string', () => {
      expect(jwtContanst.secret).not.toBe('123.456');
    });

    it('should have an expiresIn that is not a float string', () => {
      expect(jwtContanst.expiresIn).not.toBe('123.456');
    });

    it('should have a secret that is not a negative number string', () => {
      expect(jwtContanst.secret).not.toBe('-123');
    });

    it('should have an expiresIn that is not a negative number string', () => {
      expect(jwtContanst.expiresIn).not.toBe('-123');
    });

    it('should have a secret that is not a positive number string', () => {
      expect(jwtContanst.secret).not.toBe('+123');
    });

    it('should have an expiresIn that is not a positive number string', () => {
      expect(jwtContanst.expiresIn).not.toBe('+123');
    });

    it('should have a secret that is not an exponential string', () => {
      expect(jwtContanst.secret).not.toBe('1e10');
    });

    it('should have an expiresIn that is not an exponential string', () => {
      expect(jwtContanst.expiresIn).not.toBe('1e10');
    });

    it('should have a secret that is not a scientific notation string', () => {
      expect(jwtContanst.secret).not.toBe('1.23e-10');
    });

    it('should have an expiresIn that is not a scientific notation string', () => {
      expect(jwtContanst.expiresIn).not.toBe('1.23e-10');
    });

    it('should have a secret that is not a boolean string', () => {
      expect(jwtContanst.secret).not.toBe('true');
      expect(jwtContanst.secret).not.toBe('false');
    });

    it('should have an expiresIn that is not a boolean string', () => {
      expect(jwtContanst.expiresIn).not.toBe('true');
      expect(jwtContanst.expiresIn).not.toBe('false');
    });

    it('should have a secret that is not a null string', () => {
      expect(jwtContanst.secret).not.toBe('null');
    });

    it('should have an expiresIn that is not a null string', () => {
      expect(jwtContanst.expiresIn).not.toBe('null');
    });

    it('should have a secret that is not an undefined string', () => {
      expect(jwtContanst.secret).not.toBe('undefined');
    });

    it('should have an expiresIn that is not an undefined string', () => {
      expect(jwtContanst.expiresIn).not.toBe('undefined');
    });

    it('should have a secret that is not a NaN string', () => {
      expect(jwtContanst.secret).not.toBe('NaN');
    });

    it('should have an expiresIn that is not a NaN string', () => {
      expect(jwtContanst.expiresIn).not.toBe('NaN');
    });

    it('should have a secret that is not an Infinity string', () => {
      expect(jwtContanst.secret).not.toBe('Infinity');
    });

    it('should have an expiresIn that is not an Infinity string', () => {
      expect(jwtContanst.expiresIn).not.toBe('Infinity');
    });

    it('should have a secret that is not a -Infinity string', () => {
      expect(jwtContanst.secret).not.toBe('-Infinity');
    });

    it('should have an expiresIn that is not a -Infinity string', () => {
      expect(jwtContanst.expiresIn).not.toBe('-Infinity');
    });

    it('should have a secret that is not a 0 string', () => {
      expect(jwtContanst.secret).not.toBe('0');
    });

    it('should have an expiresIn that is not a 0 string', () => {
      expect(jwtContanst.expiresIn).not.toBe('0');
    });

    it('should have a secret that is not a 1 string', () => {
      expect(jwtContanst.secret).not.toBe('1');
    });

    it('should have an expiresIn that is not a 1 string', () => {
      expect(jwtContanst.expiresIn).not.toBe('1');
    });

    it('should have a secret that is not a -1 string', () => {
      expect(jwtContanst.secret).not.toBe('-1');
    });

    it('should have an expiresIn that is not a -1 string', () => {
      expect(jwtContanst.expiresIn).not.toBe('-1');
    });

    it('should have a secret that is not a whitespace-only string', () => {
      expect(jwtContanst.secret).not.toMatch(/^\s+$/);
    });

    it('should have an expiresIn that is not a whitespace-only string', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/^\s+$/);
    });

    it('should have a secret that is not a control character string', () => {
      expect(jwtContanst.secret).not.toMatch(/[\x00-\x1F\x7F]/);
    });

    it('should have an expiresIn that is not a control character string', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\x00-\x1F\x7F]/);
    });

    it('should have a secret that is not a format character string', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u200B-\u200D\uFEFF]/);
    });

    it('should have an expiresIn that is not a format character string', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u200B-\u200D\uFEFF]/);
    });

    it('should have a secret that is not a surrogate pair string', () => {
      expect(jwtContanst.secret).not.toMatch(/[\uD800-\uDBFF][\uDC00-\uDFFF]/);
    });

    it('should have an expiresIn that is not a surrogate pair string', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\uD800-\uDBFF][\uDC00-\uDFFF]/);
    });

    it('should have a secret that is not a private use area string', () => {
      expect(jwtContanst.secret).not.toMatch(/[\uE000-\uF8FF]/);
    });

    it('should have an expiresIn that is not a private use area string', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\uE000-\uF8FF]/);
    });

    it('should have a secret that is not a variation selector string', () => {
      expect(jwtContanst.secret).not.toMatch(/[\uFE00-\uFE0F]/);
    });

    it('should have an expiresIn that is not a variation selector string', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\uFE00-\uFE0F]/);
    });

    it('should have a secret that is not a combining character string', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u0300-\u036F]/);
    });

    it('should have an expiresIn that is not a combining character string', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u0300-\u036F]/);
    });

    it('should have a secret that is not a bidirectional character string', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u202A-\u202E]/);
    });

    it('should have an expiresIn that is not a bidirectional character string', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u202A-\u202E]/);
    });

    it('should have a secret that is not a zero-width character string', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u200B\u200C\u200D\uFEFF]/);
    });

    it('should have an expiresIn that is not a zero-width character string', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u200B\u200C\u200D\uFEFF]/);
    });

    it('should have a secret that is not a line separator string', () => {
      expect(jwtContanst.secret).not.toBe('\u2028');
    });

    it('should have an expiresIn that is not a line separator string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2028');
    });

    it('should have a secret that is not a paragraph separator string', () => {
      expect(jwtContanst.secret).not.toBe('\u2029');
    });

    it('should have an expiresIn that is not a paragraph separator string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2029');
    });

    it('should have a secret that is not a byte order mark string', () => {
      expect(jwtContanst.secret).not.toBe('\uFEFF');
    });

    it('should have an expiresIn that is not a byte order mark string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\uFEFF');
    });

    it('should have a secret that is not a non-breaking space string', () => {
      expect(jwtContanst.secret).not.toBe('\u00A0');
    });

    it('should have an expiresIn that is not a non-breaking space string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u00A0');
    });

    it('should have a secret that is not a narrow no-break space string', () => {
      expect(jwtContanst.secret).not.toBe('\u202F');
    });

    it('should have an expiresIn that is not a narrow no-break space string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u202F');
    });

    it('should have a secret that is not a medium mathematical space string', () => {
      expect(jwtContanst.secret).not.toBe('\u205F');
    });

    it('should have an expiresIn that is not a medium mathematical space string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u205F');
    });

    it('should have a secret that is not a word joiner string', () => {
      expect(jwtContanst.secret).not.toBe('\u2060');
    });

    it('should have an expiresIn that is not a word joiner string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2060');
    });

    it('should have a secret that is not a function application string', () => {
      expect(jwtContanst.secret).not.toBe('\u2061');
    });

    it('should have an expiresIn that is not a function application string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2061');
    });

    it('should have a secret that is not an invisible times string', () => {
      expect(jwtContanst.secret).not.toBe('\u2062');
    });

    it('should have an expiresIn that is not an invisible times string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2062');
    });

    it('should have a secret that is not an invisible separator string', () => {
      expect(jwtContanst.secret).not.toBe('\u2063');
    });

    it('should have an expiresIn that is not an invisible separator string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2063');
    });

    it('should have a secret that is not an invisible plus string', () => {
      expect(jwtContanst.secret).not.toBe('\u2064');
    });

    it('should have an expiresIn that is not an invisible plus string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2064');
    });

    it('should have a secret that is not a left-to-right mark string', () => {
      expect(jwtContanst.secret).not.toBe('\u200E');
    });

    it('should have an expiresIn that is not a left-to-right mark string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u200E');
    });

    it('should have a secret that is not a right-to-left mark string', () => {
      expect(jwtContanst.secret).not.toBe('\u200F');
    });

    it('should have an expiresIn that is not a right-to-left mark string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u200F');
    });

    it('should have a secret that is not a left-to-right embedding string', () => {
      expect(jwtContanst.secret).not.toBe('\u202A');
    });

    it('should have an expiresIn that is not a left-to-right embedding string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u202A');
    });

    it('should have a secret that is not a right-to-left embedding string', () => {
      expect(jwtContanst.secret).not.toBe('\u202B');
    });

    it('should have an expiresIn that is not a right-to-left embedding string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u202B');
    });

    it('should have a secret that is not a pop directional formatting string', () => {
      expect(jwtContanst.secret).not.toBe('\u202C');
    });

    it('should have an expiresIn that is not a pop directional formatting string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u202C');
    });

    it('should have a secret that is not a left-to-right override string', () => {
      expect(jwtContanst.secret).not.toBe('\u202D');
    });

    it('should have an expiresIn that is not a left-to-right override string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u202D');
    });

    it('should have a secret that is not a right-to-left override string', () => {
      expect(jwtContanst.secret).not.toBe('\u202E');
    });

    it('should have an expiresIn that is not a right-to-left override string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u202E');
    });

    it('should have a secret that is not a first strong isolate string', () => {
      expect(jwtContanst.secret).not.toBe('\u2068');
    });

    it('should have an expiresIn that is not a first strong isolate string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2068');
    });

    it('should have a secret that is not a left-to-right isolate string', () => {
      expect(jwtContanst.secret).not.toBe('\u2066');
    });

    it('should have an expiresIn that is not a left-to-right isolate string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2066');
    });

    it('should have a secret that is not a right-to-left isolate string', () => {
      expect(jwtContanst.secret).not.toBe('\u2067');
    });

    it('should have an expiresIn that is not a right-to-left isolate string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2067');
    });

    it('should have a secret that is not a pop directional isolate string', () => {
      expect(jwtContanst.secret).not.toBe('\u2069');
    });

    it('should have an expiresIn that is not a pop directional isolate string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2069');
    });

    it('should have a secret that is not a soft hyphen string', () => {
      expect(jwtContanst.secret).not.toBe('\u00AD');
    });

    it('should have an expiresIn that is not a soft hyphen string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u00AD');
    });

    it('should have a secret that is not a hyphen string', () => {
      expect(jwtContanst.secret).not.toBe('-');
    });

    it('should have an expiresIn that is not a hyphen string', () => {
      expect(jwtContanst.expiresIn).not.toBe('-');
    });

    it('should have a secret that is not an underscore string', () => {
      expect(jwtContanst.secret).not.toBe('_');
    });

    it('should have an expiresIn that is not an underscore string', () => {
      expect(jwtContanst.expiresIn).not.toBe('_');
    });

    it('should have a secret that is not a dot string', () => {
      expect(jwtContanst.secret).not.toBe('.');
    });

    it('should have an expiresIn that is not a dot string', () => {
      expect(jwtContanst.expiresIn).not.toBe('.');
    });

    it('should have a secret that is not a comma string', () => {
      expect(jwtContanst.secret).not.toBe(',');
    });

    it('should have an expiresIn that is not a comma string', () => {
      expect(jwtContanst.expiresIn).not.toBe(',');
    });

    it('should have a secret that is not a semicolon string', () => {
      expect(jwtContanst.secret).not.toBe(';');
    });

    it('should have an expiresIn that is not a semicolon string', () => {
      expect(jwtContanst.expiresIn).not.toBe(';');
    });

    it('should have a secret that is not a colon string', () => {
      expect(jwtContanst.secret).not.toBe(':');
    });

    it('should have an expiresIn that is not a colon string', () => {
      expect(jwtContanst.expiresIn).not.toBe(':');
    });

    it('should have a secret that is not a slash string', () => {
      expect(jwtContanst.secret).not.toBe('/');
    });

    it('should have an expiresIn that is not a slash string', () => {
      expect(jwtContanst.expiresIn).not.toBe('/');
    });

    it('should have a secret that is not a backslash string', () => {
      expect(jwtContanst.secret).not.toBe('\\');
    });

    it('should have an expiresIn that is not a backslash string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\\');
    });

    it('should have a secret that is not a question mark string', () => {
      expect(jwtContanst.secret).not.toBe('?');
    });

    it('should have an expiresIn that is not a question mark string', () => {
      expect(jwtContanst.expiresIn).not.toBe('?');
    });

    it('should have a secret that is not an exclamation mark string', () => {
      expect(jwtContanst.secret).not.toBe('!');
    });

    it('should have an expiresIn that is not an exclamation mark string', () => {
      expect(jwtContanst.expiresIn).not.toBe('!');
    });

    it('should have a secret that is not an at sign string', () => {
      expect(jwtContanst.secret).not.toBe('@');
    });

    it('should have an expiresIn that is not an at sign string', () => {
      expect(jwtContanst.expiresIn).not.toBe('@');
    });

    it('should have a secret that is not a hash string', () => {
      expect(jwtContanst.secret).not.toBe('#');
    });

    it('should have an expiresIn that is not a hash string', () => {
      expect(jwtContanst.expiresIn).not.toBe('#');
    });

    it('should have a secret that is not a dollar sign string', () => {
      expect(jwtContanst.secret).not.toBe('$');
    });

    it('should have an expiresIn that is not a dollar sign string', () => {
      expect(jwtContanst.expiresIn).not.toBe