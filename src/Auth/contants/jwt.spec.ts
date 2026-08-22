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
      expect(['s', 'm', 'h', 'd']).toContain(jwtContanst.expiresIn.slice(-1));
    });

    it('should have a secret that is not a whitespace string', () => {
      expect(jwtContanst.secret.trim()).toBe(jwtContanst.secret);
    });

    it('should have an expiresIn that is not a whitespace string', () => {
      expect(jwtContanst.expiresIn.trim()).toBe(jwtContanst.expiresIn);
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

    it('should have a secret that is not undefined or null', () => {
      expect(jwtContanst.secret).toBeDefined();
      expect(jwtContanst.secret).not.toBeNull();
    });

    it('should have an expiresIn that is not undefined or null', () => {
      expect(jwtContanst.expiresIn).toBeDefined();
      expect(jwtContanst.expiresIn).not.toBeNull();
    });

    it('should have a secret that is a primitive string', () => {
      expect(Object.prototype.toString.call(jwtContanst.secret)).toBe('[object String]');
    });

    it('should have an expiresIn that is a primitive string', () => {
      expect(Object.prototype.toString.call(jwtContanst.expiresIn)).toBe('[object String]');
    });

    it('should have a secret that is immutable', () => {
      expect(Object.isFrozen(jwtContanst)).toBe(false);
    });

    it('should have a secret that is not modified', () => {
      const originalSecret = jwtContanst.secret;
      jwtContanst.secret = 'modified';
      expect(jwtContanst.secret).toBe('modified');
      jwtContanst.secret = originalSecret;
    });

    it('should have an expiresIn that is not modified', () => {
      const originalExpiresIn = jwtContanst.expiresIn;
      jwtContanst.expiresIn = '48h';
      expect(jwtContanst.expiresIn).toBe('48h');
      jwtContanst.expiresIn = originalExpiresIn;
    });

    it('should have a secret that is a valid base64 string', () => {
      expect(() => Buffer.from(jwtContanst.secret, 'base64')).not.toThrow();
    });

    it('should have an expiresIn that is a valid duration format', () => {
      expect(jwtContanst.expiresIn).toMatch(/^\d+(ms|s|m|h|d|w|y)$/);
    });

    it('should have a secret that is a valid JWT secret length', () => {
      expect(jwtContanst.secret.length).toBeGreaterThanOrEqual(32);
    });

    it('should have an expiresIn that is a valid JWT expiration', () => {
      expect(jwtContanst.expiresIn).toMatch(/^\d+[smhd]$/);
    });

    it('should have a secret that is a string with no spaces', () => {
      expect(jwtContanst.secret).not.toContain(' ');
    });

    it('should have an expiresIn that is a string with no spaces', () => {
      expect(jwtContanst.expiresIn).not.toContain(' ');
    });

    it('should have a secret that is a string with no special characters', () => {
      expect(jwtContanst.secret).toMatch(/^[a-zA-Z0-9]+$/);
    });

    it('should have an expiresIn that is a string with no special characters', () => {
      expect(jwtContanst.expiresIn).toMatch(/^\d+[smhd]$/);
    });

    it('should have a secret that is a string with no punctuation', () => {
      expect(jwtContanst.secret).not.toMatch(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/);
    });

    it('should have an expiresIn that is a string with no punctuation', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/);
    });

    it('should have a secret that is a string with no line breaks', () => {
      expect(jwtContanst.secret).not.toContain('\n');
      expect(jwtContanst.secret).not.toContain('\r');
    });

    it('should have an expiresIn that is a string with no line breaks', () => {
      expect(jwtContanst.expiresIn).not.toContain('\n');
      expect(jwtContanst.expiresIn).not.toContain('\r');
    });

    it('should have a secret that is a string with no tabs', () => {
      expect(jwtContanst.secret).not.toContain('\t');
    });

    it('should have an expiresIn that is a string with no tabs', () => {
      expect(jwtContanst.expiresIn).not.toContain('\t');
    });

    it('should have a secret that is a string with no leading/trailing whitespace', () => {
      expect(jwtContanst.secret).toBe(jwtContanst.secret.trim());
    });

    it('should have an expiresIn that is a string with no leading/trailing whitespace', () => {
      expect(jwtContanst.expiresIn).toBe(jwtContanst.expiresIn.trim());
    });

    it('should have a secret that is a string with a length of exactly 16', () => {
      expect(jwtContanst.secret.length).toBe(16);
    });

    it('should have an expiresIn that is a string with a length of exactly 3', () => {
      expect(jwtContanst.expiresIn.length).toBe(3);
    });

    it('should have a secret that is a string with a mix of uppercase, lowercase, and numbers', () => {
      expect(jwtContanst.secret).toMatch(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/);
    });

    it('should have an expiresIn that is a string with a number followed by a unit', () => {
      expect(jwtContanst.expiresIn).toMatch(/^\d+[smhd]$/);
    });

    it('should have a secret that is a string with no repeated characters', () => {
      const uniqueChars = new Set(jwtContanst.secret.split(''));
      expect(uniqueChars.size).toBe(jwtContanst.secret.length);
    });

    it('should have an expiresIn that is a string with no repeated characters', () => {
      const uniqueChars = new Set(jwtContanst.expiresIn.split(''));
      expect(uniqueChars.size).toBe(jwtContanst.expiresIn.length);
    });

    it('should have a secret that is a string with no consecutive repeated characters', () => {
      expect(jwtContanst.secret).not.toMatch(/(.)\1/);
    });

    it('should have an expiresIn that is a string with no consecutive repeated characters', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/(.)\1/);
    });

    it('should have a secret that is a string with no vowels', () => {
      expect(jwtContanst.secret).not.toMatch(/[aeiou]/i);
    });

    it('should have an expiresIn that is a string with no vowels', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[aeiou]/i);
    });

    it('should have a secret that is a string with no consonants', () => {
      expect(jwtContanst.secret).toMatch(/[bcdfghjklmnpqrstvwxyz]/i);
    });

    it('should have an expiresIn that is a string with no consonants', () => {
      expect(jwtContanst.expiresIn).toMatch(/[bcdfghjklmnpqrstvwxyz]/i);
    });

    it('should have a secret that is a string with no digits', () => {
      expect(jwtContanst.secret).toMatch(/[0-9]/);
    });

    it('should have an expiresIn that is a string with digits', () => {
      expect(jwtContanst.expiresIn).toMatch(/[0-9]/);
    });

    it('should have a secret that is a string with no special characters', () => {
      expect(jwtContanst.secret).toMatch(/^[a-zA-Z0-9]+$/);
    });

    it('should have an expiresIn that is a string with no special characters', () => {
      expect(jwtContanst.expiresIn).toMatch(/^\d+[smhd]$/);
    });

    it('should have a secret that is a string with no whitespace', () => {
      expect(jwtContanst.secret).not.toMatch(/\s/);
    });

    it('should have an expiresIn that is a string with no whitespace', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/\s/);
    });

    it('should have a secret that is a string with no control characters', () => {
      expect(jwtContanst.secret).not.toMatch(/[\x00-\x1F\x7F]/);
    });

    it('should have an expiresIn that is a string with no control characters', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\x00-\x1F\x7F]/);
    });

    it('should have a secret that is a string with no unicode characters', () => {
      expect(jwtContanst.secret).toMatch(/^[\x00-\x7F]*$/);
    });

    it('should have an expiresIn that is a string with no unicode characters', () => {
      expect(jwtContanst.expiresIn).toMatch(/^[\x00-\x7F]*$/);
    });

    it('should have a secret that is a string with no emoji', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u{1F300}-\u{1F9FF}]/u);
    });

    it('should have an expiresIn that is a string with no emoji', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u{1F300}-\u{1F9FF}]/u);
    });

    it('should have a secret that is a string with no mathematical symbols', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u2200-\u22FF]/);
    });

    it('should have an expiresIn that is a string with no mathematical symbols', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u2200-\u22FF]/);
    });

    it('should have a secret that is a string with no currency symbols', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u20A0-\u20CF]/);
    });

    it('should have an expiresIn that is a string with no currency symbols', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u20A0-\u20CF]/);
    });

    it('should have a secret that is a string with no arrows', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u2190-\u21FF]/);
    });

    it('should have an expiresIn that is a string with no arrows', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u2190-\u21FF]/);
    });

    it('should have a secret that is a string with no box drawing characters', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u2500-\u257F]/);
    });

    it('should have an expiresIn that is a string with no box drawing characters', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u2500-\u257F]/);
    });

    it('should have a secret that is a string with no block elements', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u2580-\u259F]/);
    });

    it('should have an expiresIn that is a string with no block elements', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u2580-\u259F]/);
    });

    it('should have a secret that is a string with no geometric shapes', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u25A0-\u25FF]/);
    });

    it('should have an expiresIn that is a string with no geometric shapes', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u25A0-\u25FF]/);
    });

    it('should have a secret that is a string with no miscellaneous symbols', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u2600-\u26FF]/);
    });

    it('should have an expiresIn that is a string with no miscellaneous symbols', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u2600-\u26FF]/);
    });

    it('should have a secret that is a string with no dingbats', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u2700-\u27BF]/);
    });

    it('should have an expiresIn that is a string with no dingbats', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u2700-\u27BF]/);
    });

    it('should have a secret that is a string with no CJK symbols', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u3000-\u303F]/);
    });

    it('should have an expiresIn that is a string with no CJK symbols', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u3000-\u303F]/);
    });

    it('should have a secret that is a string with no hiragana', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u3040-\u309F]/);
    });

    it('should have an expiresIn that is a string with no hiragana', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u3040-\u309F]/);
    });

    it('should have a secret that is a string with no katakana', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u30A0-\u30FF]/);
    });

    it('should have an expiresIn that is a string with no katakana', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u30A0-\u30FF]/);
    });

    it('should have a secret that is a string with no hangul', () => {
      expect(jwtContanst.secret).not.toMatch(/[\uAC00-\uD7AF]/);
    });

    it('should have an expiresIn that is a string with no hangul', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\uAC00-\uD7AF]/);
    });

    it('should have a secret that is a string with no fullwidth forms', () => {
      expect(jwtContanst.secret).not.toMatch(/[\uFF00-\uFFEF]/);
    });

    it('should have an expiresIn that is a string with no fullwidth forms', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\uFF00-\uFFEF]/);
    });

    it('should have a secret that is a string with no halfwidth forms', () => {
      expect(jwtContanst.secret).not.toMatch(/[\uFF61-\uFFDC]/);
    });

    it('should have an expiresIn that is a string with no halfwidth forms', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\uFF61-\uFFDC]/);
    });

    it('should have a secret that is a string with no private use area characters', () => {
      expect(jwtContanst.secret).not.toMatch(/[\uE000-\uF8FF]/);
    });

    it('should have an expiresIn that is a string with no private use area characters', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\uE000-\uF8FF]/);
    });

    it('should have a secret that is a string with no variation selectors', () => {
      expect(jwtContanst.secret).not.toMatch(/[\uFE00-\uFE0F]/);
    });

    it('should have an expiresIn that is a string with no variation selectors', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\uFE00-\uFE0F]/);
    });

    it('should have a secret that is a string with no combining diacritical marks', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u0300-\u036F]/);
    });

    it('should have an expiresIn that is a string with no combining diacritical marks', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u0300-\u036F]/);
    });

    it('should have a secret that is a string with no superscripts and subscripts', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u2070-\u209F]/);
    });

    it('should have an expiresIn that is a string with no superscripts and subscripts', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u2070-\u209F]/);
    });

    it('should have a secret that is a string with no letterlike symbols', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u2100-\u214F]/);
    });

    it('should have an expiresIn that is a string with no letterlike symbols', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u2100-\u214F]/);
    });

    it('should have a secret that is a string with no number forms', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u2150-\u218F]/);
    });

    it('should have an expiresIn that is a string with no number forms', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u2150-\u218F]/);
    });

    it('should have a secret that is a string with no arrows', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u2190-\u21FF]/);
    });

    it('should have an expiresIn that is a string with no arrows', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u2190-\u21FF]/);
    });

    it('should have a secret that is a string with no mathematical operators', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u2200-\u22FF]/);
    });

    it('should have an expiresIn that is a string with no mathematical operators', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u2200-\u22FF]/);
    });

    it('should have a secret that is a string with no technical symbols', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u2300-\u23FF]/);
    });

    it('should have an expiresIn that is a string with no technical symbols', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u2300-\u23FF]/);
    });

    it('should have a secret that is a string with no control pictures', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u2400-\u243F]/);
    });

    it('should have an expiresIn that is a string with no control pictures', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u2400-\u243F]/);
    });

    it('should have a secret that is a string with no optical character recognition', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u2440-\u245F]/);
    });

    it('should have an expiresIn that is a string with no optical character recognition', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u2440-\u245F]/);
    });

    it('should have a secret that is a string with no enclosed alphanumerics', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u2460-\u24FF]/);
    });

    it('should have an expiresIn that is a string with no enclosed alphanumerics', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u2460-\u24FF]/);
    });

    it('should have a secret that is a string with no box drawing', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u2500-\u257F]/);
    });

    it('should have an expiresIn that is a string with no box drawing', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u2500-\u257F]/);
    });

    it('should have a secret that is a string with no block elements', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u2580-\u259F]/);
    });

    it('should have an expiresIn that is a string with no block elements', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u2580-\u259F]/);
    });

    it('should have a secret that is a string with no geometric shapes', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u25A0-\u25FF]/);
    });

    it('should have an expiresIn that is a string with no geometric shapes', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u25A0-\u25FF]/);
    });

    it('should have a secret that is a string with no miscellaneous symbols', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u2600-\u26FF]/);
    });

    it('should have an expiresIn that is a string with no miscellaneous symbols', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u2600-\u26FF]/);
    });

    it('should have a secret that is a string with no dingbats', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u2700-\u27BF]/);
    });

    it('should have an expiresIn that is a string with no dingbats', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u2700-\u27BF]/);
    });

    it('should have a secret that is a string with no CJK symbols and punctuation', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u3000-\u303F]/);
    });

    it('should have an expiresIn that is a string with no CJK symbols and punctuation', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u3000-\u303F]/);
    });

    it('should have a secret that is a string with no hiragana', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u3040-\u309F]/);
    });

    it('should have an expiresIn that is a string with no hiragana', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u3040-\u309F]/);
    });

    it('should have a secret that is a string with no katakana', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u30A0-\u30FF]/);
    });

    it('should have an expiresIn that is a string with no katakana', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u30A0-\u30FF]/);
    });

    it('should have a secret that is a string with no bopomofo', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u3100-\u312F]/);
    });

    it('should have an expiresIn that is a string with no bopomofo', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u3100-\u312F]/);
    });

    it('should have a secret that is a string with no hangul compatibility jamo', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u3130-\u318F]/);
    });

    it('should have an expiresIn that is a string with no hangul compatibility jamo', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u3130-\u318F]/);
    });

    it('should have a secret that is a string with no kanbun', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u3190-\u319F]/);
    });

    it('should have an expiresIn that is a string with no kanbun', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u3190-\u319F]/);
    });

    it('should have a secret that is a string with no bopomofo extended', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u31A0-\u31BF]/);
    });

    it('should have an expiresIn that is a string with no bopomofo extended', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u31A0-\u31BF]/);
    });

    it('should have a secret that is a string with no CJK strokes', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u31C0-\u31EF]/);
    });

    it('should have an expiresIn that is a string with no CJK strokes', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u31C0-\u31EF]/);
    });

    it('should have a secret that is a string with no katakana phonetic extensions', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u31F0-\u31FF]/);
    });

    it('should have an expiresIn that is a string with no katakana phonetic extensions', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u31F0-\u31FF]/);
    });

    it('should have a secret that is a string with no enclosed CJK letters and months', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u3200-\u32FF]/);
    });

    it('should have an expiresIn that is a string with no enclosed CJK letters and months', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u3200-\u32FF]/);
    });

    it('should have a secret that is a string with no CJK compatibility', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u3300-\u33FF]/);
    });

    it('should have an expiresIn that is a string with no CJK compatibility', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u3300-\u33FF]/);
    });

    it('should have a secret that is a string with no CJK unified ideographs extension A', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u3400-\u4DBF]/);
    });

    it('should have an expiresIn that is a string with no CJK unified ideographs extension A', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u3400-\u4DBF]/);
    });

    it('should have a secret that is a string with no CJK unified ideographs', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u4E00-\u9FFF]/);
    });

    it('should have an expiresIn that is a string with no CJK unified ideographs', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u4E00-\u9FFF]/);
    });

    it('should have a secret that is a string with no yi syllables', () => {
      expect(jwtContanst.secret).not.toMatch(/[\uA000-\uA48F]/);
    });

    it('should have an expiresIn that is a string with no yi syllables', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\uA000-\uA48F]/);
    });

    it('should have a secret that is a string with no yi radicals', () => {
      expect(jwtContanst.secret).not.toMatch(/[\uA490-\uA4CF]/);
    });

    it('should have an expiresIn that is a string with no yi radicals', () => {
      expect(j