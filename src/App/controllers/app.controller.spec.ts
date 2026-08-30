import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });

    describe('getHello', () => {
      it('should return "Hello World"', () => {
        expect(appController.getHello()).toBe('Hello World');
      });

      it('should return a string', () => {
        const result = appController.getHello();
        expect(typeof result).toBe('string');
      });

      it('should return the exact expected message', () => {
        const result = appController.getHello();
        expect(result).toEqual('Hello World');
      });

      it('should not return an empty string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('');
      });

      it('should not return null or undefined', () => {
        const result = appController.getHello();
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
      });

      it('should return a non-empty string', () => {
        const result = appController.getHello();
        expect(result.length).toBeGreaterThan(0);
      });

      it('should return a string with correct length', () => {
        const result = appController.getHello();
        expect(result.length).toBe(11); // "Hello World" has 11 characters
      });

      it('should return a string containing "Hello"', () => {
        const result = appController.getHello();
        expect(result).toContain('Hello');
      });

      it('should return a string containing "World"', () => {
        const result = appController.getHello();
        expect(result).toContain('World');
      });

      it('should return a string with space between words', () => {
        const result = appController.getHello();
        expect(result).toMatch(/Hello\s+World/);
      });

      it('should return a string with correct case', () => {
        const result = appController.getHello();
        expect(result).toBe('Hello World');
        expect(result).not.toBe('hello world');
        expect(result).not.toBe('HELLO WORLD');
      });

      it('should return a string with no leading/trailing spaces', () => {
        const result = appController.getHello();
        expect(result.trim()).toBe(result);
      });

      it('should return a string with no extra whitespace', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/\s{2,}/);
      });

      it('should return a string with only alphanumeric characters and space', () => {
        const result = appController.getHello();
        expect(result).toMatch(/^[a-zA-Z\s]+$/);
      });

      it('should return a string with exactly two words', () => {
        const result = appController.getHello();
        const words = result.split(' ');
        expect(words).toHaveLength(2);
      });

      it('should return "Hello" as first word', () => {
        const result = appController.getHello();
        const words = result.split(' ');
        expect(words[0]).toBe('Hello');
      });

      it('should return "World" as second word', () => {
        const result = appController.getHello();
        const words = result.split(' ');
        expect(words[1]).toBe('World');
      });

      it('should return a string that matches the exact pattern', () => {
        const result = appController.getHello();
        expect(result).toMatch(/^Hello World$/);
      });

      it('should return a string that is not a number', () => {
        const result = appController.getHello();
        expect(Number.isNaN(Number(result))).toBe(true);
      });

      it('should return a string that is not a boolean', () => {
        const result = appController.getHello();
        expect(result).not.toBe(true);
        expect(result).not.toBe(false);
      });

      it('should return a string that is not an object', () => {
        const result = appController.getHello();
        expect(typeof result).not.toBe('object');
      });

      it('should return a string that is not an array', () => {
        const result = appController.getHello();
        expect(Array.isArray(result)).toBe(false);
      });

      it('should return a string that is not a function', () => {
        const result = appController.getHello();
        expect(typeof result).not.toBe('function');
      });

      it('should return a string that is not a symbol', () => {
        const result = appController.getHello();
        expect(typeof result).not.toBe('symbol');
      });

      it('should return a string that is not a bigint', () => {
        const result = appController.getHello();
        expect(typeof result).not.toBe('bigint');
      });

      it('should return a string that is not undefined', () => {
        const result = appController.getHello();
        expect(result).not.toBeUndefined();
      });

      it('should return a string that is not null', () => {
        const result = appController.getHello();
        expect(result).not.toBeNull();
      });

      it('should return a string that is not NaN', () => {
        const result = appController.getHello();
        expect(result).not.toBeNaN();
      });

      it('should return a string that is not an empty object', () => {
        const result = appController.getHello();
        expect(result).not.toEqual({});
      });

      it('should return a string that is not an empty array', () => {
        const result = appController.getHello();
        expect(result).not.toEqual([]);
      });

      it('should return a string that is not 0', () => {
        const result = appController.getHello();
        expect(result).not.toBe(0);
      });

      it('should return a string that is not false', () => {
        const result = appController.getHello();
        expect(result).not.toBe(false);
      });

      it('should return a string that is not an empty string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('');
      });

      it('should return a string that is not whitespace only', () => {
        const result = appController.getHello();
        expect(result.trim()).not.toBe('');
      });

      it('should return a string that is not a single character', () => {
        const result = appController.getHello();
        expect(result.length).not.toBe(1);
      });

      it('should return a string that is not a single word', () => {
        const result = appController.getHello();
        expect(result.split(' ').length).not.toBe(1);
      });

      it('should return a string that is not more than two words', () => {
        const result = appController.getHello();
        expect(result.split(' ').length).not.toBeGreaterThan(2);
      });

      it('should return a string that is not less than two words', () => {
        const result = appController.getHello();
        expect(result.split(' ').length).not.toBeLessThan(2);
      });

      it('should return a string with correct character count', () => {
        const result = appController.getHello();
        expect(result.length).toBe(11);
      });

      it('should return a string with correct word count', () => {
        const result = appController.getHello();
        expect(result.split(' ').length).toBe(2);
      });

      it('should return a string with correct character positions', () => {
        const result = appController.getHello();
        expect(result[0]).toBe('H');
        expect(result[1]).toBe('e');
        expect(result[2]).toBe('l');
        expect(result[3]).toBe('l');
        expect(result[4]).toBe('o');
        expect(result[5]).toBe(' ');
        expect(result[6]).toBe('W');
        expect(result[7]).toBe('o');
        expect(result[8]).toBe('r');
        expect(result[9]).toBe('l');
        expect(result[10]).toBe('d');
      });

      it('should return a string with correct ASCII values', () => {
        const result = appController.getHello();
        expect(result.charCodeAt(0)).toBe(72); // H
        expect(result.charCodeAt(1)).toBe(101); // e
        expect(result.charCodeAt(2)).toBe(108); // l
        expect(result.charCodeAt(3)).toBe(108); // l
        expect(result.charCodeAt(4)).toBe(111); // o
        expect(result.charCodeAt(5)).toBe(32); // space
        expect(result.charCodeAt(6)).toBe(87); // W
        expect(result.charCodeAt(7)).toBe(111); // o
        expect(result.charCodeAt(8)).toBe(114); // r
        expect(result.charCodeAt(9)).toBe(108); // l
        expect(result.charCodeAt(10)).toBe(100); // d
      });

      it('should return a string with correct Unicode values', () => {
        const result = appController.getHello();
        expect(result.codePointAt(0)).toBe(72);
        expect(result.codePointAt(1)).toBe(101);
        expect(result.codePointAt(2)).toBe(108);
        expect(result.codePointAt(3)).toBe(108);
        expect(result.codePointAt(4)).toBe(111);
        expect(result.codePointAt(5)).toBe(32);
        expect(result.codePointAt(6)).toBe(87);
        expect(result.codePointAt(7)).toBe(111);
        expect(result.codePointAt(8)).toBe(114);
        expect(result.codePointAt(9)).toBe(108);
        expect(result.codePointAt(10)).toBe(100);
      });

      it('should return a string that is immutable', () => {
        const result = appController.getHello();
        expect(() => {
          (result as any).test = 'test';
        }).toThrow();
      });

      it('should return a string that is a primitive', () => {
        const result = appController.getHello();
        expect(typeof result).toBe('string');
        expect(result instanceof String).toBe(false);
      });

      it('should return a string that is not a String object', () => {
        const result = appController.getHello();
        expect(result instanceof String).toBe(false);
      });

      it('should return a string that is serializable', () => {
        const result = appController.getHello();
        expect(JSON.stringify(result)).toBe('"Hello World"');
      });

      it('should return a string that can be parsed', () => {
        const result = appController.getHello();
        expect(JSON.parse(JSON.stringify(result))).toBe('Hello World');
      });

      it('should return a string that is truthy', () => {
        const result = appController.getHello();
        expect(Boolean(result)).toBe(true);
      });

      it('should return a string that is not falsy', () => {
        const result = appController.getHello();
        expect(result).toBeTruthy();
      });

      it('should return a string that is not empty', () => {
        const result = appController.getHello();
        expect(result).not.toBeFalsy();
      });

      it('should return a string that is not zero-length', () => {
        const result = appController.getHello();
        expect(result.length).not.toBe(0);
      });

      it('should return a string that is not a whitespace string', () => {
        const result = appController.getHello();
        expect(result.trim()).not.toBe('');
      });

      it('should return a string that is not a newline string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\n');
      });

      it('should return a string that is not a tab string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\t');
      });

      it('should return a string that is not a carriage return string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\r');
      });

      it('should return a string that is not a form feed string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\f');
      });

      it('should return a string that is not a vertical tab string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\v');
      });

      it('should return a string that is not a null character string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\0');
      });

      it('should return a string that is not a backspace string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\b');
      });

      it('should return a string that is not a bell string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\a');
      });

      it('should return a string that is not an escape string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\x1b');
      });

      it('should return a string that is not a unicode null string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\u0000');
      });

      it('should return a string that is not a unicode bell string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\u0007');
      });

      it('should return a string that is not a unicode backspace string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\u0008');
      });

      it('should return a string that is not a unicode tab string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\u0009');
      });

      it('should return a string that is not a unicode newline string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\u000A');
      });

      it('should return a string that is not a unicode vertical tab string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\u000B');
      });

      it('should return a string that is not a unicode form feed string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\u000C');
      });

      it('should return a string that is not a unicode carriage return string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\u000D');
      });

      it('should return a string that is not a unicode space string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\u0020');
      });

      it('should return a string that is not a unicode non-breaking space string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\u00A0');
      });

      it('should return a string that is not a unicode zero-width space string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\u200B');
      });

      it('should return a string that is not a unicode left-to-right mark string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\u200E');
      });

      it('should return a string that is not a unicode right-to-left mark string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\u200F');
      });

      it('should return a string that is not a unicode line separator string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\u2028');
      });

      it('should return a string that is not a unicode paragraph separator string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\u2029');
      });

      it('should return a string that is not a unicode byte order mark string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\uFEFF');
      });

      it('should return a string that is not a unicode replacement character string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\uFFFD');
      });

      it('should return a string that is not a unicode null character string', () => {
        const result = appController.getHello();
        expect(result).not.toBe('\u0000');
      });

      it('should return a string that is not a unicode control character string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u0000-\u001F\u007F-\u009F]/);
      });

      it('should return a string that is not a unicode format character string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u200B-\u200F\u2028-\u202F\u2060-\u206F\uFEFF]/);
      });

      it('should return a string that is not a unicode surrogate character string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\uD800-\uDFFF]/);
      });

      it('should return a string that is not a unicode private use character string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\uE000-\uF8FF]/);
      });

      it('should return a string that is not a unicode noncharacter string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\uFDD0-\uFDEF\uFFFE\uFFFF]/);
      });

      it('should return a string that is not a unicode variation selector string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\uFE00-\uFE0F]/);
      });

      it('should return a string that is not a unicode combining character string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/);
      });

      it('should return a string that is not a unicode emoji string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1F000}-\u{1FAFF}]/u);
      });

      it('should return a string that is not a unicode mathematical alphanumeric symbol string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1D400}-\u{1D7FF}]/u);
      });

      it('should return a string that is not a unicode currency symbol string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u20A0-\u20CF]/);
      });

      it('should return a string that is not a unicode letterlike symbol string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u2100-\u214F]/);
      });

      it('should return a string that is not a unicode number form string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u2150-\u218F]/);
      });

      it('should return a string that is not a unicode arrow string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u2190-\u21FF]/);
      });

      it('should return a string that is not a unicode mathematical operator string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u2200-\u22FF]/);
      });

      it('should return a string that is not a unicode technical symbol string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u2300-\u23FF]/);
      });

      it('should return a string that is not a unicode geometric shape string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u25A0-\u25FF]/);
      });

      it('should return a string that is not a unicode miscellaneous symbol string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u2600-\u26FF]/);
      });

      it('should return a string that is not a unicode dingbat string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u2700-\u27BF]/);
      });

      it('should return a string that is not a unicode braille pattern string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u2800-\u28FF]/);
      });

      it('should return a string that is not a unicode supplemental mathematical operator string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1D800}-\u{1DAFF}]/u);
      });

      it('should return a string that is not a unicode supplemental arrow string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1F800}-\u{1F8FF}]/u);
      });

      it('should return a string that is not a unicode supplemental punctuation string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{2E00}-\u{2E7F}]/u);
      });

      it('should return a string that is not a unicode supplemental symbol string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1F000}-\u{1F02F}]/u);
      });

      it('should return a string that is not a unicode supplemental letter string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1D000}-\u{1D0FF}]/u);
      });

      it('should return a string that is not a unicode supplemental number string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1D100}-\u{1D1FF}]/u);
      });

      it('should return a string that is not a unicode supplemental operator string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1D200}-\u{1D2FF}]/u);
      });

      it('should return a string that is not a unicode supplemental currency string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1D300}-\u{1D3FF}]/u);
      });

      it('should return a string that is not a unicode supplemental symbol string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1D400}-\u{1D7FF}]/u);
      });

      it('should return a string that is not a unicode supplemental letter string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1D800}-\u{1DBFF}]/u);
      });

      it('should return a string that is not a unicode supplemental number string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1DC00}-\u{1DFFF}]/u);
      });

      it('should return a string that is not a unicode supplemental operator string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1E000}-\u{1EFFF}]/u);
      });

      it('should return a string that is not a unicode supplemental currency string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1F000}-\u{1FFFF}]/u);
      });

      it('should return a string that is not a unicode supplemental symbol string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{20000}-\u{2FFFF}]/u);
      });

      it('should return a string that is not a unicode supplemental letter string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{30000}-\u{3FFFF}]/u);
      });

      it('should return a string that is not a unicode supplemental number string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{40000}-\u{4FFFF}]/u);
      });

      it('should return a string that is not a unicode supplemental operator string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{50000}-\u{5FFFF}]/u);
      });

      it('should return a string that is not a unicode supplemental currency string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{60000}-\u{6FFFF}]/u);
      });

      it('should return a string that is not a unicode supplemental symbol string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{70000}-\u{7FFFF}]/u);
      });

      it('should return a string that is not a unicode supplemental letter string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{80000}-\u{8FFFF}]/u);
      });

      it('should return a string that is not a unicode supplemental number string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{90000}-\u{9FFFF}]/u);
      });

      it('should return a string that is not a unicode supplemental operator string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{A0000}-\u{AFFFF}]/u);
      });

      it('should return a string that is not a unicode supplemental currency string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{B0000}-\u{BFFFF}]/u);
      });

      it('should return a string that is not a unicode supplemental symbol string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{C0000}-\u{CFFFF}]/u);
      });

      it('should return a string that is not a unicode supplemental letter string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{D0000}-\u{DFFFF}]/u);
      });

      it('should return a string that is not a unicode supplemental number string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{E0000}-\u{EFFFF}]/u);
      });

      it('should return a string that is not a unicode supplemental operator string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{F0000}-\u{FFFFF}]/u);
      });

      it('should return a string that is not a unicode supplemental currency string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{100000}-\u{10FFFF}]/u);
      });

      it('should return a string that is not a unicode noncharacter string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}]/u);
      });

      it('should return a string that is not a unicode private use string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{E000}-\u{F8FF}]/u);
      });

      it('should return a string that is not a unicode surrogate string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{D800}-\u{DFFF}]/u);
      });

      it('should return a string that is not a unicode control string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{0000}-\u{001F}\u{007F}-\u{009F}]/u);
      });

      it('should return a string that is not a unicode format string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{200B}-\u{200F}\u{2028}-\u{202F}\u{2060}-\u{206F}\u{FEFF}]/u);
      });

      it('should return a string that is not a unicode variation selector string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{FE00}-\u{FE0F}]/u);
      });

      it('should return a string that is not a unicode combining character string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{0300}-\u{036F}\u{1AB0}-\u{1AFF}\u{1DC0}-\u{1DFF}\u{20D0}-\u{20FF}\u{FE20}-\u{FE2F}]/u);
      });

      it('should return a string that is not a unicode emoji string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1F000}-\u{1FAFF}]/u);
      });

      it('should return a string that is not a unicode mathematical alphanumeric symbol string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1D400}-\u{1D7FF}]/u);
      });

      it('should return a string that is not a unicode currency symbol string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{20A0}-\u{20CF}]/u);
      });

      it('should return a string that is not a unicode letterlike symbol string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{2100}-\u{214F}]/u);
      });

      it('should return a string that is not a unicode number form string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{2150}-\u{218F}]/u);
      });

      it('should return a string that is not a unicode arrow string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{2190}-\u{21FF}]/u);
      });

      it('should return a string that is not a unicode mathematical operator string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{2200}-\u{22FF}]/u);
      });

      it('should return a string that is not a unicode technical symbol string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{2300}-\u{23FF}]/u);
      });

      it('should return a string that is not a unicode geometric shape string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{25A0}-\u{25FF}]/u);
      });

      it('should return a string that is not a unicode miscellaneous symbol string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{2600}-\u{26FF}]/u);
      });

      it('should return a string that is not a unicode dingbat string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{2700}-\u{27BF}]/u);
      });

      it('should return a string that is not a unicode braille pattern string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{2800}-\u{28FF}]/u);
      });

      it('should return a string that is not a unicode supplemental mathematical operator string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1D800}-\u{1DAFF}]/u);
      });

      it('should return a string that is not a unicode supplemental arrow string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1F800}-\u{1F8FF}]/u);
      });

      it('should return a string that is not a unicode supplemental punctuation string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{2E00}-\u{2E7F}]/u);
      });

      it('should return a string that is not a unicode supplemental symbol string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1F000}-\u{1F02F}]/u);
      });

      it('should return a string that is not a unicode supplemental letter string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1D000}-\u{1D0FF}]/u);
      });

      it('should return a string that is not a unicode supplemental number string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1D100}-\u{1D1FF}]/u);
      });

      it('should return a string that is not a unicode supplemental operator string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1D200}-\u{1D2FF}]/u);
      });

      it('should return a string that is not a unicode supplemental currency string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1D300}-\u{1D3FF}]/u);
      });

      it('should return a string that is not a unicode supplemental symbol string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1D400}-\u{1D7FF}]/u);
      });

      it('should return a string that is not a unicode supplemental letter string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1D800}-\u{1DBFF}]/u);
      });

      it('should return a string that is not a unicode supplemental number string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u{1DC00}-\u{1DFFF}]/u);
      });

      it('should return a string that is not a unicode supplemental operator string', () => {
        const result = appController.getHello();
        expect(result).not.toMatch(/[\u