import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = moduleRef.get<AppController>(AppController);
  });

  describe('getHello', () => {
    it('should return "Hello World"', () => {
      expect(appController.getHello()).toBe('Hello World');
    });

    it('should return a string', () => {
      const result = appController.getHello();
      expect(typeof result).toBe('string');
    });

    it('should return the exact string "Hello World"', () => {
      const result = appController.getHello();
      expect(result).toEqual('Hello World');
    });

    it('should not return an empty string', () => {
      const result = appController.getHello();
      expect(result).not.toBe('');
    });

    it('should not return null', () => {
      const result = appController.getHello();
      expect(result).not.toBeNull();
    });

    it('should not return undefined', () => {
      const result = appController.getHello();
      expect(result).not.toBeUndefined();
    });

    it('should be callable multiple times with consistent results', () => {
      const firstCall = appController.getHello();
      const secondCall = appController.getHello();
      const thirdCall = appController.getHello();
      
      expect(firstCall).toBe('Hello World');
      expect(secondCall).toBe('Hello World');
      expect(thirdCall).toBe('Hello World');
      expect(firstCall).toBe(secondCall);
      expect(secondCall).toBe(thirdCall);
    });

    it('should have the correct length', () => {
      const result = appController.getHello();
      expect(result.length).toBe(11);
    });

    it('should contain the word "Hello"', () => {
      const result = appController.getHello();
      expect(result).toContain('Hello');
    });

    it('should contain the word "World"', () => {
      const result = appController.getHello();
      expect(result).toContain('World');
    });

    it('should be case sensitive', () => {
      const result = appController.getHello();
      expect(result).toBe('Hello World');
      expect(result).not.toBe('hello world');
      expect(result).not.toBe('HELLO WORLD');
    });

    it('should not have leading or trailing whitespace', () => {
      const result = appController.getHello();
      expect(result).toBe(result.trim());
    });

    it('should be a primitive string, not a String object', () => {
      const result = appController.getHello();
      expect(typeof result).toBe('string');
      expect(result instanceof String).toBe(false);
    });

    it('should return the same value every time it is called', () => {
      const results = Array.from({ length: 10 }, () => appController.getHello());
      results.forEach(result => {
        expect(result).toBe('Hello World');
      });
    });

    it('should not throw any errors', () => {
      expect(() => appController.getHello()).not.toThrow();
    });

    it('should return a truthy value', () => {
      const result = appController.getHello();
      expect(result).toBeTruthy();
    });

    it('should match the expected pattern', () => {
      const result = appController.getHello();
      expect(result).toMatch(/^Hello World$/);
    });

    it('should have exactly one space between words', () => {
      const result = appController.getHello();
      expect(result.split(' ')).toHaveLength(2);
      expect(result.split(' ')[0]).toBe('Hello');
      expect(result.split(' ')[1]).toBe('World');
    });

    it('should be immutable', () => {
      const result = appController.getHello();
      const originalResult = result;
      expect(result).toBe(originalResult);
    });

    it('should be a valid string with no special characters', () => {
      const result = appController.getHello();
      expect(result).toMatch(/^[a-zA-Z\s]+$/);
    });

    it('should not be affected by external state', () => {
      const result1 = appController.getHello();
      // Simulate some external operations
      global.console.log('test');
      const result2 = appController.getHello();
      expect(result1).toBe(result2);
    });

    it('should return a string that can be concatenated', () => {
      const result = appController.getHello();
      const concatenated = result + '!';
      expect(concatenated).toBe('Hello World!');
    });

    it('should return a string that can be used in template literals', () => {
      const result = appController.getHello();
      const template = `${result} from NestJS`;
      expect(template).toBe('Hello World from NestJS');
    });

    it('should return a string that can be converted to uppercase', () => {
      const result = appController.getHello();
      expect(result.toUpperCase()).toBe('HELLO WORLD');
    });

    it('should return a string that can be converted to lowercase', () => {
      const result = appController.getHello();
      expect(result.toLowerCase()).toBe('hello world');
    });

    it('should return a string that can be split', () => {
      const result = appController.getHello();
      const words = result.split(' ');
      expect(words).toEqual(['Hello', 'World']);
    });

    it('should return a string that can be reversed', () => {
      const result = appController.getHello();
      const reversed = result.split('').reverse().join('');
      expect(reversed).toBe('dlroW olleH');
    });

    it('should return a string that can be checked for substring', () => {
      const result = appController.getHello();
      expect(result.includes('Hello')).toBe(true);
      expect(result.includes('World')).toBe(true);
      expect(result.includes('NestJS')).toBe(false);
    });

    it('should return a string that can be used in comparisons', () => {
      const result = appController.getHello();
      expect(result === 'Hello World').toBe(true);
      expect(result !== 'Goodbye World').toBe(true);
      expect(result > 'Hello').toBe(true);
      expect(result < 'Hello World!').toBe(true);
    });

    it('should return a string that can be used in array operations', () => {
      const result = appController.getHello();
      const array = [result];
      expect(array).toContain('Hello World');
      expect(array[0]).toBe('Hello World');
    });

    it('should return a string that can be used in object properties', () => {
      const result = appController.getHello();
      const obj = { message: result };
      expect(obj.message).toBe('Hello World');
    });
  });
});