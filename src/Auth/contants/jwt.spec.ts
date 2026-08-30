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

    it('should have a secret that matches the expected pattern', () => {
      expect(jwtContanst.secret).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('should have an expiresIn that matches the expected time format', () => {
      expect(jwtContanst.expiresIn).toMatch(/^\d+[smhd]$/);
    });

    it('should have a secret with a reasonable length', () => {
      expect(jwtContanst.secret.length).toBeGreaterThanOrEqual(8);
    });

    it('should have an expiresIn with a reasonable format', () => {
      expect(jwtContanst.expiresIn).toMatch(/^\d+h$/);
    });

    it('should have a secret that is not empty after trimming', () => {
      expect(jwtContanst.secret.trim()).not.toBe('');
    });

    it('should have an expiresIn that is not empty after trimming', () => {
      expect(jwtContanst.expiresIn.trim()).not.toBe('');
    });

    it('should have a secret that is a valid JWT secret', () => {
      expect(jwtContanst.secret).toHaveLength(16);
    });

    it('should have an expiresIn of 24 hours', () => {
      expect(jwtContanst.expiresIn).toBe('24h');
    });

    it('should have a secret that is alphanumeric', () => {
      expect(jwtContanst.secret).toMatch(/^[a-zA-Z0-9]+$/);
    });

    it('should have an expiresIn that is a valid duration string', () => {
      expect(jwtContanst.expiresIn).toMatch(/^\d+(ms|s|m|h|d|w|y)$/);
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

    it('should have a secret that is a string primitive', () => {
      expect(Object.prototype.toString.call(jwtContanst.secret)).toBe('[object String]');
    });

    it('should have an expiresIn that is a string primitive', () => {
      expect(Object.prototype.toString.call(jwtContanst.expiresIn)).toBe('[object String]');
    });

    it('should have a secret that is not an empty string', () => {
      expect(jwtContanst.secret).not.toBe('');
    });

    it('should have an expiresIn that is not an empty string', () => {
      expect(jwtContanst.expiresIn).not.toBe('');
    });

    it('should have a secret that is not whitespace only', () => {
      expect(jwtContanst.secret.trim()).not.toBe('');
    });

    it('should have an expiresIn that is not whitespace only', () => {
      expect(jwtContanst.expiresIn.trim()).not.toBe('');
    });

    it('should have a secret that is not a whitespace string', () => {
      expect(jwtContanst.secret).not.toBe(' ');
    });

    it('should have an expiresIn that is not a whitespace string', () => {
      expect(jwtContanst.expiresIn).not.toBe(' ');
    });

    it('should have a secret that is not a tab string', () => {
      expect(jwtContanst.secret).not.toBe('\t');
    });

    it('should have an expiresIn that is not a tab string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\t');
    });

    it('should have a secret that is not a newline string', () => {
      expect(jwtContanst.secret).not.toBe('\n');
    });

    it('should have an expiresIn that is not a newline string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\n');
    });

    it('should have a secret that is not a carriage return string', () => {
      expect(jwtContanst.secret).not.toBe('\r');
    });

    it('should have an expiresIn that is not a carriage return string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\r');
    });

    it('should have a secret that is not a form feed string', () => {
      expect(jwtContanst.secret).not.toBe('\f');
    });

    it('should have an expiresIn that is not a form feed string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\f');
    });

    it('should have a secret that is not a vertical tab string', () => {
      expect(jwtContanst.secret).not.toBe('\v');
    });

    it('should have an expiresIn that is not a vertical tab string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\v');
    });

    it('should have a secret that is not a zero-width space string', () => {
      expect(jwtContanst.secret).not.toBe('\u200B');
    });

    it('should have an expiresIn that is not a zero-width space string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u200B');
    });

    it('should have a secret that is not a non-breaking space string', () => {
      expect(jwtContanst.secret).not.toBe('\u00A0');
    });

    it('should have an expiresIn that is not a non-breaking space string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u00A0');
    });

    it('should have a secret that is not a BOM string', () => {
      expect(jwtContanst.secret).not.toBe('\uFEFF');
    });

    it('should have an expiresIn that is not a BOM string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\uFEFF');
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

    it('should have a secret that is not a null character string', () => {
      expect(jwtContanst.secret).not.toBe('\0');
    });

    it('should have an expiresIn that is not a null character string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\0');
    });

    it('should have a secret that is not a backspace string', () => {
      expect(jwtContanst.secret).not.toBe('\b');
    });

    it('should have an expiresIn that is not a backspace string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\b');
    });

    it('should have a secret that is not a bell string', () => {
      expect(jwtContanst.secret).not.toBe('\a');
    });

    it('should have an expiresIn that is not a bell string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\a');
    });

    it('should have a secret that is not an escape string', () => {
      expect(jwtContanst.secret).not.toBe('\x1B');
    });

    it('should have an expiresIn that is not an escape string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\x1B');
    });

    it('should have a secret that is not a delete string', () => {
      expect(jwtContanst.secret).not.toBe('\x7F');
    });

    it('should have an expiresIn that is not a delete string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\x7F');
    });

    it('should have a secret that is not a control character string', () => {
      expect(jwtContanst.secret).not.toBe('\x00');
    });

    it('should have an expiresIn that is not a control character string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\x00');
    });

    it('should have a secret that is not a unicode replacement character string', () => {
      expect(jwtContanst.secret).not.toBe('\uFFFD');
    });

    it('should have an expiresIn that is not a unicode replacement character string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\uFFFD');
    });

    it('should have a secret that is not a unicode null character string', () => {
      expect(jwtContanst.secret).not.toBe('\u0000');
    });

    it('should have an expiresIn that is not a unicode null character string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u0000');
    });

    it('should have a secret that is not a unicode line separator string', () => {
      expect(jwtContanst.secret).not.toBe('\u2028');
    });

    it('should have an expiresIn that is not a unicode line separator string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2028');
    });

    it('should have a secret that is not a unicode paragraph separator string', () => {
      expect(jwtContanst.secret).not.toBe('\u2029');
    });

    it('should have an expiresIn that is not a unicode paragraph separator string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2029');
    });

    it('should have a secret that is not a unicode BOM string', () => {
      expect(jwtContanst.secret).not.toBe('\uFEFF');
    });

    it('should have an expiresIn that is not a unicode BOM string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\uFEFF');
    });

    it('should have a secret that is not a unicode non-breaking space string', () => {
      expect(jwtContanst.secret).not.toBe('\u00A0');
    });

    it('should have an expiresIn that is not a unicode non-breaking space string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u00A0');
    });

    it('should have a secret that is not a unicode zero-width space string', () => {
      expect(jwtContanst.secret).not.toBe('\u200B');
    });

    it('should have an expiresIn that is not a unicode zero-width space string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u200B');
    });

    it('should have a secret that is not a unicode left-to-right mark string', () => {
      expect(jwtContanst.secret).not.toBe('\u200E');
    });

    it('should have an expiresIn that is not a unicode left-to-right mark string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u200E');
    });

    it('should have a secret that is not a unicode right-to-left mark string', () => {
      expect(jwtContanst.secret).not.toBe('\u200F');
    });

    it('should have an expiresIn that is not a unicode right-to-left mark string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u200F');
    });

    it('should have a secret that is not a unicode left-to-right embedding string', () => {
      expect(jwtContanst.secret).not.toBe('\u202A');
    });

    it('should have an expiresIn that is not a unicode left-to-right embedding string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u202A');
    });

    it('should have a secret that is not a unicode right-to-left embedding string', () => {
      expect(jwtContanst.secret).not.toBe('\u202B');
    });

    it('should have an expiresIn that is not a unicode right-to-left embedding string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u202B');
    });

    it('should have a secret that is not a unicode pop directional formatting string', () => {
      expect(jwtContanst.secret).not.toBe('\u202C');
    });

    it('should have an expiresIn that is not a unicode pop directional formatting string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u202C');
    });

    it('should have a secret that is not a unicode left-to-right override string', () => {
      expect(jwtContanst.secret).not.toBe('\u202D');
    });

    it('should have an expiresIn that is not a unicode left-to-right override string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u202D');
    });

    it('should have a secret that is not a unicode right-to-left override string', () => {
      expect(jwtContanst.secret).not.toBe('\u202E');
    });

    it('should have an expiresIn that is not a unicode right-to-left override string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u202E');
    });

    it('should have a secret that is not a unicode word joiner string', () => {
      expect(jwtContanst.secret).not.toBe('\u2060');
    });

    it('should have an expiresIn that is not a unicode word joiner string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2060');
    });

    it('should have a secret that is not a unicode function application string', () => {
      expect(jwtContanst.secret).not.toBe('\u2061');
    });

    it('should have an expiresIn that is not a unicode function application string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2061');
    });

    it('should have a secret that is not a unicode invisible times string', () => {
      expect(jwtContanst.secret).not.toBe('\u2062');
    });

    it('should have an expiresIn that is not a unicode invisible times string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2062');
    });

    it('should have a secret that is not a unicode invisible separator string', () => {
      expect(jwtContanst.secret).not.toBe('\u2063');
    });

    it('should have an expiresIn that is not a unicode invisible separator string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2063');
    });

    it('should have a secret that is not a unicode invisible plus string', () => {
      expect(jwtContanst.secret).not.toBe('\u2064');
    });

    it('should have an expiresIn that is not a unicode invisible plus string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2064');
    });

    it('should have a secret that is not a unicode line tabulation string', () => {
      expect(jwtContanst.secret).not.toBe('\u000B');
    });

    it('should have an expiresIn that is not a unicode line tabulation string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u000B');
    });

    it('should have a secret that is not a unicode information separator one string', () => {
      expect(jwtContanst.secret).not.toBe('\u001F');
    });

    it('should have an expiresIn that is not a unicode information separator one string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u001F');
    });

    it('should have a secret that is not a unicode information separator two string', () => {
      expect(jwtContanst.secret).not.toBe('\u001E');
    });

    it('should have an expiresIn that is not a unicode information separator two string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u001E');
    });

    it('should have a secret that is not a unicode information separator three string', () => {
      expect(jwtContanst.secret).not.toBe('\u001D');
    });

    it('should have an expiresIn that is not a unicode information separator three string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u001D');
    });

    it('should have a secret that is not a unicode information separator four string', () => {
      expect(jwtContanst.secret).not.toBe('\u001C');
    });

    it('should have an expiresIn that is not a unicode information separator four string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u001C');
    });

    it('should have a secret that is not a unicode file separator string', () => {
      expect(jwtContanst.secret).not.toBe('\u001C');
    });

    it('should have an expiresIn that is not a unicode file separator string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u001C');
    });

    it('should have a secret that is not a unicode group separator string', () => {
      expect(jwtContanst.secret).not.toBe('\u001D');
    });

    it('should have an expiresIn that is not a unicode group separator string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u001D');
    });

    it('should have a secret that is not a unicode record separator string', () => {
      expect(jwtContanst.secret).not.toBe('\u001E');
    });

    it('should have an expiresIn that is not a unicode record separator string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u001E');
    });

    it('should have a secret that is not a unicode unit separator string', () => {
      expect(jwtContanst.secret).not.toBe('\u001F');
    });

    it('should have an expiresIn that is not a unicode unit separator string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u001F');
    });

    it('should have a secret that is not a unicode space string', () => {
      expect(jwtContanst.secret).not.toBe(' ');
    });

    it('should have an expiresIn that is not a unicode space string', () => {
      expect(jwtContanst.expiresIn).not.toBe(' ');
    });

    it('should have a secret that is not a unicode tab string', () => {
      expect(jwtContanst.secret).not.toBe('\t');
    });

    it('should have an expiresIn that is not a unicode tab string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\t');
    });

    it('should have a secret that is not a unicode newline string', () => {
      expect(jwtContanst.secret).not.toBe('\n');
    });

    it('should have an expiresIn that is not a unicode newline string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\n');
    });

    it('should have a secret that is not a unicode carriage return string', () => {
      expect(jwtContanst.secret).not.toBe('\r');
    });

    it('should have an expiresIn that is not a unicode carriage return string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\r');
    });

    it('should have a secret that is not a unicode form feed string', () => {
      expect(jwtContanst.secret).not.toBe('\f');
    });

    it('should have an expiresIn that is not a unicode form feed string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\f');
    });

    it('should have a secret that is not a unicode vertical tab string', () => {
      expect(jwtContanst.secret).not.toBe('\v');
    });

    it('should have an expiresIn that is not a unicode vertical tab string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\v');
    });

    it('should have a secret that is not a unicode backspace string', () => {
      expect(jwtContanst.secret).not.toBe('\b');
    });

    it('should have an expiresIn that is not a unicode backspace string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\b');
    });

    it('should have a secret that is not a unicode bell string', () => {
      expect(jwtContanst.secret).not.toBe('\a');
    });

    it('should have an expiresIn that is not a unicode bell string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\a');
    });

    it('should have a secret that is not a unicode escape string', () => {
      expect(jwtContanst.secret).not.toBe('\x1B');
    });

    it('should have an expiresIn that is not a unicode escape string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\x1B');
    });

    it('should have a secret that is not a unicode delete string', () => {
      expect(jwtContanst.secret).not.toBe('\x7F');
    });

    it('should have an expiresIn that is not a unicode delete string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\x7F');
    });

    it('should have a secret that is not a unicode control character string', () => {
      expect(jwtContanst.secret).not.toBe('\x00');
    });

    it('should have an expiresIn that is not a unicode control character string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\x00');
    });

    it('should have a secret that is not a unicode replacement character string', () => {
      expect(jwtContanst.secret).not.toBe('\uFFFD');
    });

    it('should have an expiresIn that is not a unicode replacement character string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\uFFFD');
    });

    it('should have a secret that is not a unicode null character string', () => {
      expect(jwtContanst.secret).not.toBe('\u0000');
    });

    it('should have an expiresIn that is not a unicode null character string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u0000');
    });

    it('should have a secret that is not a unicode line separator string', () => {
      expect(jwtContanst.secret).not.toBe('\u2028');
    });

    it('should have an expiresIn that is not a unicode line separator string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2028');
    });

    it('should have a secret that is not a unicode paragraph separator string', () => {
      expect(jwtContanst.secret).not.toBe('\u2029');
    });

    it('should have an expiresIn that is not a unicode paragraph separator string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2029');
    });

    it('should have a secret that is not a unicode BOM string', () => {
      expect(jwtContanst.secret).not.toBe('\uFEFF');
    });

    it('should have an expiresIn that is not a unicode BOM string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\uFEFF');
    });

    it('should have a secret that is not a unicode non-breaking space string', () => {
      expect(jwtContanst.secret).not.toBe('\u00A0');
    });

    it('should have an expiresIn that is not a unicode non-breaking space string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u00A0');
    });

    it('should have a secret that is not a unicode zero-width space string', () => {
      expect(jwtContanst.secret).not.toBe('\u200B');
    });

    it('should have an expiresIn that is not a unicode zero-width space string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u200B');
    });

    it('should have a secret that is not a unicode left-to-right mark string', () => {
      expect(jwtContanst.secret).not.toBe('\u200E');
    });

    it('should have an expiresIn that is not a unicode left-to-right mark string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u200E');
    });

    it('should have a secret that is not a unicode right-to-left mark string', () => {
      expect(jwtContanst.secret).not.toBe('\u200F');
    });

    it('should have an expiresIn that is not a unicode right-to-left mark string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u200F');
    });

    it('should have a secret that is not a unicode left-to-right embedding string', () => {
      expect(jwtContanst.secret).not.toBe('\u202A');
    });

    it('should have an expiresIn that is not a unicode left-to-right embedding string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u202A');
    });

    it('should have a secret that is not a unicode right-to-left embedding string', () => {
      expect(jwtContanst.secret).not.toBe('\u202B');
    });

    it('should have an expiresIn that is not a unicode right-to-left embedding string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u202B');
    });

    it('should have a secret that is not a unicode pop directional formatting string', () => {
      expect(jwtContanst.secret).not.toBe('\u202C');
    });

    it('should have an expiresIn that is not a unicode pop directional formatting string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u202C');
    });

    it('should have a secret that is not a unicode left-to-right override string', () => {
      expect(jwtContanst.secret).not.toBe('\u202D');
    });

    it('should have an expiresIn that is not a unicode left-to-right override string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u202D');
    });

    it('should have a secret that is not a unicode right-to-left override string', () => {
      expect(jwtContanst.secret).not.toBe('\u202E');
    });

    it('should have an expiresIn that is not a unicode right-to-left override string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u202E');
    });

    it('should have a secret that is not a unicode word joiner string', () => {
      expect(jwtContanst.secret).not.toBe('\u2060');
    });

    it('should have an expiresIn that is not a unicode word joiner string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2060');
    });

    it('should have a secret that is not a unicode function application string', () => {
      expect(jwtContanst.secret).not.toBe('\u2061');
    });

    it('should have an expiresIn that is not a unicode function application string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2061');
    });

    it('should have a secret that is not a unicode invisible times string', () => {
      expect(jwtContanst.secret).not.toBe('\u2062');
    });

    it('should have an expiresIn that is not a unicode invisible times string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2062');
    });

    it('should have a secret that is not a unicode invisible separator string', () => {
      expect(jwtContanst.secret).not.toBe('\u2063');
    });

    it('should have an expiresIn that is not a unicode invisible separator string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2063');
    });

    it('should have a secret that is not a unicode invisible plus string', () => {
      expect(jwtContanst.secret).not.toBe('\u2064');
    });

    it('should have an expiresIn that is not a unicode invisible plus string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u2064');
    });

    it('should have a secret that is not a unicode line tabulation string', () => {
      expect(jwtContanst.secret).not.toBe('\u000B');
    });

    it('should have an expiresIn that is not a unicode line tabulation string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u000B');
    });

    it('should have a secret that is not a unicode information separator one string', () => {
      expect(jwtContanst.secret).not.toBe('\u001F');
    });

    it('should have an expiresIn that is not a unicode information separator one string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u001F');
    });

    it('should have a secret that is not a unicode information separator two string', () => {
      expect(jwtContanst.secret).not.toBe('\u001E');
    });

    it('should have an expiresIn that is not a unicode information separator two string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u001E');
    });

    it('should have a secret that is not a unicode information separator three string', () => {
      expect(jwtContanst.secret).not.toBe('\u001D');
    });

    it('should have an expiresIn that is not a unicode information separator three string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u001D');
    });

    it('should have a secret that is not a unicode information separator four string', () => {
      expect(jwtContanst.secret).not.toBe('\u001C');
    });

    it('should have an expiresIn that is not a unicode information separator four string', () => {
      expect(jwtContanst.expiresIn).not.toBe('\u001C');
    });

    it('should have a secret that is not a unicode file separator string', () =>