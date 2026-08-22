import { Test, TestingModule } from '@nestjs/testing';
import { jwtContanst } from './jwt';

describe('jwtContanst', () => {
  describe('jwtContanst object', () => {
    it('should be defined', () => {
      expect(jwtContanst).toBeDefined();
    });

    it('should have a secret property', () => {
      expect(jwtContanst.secret).toBeDefined();
    });

    it('should have an expiresIn property', () => {
      expect(jwtContanst.expiresIn).toBeDefined();
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

    it('should have a string type for secret', () => {
      expect(typeof jwtContanst.secret).toBe('string');
    });

    it('should have a string type for expiresIn', () => {
      expect(typeof jwtContanst.expiresIn).toBe('string');
    });

    it('should have a secret with at least 8 characters', () => {
      expect(jwtContanst.secret.length).toBeGreaterThanOrEqual(8);
    });

    it('should have an expiresIn that includes a number', () => {
      expect(jwtContanst.expiresIn).toMatch(/\d/);
    });

    it('should have an expiresIn that includes a time unit', () => {
      expect(jwtContanst.expiresIn).toMatch(/[smhdw]/i);
    });

    it('should have a secret that is not empty string', () => {
      expect(jwtContanst.secret).not.toBe('');
    });

    it('should have an expiresIn that is not empty string', () => {
      expect(jwtContanst.expiresIn).not.toBe('');
    });

    it('should have a secret that is not null', () => {
      expect(jwtContanst.secret).not.toBeNull();
    });

    it('should have an expiresIn that is not null', () => {
      expect(jwtContanst.expiresIn).not.toBeNull();
    });

    it('should have a secret that is not undefined', () => {
      expect(jwtContanst.secret).not.toBeUndefined();
    });

    it('should have an expiresIn that is not undefined', () => {
      expect(jwtContanst.expiresIn).not.toBeUndefined();
    });

    it('should have a secret that is a valid JWT secret format', () => {
      expect(jwtContanst.secret).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    it('should have an expiresIn that is a valid duration format', () => {
      expect(jwtContanst.expiresIn).toMatch(/^\d+[smhdw]$/);
    });

    it('should have a secret with mixed case characters', () => {
      expect(jwtContanst.secret).toMatch(/[a-z]/);
      expect(jwtContanst.secret).toMatch(/[A-Z]/);
    });

    it('should have a secret with numbers', () => {
      expect(jwtContanst.secret).toMatch(/\d/);
    });

    it('should have a secret with at least one special character', () => {
      expect(jwtContanst.secret).toMatch(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/);
    });

    it('should have an expiresIn that is exactly "24h"', () => {
      expect(jwtContanst.expiresIn).toBe('24h');
    });

    it('should have a secret that is exactly "ZUazAIQYqljDxpPX"', () => {
      expect(jwtContanst.secret).toBe('ZUazAIQYqljDxpPX');
    });

    it('should have a secret with length 16', () => {
      expect(jwtContanst.secret.length).toBe(16);
    });

    it('should have an expiresIn with length 3', () => {
      expect(jwtContanst.expiresIn.length).toBe(3);
    });

    it('should have a secret that is not a number', () => {
      expect(Number.isNaN(Number(jwtContanst.secret))).toBe(true);
    });

    it('should have an expiresIn that is not a number', () => {
      expect(Number.isNaN(Number(jwtContanst.expiresIn))).toBe(true);
    });

    it('should have a secret that is not a boolean', () => {
      expect(typeof jwtContanst.secret).not.toBe('boolean');
    });

    it('should have an expiresIn that is not a boolean', () => {
      expect(typeof jwtContanst.expiresIn).not.toBe('boolean');
    });

    it('should have a secret that is not an array', () => {
      expect(Array.isArray(jwtContanst.secret)).toBe(false);
    });

    it('should have an expiresIn that is not an array', () => {
      expect(Array.isArray(jwtContanst.expiresIn)).toBe(false);
    });

    it('should have a secret that is not an object', () => {
      expect(typeof jwtContanst.secret).not.toBe('object');
    });

    it('should have an expiresIn that is not an object', () => {
      expect(typeof jwtContanst.expiresIn).not.toBe('object');
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

    it('should have a secret that is not null or undefined', () => {
      expect(jwtContanst.secret).not.toBeNull();
      expect(jwtContanst.secret).not.toBeUndefined();
    });

    it('should have an expiresIn that is not null or undefined', () => {
      expect(jwtContanst.expiresIn).not.toBeNull();
      expect(jwtContanst.expiresIn).not.toBeUndefined();
    });

    it('should have a secret that is a valid string', () => {
      expect(typeof jwtContanst.secret).toBe('string');
      expect(jwtContanst.secret.length).toBeGreaterThan(0);
    });

    it('should have an expiresIn that is a valid string', () => {
      expect(typeof jwtContanst.expiresIn).toBe('string');
      expect(jwtContanst.expiresIn.length).toBeGreaterThan(0);
    });

    it('should have a secret that matches the expected pattern', () => {
      expect(jwtContanst.secret).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('should have an expiresIn that matches the expected pattern', () => {
      expect(jwtContanst.expiresIn).toMatch(/^\d+h$/);
    });

    it('should have a secret that is not whitespace', () => {
      expect(jwtContanst.secret.trim()).toBe(jwtContanst.secret);
    });

    it('should have an expiresIn that is not whitespace', () => {
      expect(jwtContanst.expiresIn.trim()).toBe(jwtContanst.expiresIn);
    });

    it('should have a secret that does not contain spaces', () => {
      expect(jwtContanst.secret).not.toContain(' ');
    });

    it('should have an expiresIn that does not contain spaces', () => {
      expect(jwtContanst.expiresIn).not.toContain(' ');
    });

    it('should have a secret that is not empty after trimming', () => {
      expect(jwtContanst.secret.trim().length).toBeGreaterThan(0);
    });

    it('should have an expiresIn that is not empty after trimming', () => {
      expect(jwtContanst.expiresIn.trim().length).toBeGreaterThan(0);
    });

    it('should have a secret that is a string with length 16', () => {
      expect(jwtContanst.secret).toHaveLength(16);
    });

    it('should have an expiresIn that is a string with length 3', () => {
      expect(jwtContanst.expiresIn).toHaveLength(3);
    });

    it('should have a secret that is a string with characters', () => {
      expect(jwtContanst.secret).toMatch(/[a-zA-Z0-9]/);
    });

    it('should have an expiresIn that is a string with characters', () => {
      expect(jwtContanst.expiresIn).toMatch(/[a-zA-Z0-9]/);
    });

    it('should have a secret that is a string with uppercase letters', () => {
      expect(jwtContanst.secret).toMatch(/[A-Z]/);
    });

    it('should have a secret that is a string with lowercase letters', () => {
      expect(jwtContanst.secret).toMatch(/[a-z]/);
    });

    it('should have a secret that is a string with numbers', () => {
      expect(jwtContanst.secret).toMatch(/[0-9]/);
    });

    it('should have an expiresIn that is a string with numbers', () => {
      expect(jwtContanst.expiresIn).toMatch(/[0-9]/);
    });

    it('should have a secret that is a string with alphanumeric characters', () => {
      expect(jwtContanst.secret).toMatch(/^[a-zA-Z0-9]+$/);
    });

    it('should have an expiresIn that is a string with alphanumeric characters', () => {
      expect(jwtContanst.expiresIn).toMatch(/^[a-zA-Z0-9]+$/);
    });

    it('should have a secret that is a string with no special characters', () => {
      expect(jwtContanst.secret).not.toMatch(/[^a-zA-Z0-9]/);
    });

    it('should have an expiresIn that is a string with no special characters', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[^a-zA-Z0-9]/);
    });

    it('should have a secret that is a string with no spaces', () => {
      expect(jwtContanst.secret).not.toMatch(/\s/);
    });

    it('should have an expiresIn that is a string with no spaces', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/\s/);
    });

    it('should have a secret that is a string with no tabs', () => {
      expect(jwtContanst.secret).not.toMatch(/\t/);
    });

    it('should have an expiresIn that is a string with no tabs', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/\t/);
    });

    it('should have a secret that is a string with no newlines', () => {
      expect(jwtContanst.secret).not.toMatch(/\n/);
    });

    it('should have an expiresIn that is a string with no newlines', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/\n/);
    });

    it('should have a secret that is a string with no carriage returns', () => {
      expect(jwtContanst.secret).not.toMatch(/\r/);
    });

    it('should have an expiresIn that is a string with no carriage returns', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/\r/);
    });

    it('should have a secret that is a string with no form feeds', () => {
      expect(jwtContanst.secret).not.toMatch(/\f/);
    });

    it('should have an expiresIn that is a string with no form feeds', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/\f/);
    });

    it('should have a secret that is a string with no vertical tabs', () => {
      expect(jwtContanst.secret).not.toMatch(/\v/);
    });

    it('should have an expiresIn that is a string with no vertical tabs', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/\v/);
    });

    it('should have a secret that is a string with no null characters', () => {
      expect(jwtContanst.secret).not.toMatch(/\0/);
    });

    it('should have an expiresIn that is a string with no null characters', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/\0/);
    });

    it('should have a secret that is a string with no unicode characters', () => {
      expect(jwtContanst.secret).not.toMatch(/[^\x00-\x7F]/);
    });

    it('should have an expiresIn that is a string with no unicode characters', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[^\x00-\x7F]/);
    });

    it('should have a secret that is a string with ASCII characters only', () => {
      expect(jwtContanst.secret).toMatch(/^[\x00-\x7F]+$/);
    });

    it('should have an expiresIn that is a string with ASCII characters only', () => {
      expect(jwtContanst.expiresIn).toMatch(/^[\x00-\x7F]+$/);
    });

    it('should have a secret that is a string with printable characters only', () => {
      expect(jwtContanst.secret).toMatch(/^[\x20-\x7E]+$/);
    });

    it('should have an expiresIn that is a string with printable characters only', () => {
      expect(jwtContanst.expiresIn).toMatch(/^[\x20-\x7E]+$/);
    });

    it('should have a secret that is a string with no control characters', () => {
      expect(jwtContanst.secret).not.toMatch(/[\x00-\x1F\x7F]/);
    });

    it('should have an expiresIn that is a string with no control characters', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\x00-\x1F\x7F]/);
    });

    it('should have a secret that is a string with no backspace', () => {
      expect(jwtContanst.secret).not.toMatch(/\x08/);
    });

    it('should have an expiresIn that is a string with no backspace', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/\x08/);
    });

    it('should have a secret that is a string with no escape characters', () => {
      expect(jwtContanst.secret).not.toMatch(/\x1B/);
    });

    it('should have an expiresIn that is a string with no escape characters', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/\x1B/);
    });

    it('should have a secret that is a string with no delete characters', () => {
      expect(jwtContanst.secret).not.toMatch(/\x7F/);
    });

    it('should have an expiresIn that is a string with no delete characters', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/\x7F/);
    });

    it('should have a secret that is a string with no line separators', () => {
      expect(jwtContanst.secret).not.toMatch(/\u2028/);
    });

    it('should have an expiresIn that is a string with no line separators', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/\u2028/);
    });

    it('should have a secret that is a string with no paragraph separators', () => {
      expect(jwtContanst.secret).not.toMatch(/\u2029/);
    });

    it('should have an expiresIn that is a string with no paragraph separators', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/\u2029/);
    });

    it('should have a secret that is a string with no BOM', () => {
      expect(jwtContanst.secret).not.toMatch(/\uFEFF/);
    });

    it('should have an expiresIn that is a string with no BOM', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/\uFEFF/);
    });

    it('should have a secret that is a string with no zero-width characters', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u200B-\u200D\uFEFF]/);
    });

    it('should have an expiresIn that is a string with no zero-width characters', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u200B-\u200D\uFEFF]/);
    });

    it('should have a secret that is a string with no combining characters', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u0300-\u036F]/);
    });

    it('should have an expiresIn that is a string with no combining characters', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u0300-\u036F]/);
    });

    it('should have a secret that is a string with no variation selectors', () => {
      expect(jwtContanst.secret).not.toMatch(/[\uFE00-\uFE0F]/);
    });

    it('should have an expiresIn that is a string with no variation selectors', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\uFE00-\uFE0F]/);
    });

    it('should have a secret that is a string with no emoji', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u);
    });

    it('should have an expiresIn that is a string with no emoji', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u);
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

    it('should have a secret that is a string with no geometric shapes', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u25A0-\u25FF]/);
    });

    it('should have an expiresIn that is a string with no geometric shapes', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u25A0-\u25FF]/);
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

    it('should have a secret that is a string with no braille patterns', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u2800-\u28FF]/);
    });

    it('should have an expiresIn that is a string with no braille patterns', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u2800-\u28FF]/);
    });

    it('should have a secret that is a string with no CJK symbols', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u3000-\u303F]/);
    });

    it('should have an expiresIn that is a string with no CJK symbols', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u3000-\u303F]/);
    });

    it('should have a secret that is a string with no Hiragana', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u3040-\u309F]/);
    });

    it('should have an expiresIn that is a string with no Hiragana', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u3040-\u309F]/);
    });

    it('should have a secret that is a string with no Katakana', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u30A0-\u30FF]/);
    });

    it('should have an expiresIn that is a string with no Katakana', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u30A0-\u30FF]/);
    });

    it('should have a secret that is a string with no Hangul', () => {
      expect(jwtContanst.secret).not.toMatch(/[\uAC00-\uD7AF]/);
    });

    it('should have an expiresIn that is a string with no Hangul', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\uAC00-\uD7AF]/);
    });

    it('should have a secret that is a string with no Latin extended', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u0080-\u024F]/);
    });

    it('should have an expiresIn that is a string with no Latin extended', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u0080-\u024F]/);
    });

    it('should have a secret that is a string with no Greek', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u0370-\u03FF]/);
    });

    it('should have an expiresIn that is a string with no Greek', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u0370-\u03FF]/);
    });

    it('should have a secret that is a string with no Cyrillic', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u0400-\u04FF]/);
    });

    it('should have an expiresIn that is a string with no Cyrillic', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u0400-\u04FF]/);
    });

    it('should have a secret that is a string with no Hebrew', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u0590-\u05FF]/);
    });

    it('should have an expiresIn that is a string with no Hebrew', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u0590-\u05FF]/);
    });

    it('should have a secret that is a string with no Arabic', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u0600-\u06FF]/);
    });

    it('should have an expiresIn that is a string with no Arabic', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u0600-\u06FF]/);
    });

    it('should have a secret that is a string with no Devanagari', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u0900-\u097F]/);
    });

    it('should have an expiresIn that is a string with no Devanagari', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u0900-\u097F]/);
    });

    it('should have a secret that is a string with no Thai', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u0E00-\u0E7F]/);
    });

    it('should have an expiresIn that is a string with no Thai', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u0E00-\u0E7F]/);
    });

    it('should have a secret that is a string with no Lao', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u0E80-\u0EFF]/);
    });

    it('should have an expiresIn that is a string with no Lao', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u0E80-\u0EFF]/);
    });

    it('should have a secret that is a string with no Tibetan', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u0F00-\u0FFF]/);
    });

    it('should have an expiresIn that is a string with no Tibetan', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u0F00-\u0FFF]/);
    });

    it('should have a secret that is a string with no Myanmar', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u1000-\u109F]/);
    });

    it('should have an expiresIn that is a string with no Myanmar', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u1000-\u109F]/);
    });

    it('should have a secret that is a string with no Georgian', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u10A0-\u10FF]/);
    });

    it('should have an expiresIn that is a string with no Georgian', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u10A0-\u10FF]/);
    });

    it('should have a secret that is a string with no Ethiopic', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u1200-\u137F]/);
    });

    it('should have an expiresIn that is a string with no Ethiopic', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u1200-\u137F]/);
    });

    it('should have a secret that is a string with no Cherokee', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u13A0-\u13FF]/);
    });

    it('should have an expiresIn that is a string with no Cherokee', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u13A0-\u13FF]/);
    });

    it('should have a secret that is a string with no Unified Canadian Aboriginal Syllabics', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u1400-\u167F]/);
    });

    it('should have an expiresIn that is a string with no Unified Canadian Aboriginal Syllabics', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u1400-\u167F]/);
    });

    it('should have a secret that is a string with no Ogham', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u1680-\u169F]/);
    });

    it('should have an expiresIn that is a string with no Ogham', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u1680-\u169F]/);
    });

    it('should have a secret that is a string with no Runic', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u16A0-\u16FF]/);
    });

    it('should have an expiresIn that is a string with no Runic', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u16A0-\u16FF]/);
    });

    it('should have a secret that is a string with no Tagalog', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u1700-\u171F]/);
    });

    it('should have an expiresIn that is a string with no Tagalog', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u1700-\u171F]/);
    });

    it('should have a secret that is a string with no Hanunoo', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u1720-\u173F]/);
    });

    it('should have an expiresIn that is a string with no Hanunoo', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u1720-\u173F]/);
    });

    it('should have a secret that is a string with no Buhid', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u1740-\u175F]/);
    });

    it('should have an expiresIn that is a string with no Buhid', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u1740-\u175F]/);
    });

    it('should have a secret that is a string with no Tagbanwa', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u1760-\u177F]/);
    });

    it('should have an expiresIn that is a string with no Tagbanwa', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u1760-\u177F]/);
    });

    it('should have a secret that is a string with no Khmer', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u1780-\u17FF]/);
    });

    it('should have an expiresIn that is a string with no Khmer', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u1780-\u17FF]/);
    });

    it('should have a secret that is a string with no Mongolian', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u1800-\u18AF]/);
    });

    it('should have an expiresIn that is a string with no Mongolian', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u1800-\u18AF]/);
    });

    it('should have a secret that is a string with no Limbu', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u1900-\u194F]/);
    });

    it('should have an expiresIn that is a string with no Limbu', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u1900-\u194F]/);
    });

    it('should have a secret that is a string with no Tai Le', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u1950-\u197F]/);
    });

    it('should have an expiresIn that is a string with no Tai Le', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u1950-\u197F]/);
    });

    it('should have a secret that is a string with no New Tai Lue', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u1980-\u19DF]/);
    });

    it('should have an expiresIn that is a string with no New Tai Lue', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u1980-\u19DF]/);
    });

    it('should have a secret that is a string with no Khmer Symbols', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u19E0-\u19FF]/);
    });

    it('should have an expiresIn that is a string with no Khmer Symbols', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u19E0-\u19FF]/);
    });

    it('should have a secret that is a string with no Buginese', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u1A00-\u1A1F]/);
    });

    it('should have an expiresIn that is a string with no Buginese', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u1A00-\u1A1F]/);
    });

    it('should have a secret that is a string with no Balinese', () => {
      expect(jwtContanst.secret).not.toMatch(/[\u1B00-\u1B7F]/);
    });

    it('should have an expiresIn that is a string with no Balinese', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/[\u1B00-\u1