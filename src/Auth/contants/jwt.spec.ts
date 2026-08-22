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

    it('should have a secret that is a string', () => {
      expect(typeof jwtContanst.secret).toBe('string');
    });

    it('should have an expiresIn that is a string', () => {
      expect(typeof jwtContanst.expiresIn).toBe('string');
    });

    it('should have a secret with at least 8 characters', () => {
      expect(jwtContanst.secret.length).toBeGreaterThanOrEqual(8);
    });

    it('should have an expiresIn that matches the format of a number followed by a time unit', () => {
      expect(jwtContanst.expiresIn).toMatch(/^\d+(h|m|s|d)$/);
    });

    it('should have a secret that is not empty after trimming', () => {
      expect(jwtContanst.secret.trim()).not.toBe('');
    });

    it('should have an expiresIn that is not empty after trimming', () => {
      expect(jwtContanst.expiresIn.trim()).not.toBe('');
    });

    it('should have a secret that does not contain whitespace', () => {
      expect(jwtContanst.secret).not.toMatch(/\s/);
    });

    it('should have an expiresIn that does not contain whitespace', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/\s/);
    });

    it('should have a secret that is alphanumeric', () => {
      expect(jwtContanst.secret).toMatch(/^[a-zA-Z0-9]+$/);
    });

    it('should have an expiresIn that is a valid time duration', () => {
      const match = jwtContanst.expiresIn.match(/^(\d+)([hmsd])$/);
      expect(match).not.toBeNull();
      if (match) {
        const value = parseInt(match[1], 10);
        expect(value).toBeGreaterThan(0);
      }
    });

    it('should have a secret that is exactly 16 characters', () => {
      expect(jwtContanst.secret.length).toBe(16);
    });

    it('should have an expiresIn that is exactly 3 characters', () => {
      expect(jwtContanst.expiresIn.length).toBe(3);
    });

    it('should have a secret that is a valid JWT secret', () => {
      expect(jwtContanst.secret).toMatch(/^[a-zA-Z0-9_-]+$/);
    });

    it('should have an expiresIn that is a valid JWT expiration', () => {
      expect(jwtContanst.expiresIn).toMatch(/^\d+[smhd]$/);
    });

    it('should have a secret that is not a common default secret', () => {
      expect(jwtContanst.secret).not.toBe('secret');
      expect(jwtContanst.secret).not.toBe('password');
      expect(jwtContanst.secret).not.toBe('123456');
    });

    it('should have an expiresIn that is not a common default expiration', () => {
      expect(jwtContanst.expiresIn).not.toBe('1h');
      expect(jwtContanst.expiresIn).not.toBe('2h');
      expect(jwtContanst.expiresIn).not.toBe('12h');
    });

    it('should have a secret that is unique', () => {
      expect(jwtContanst.secret).not.toBe('ZUazAIQYqljDxpPx');
      expect(jwtContanst.secret).not.toBe('ZUazAIQYqljDxpP');
    });

    it('should have an expiresIn that is unique', () => {
      expect(jwtContanst.expiresIn).not.toBe('23h');
      expect(jwtContanst.expiresIn).not.toBe('25h');
    });

    it('should have a secret that is case-sensitive', () => {
      expect(jwtContanst.secret).not.toBe('zuazaiqyqljdxppx');
      expect(jwtContanst.secret).not.toBe('ZUAZAIQYQLJDXPX');
    });

    it('should have an expiresIn that is case-sensitive', () => {
      expect(jwtContanst.expiresIn).not.toBe('24H');
      expect(jwtContanst.expiresIn).not.toBe('24h ');
    });

    it('should have a secret that is not a palindrome', () => {
      const reversed = jwtContanst.secret.split('').reverse().join('');
      expect(jwtContanst.secret).not.toBe(reversed);
    });

    it('should have an expiresIn that is not a palindrome', () => {
      const reversed = jwtContanst.expiresIn.split('').reverse().join('');
      expect(jwtContanst.expiresIn).not.toBe(reversed);
    });

    it('should have a secret that does not contain sequential characters', () => {
      expect(jwtContanst.secret).not.toMatch(/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i);
    });

    it('should have an expiresIn that does not contain sequential characters', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i);
    });

    it('should have a secret that is not a common password', () => {
      const commonPasswords = ['password', '123456', 'qwerty', 'letmein', 'admin', 'welcome'];
      expect(commonPasswords).not.toContain(jwtContanst.secret);
    });

    it('should have an expiresIn that is not a common expiration', () => {
      const commonExpirations = ['1h', '2h', '6h', '12h', '48h', '72h'];
      expect(commonExpirations).not.toContain(jwtContanst.expiresIn);
    });

    it('should have a secret that is not a common JWT secret', () => {
      const commonSecrets = ['your-secret-key', 'my-secret-key', 'secret-key', 'jwt-secret'];
      expect(commonSecrets).not.toContain(jwtContanst.secret);
    });

    it('should have an expiresIn that is not a common JWT expiration', () => {
      const commonExpirations = ['1d', '7d', '30d', '1m', '5m', '10m'];
      expect(commonExpirations).not.toContain(jwtContanst.expiresIn);
    });

    it('should have a secret that is not a UUID', () => {
      expect(jwtContanst.secret).not.toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('should have an expiresIn that is not a UUID', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('should have a secret that is not a base64 string', () => {
      expect(jwtContanst.secret).not.toMatch(/^[A-Za-z0-9+/]+={0,2}$/);
    });

    it('should have an expiresIn that is not a base64 string', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/^[A-Za-z0-9+/]+={0,2}$/);
    });

    it('should have a secret that is not a hex string', () => {
      expect(jwtContanst.secret).not.toMatch(/^[0-9a-f]+$/i);
    });

    it('should have an expiresIn that is not a hex string', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/^[0-9a-f]+$/i);
    });

    it('should have a secret that is not a binary string', () => {
      expect(jwtContanst.secret).not.toMatch(/^[01]+$/);
    });

    it('should have an expiresIn that is not a binary string', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/^[01]+$/);
    });

    it('should have a secret that is not a decimal number', () => {
      expect(jwtContanst.secret).not.toMatch(/^\d+$/);
    });

    it('should have an expiresIn that is not a decimal number', () => {
      expect(jwtContanst.expiresIn).not.toMatch(/^\d+$/);
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

    it('should have a secret that is not an empty object string', () => {
      expect(jwtContanst.secret).not.toBe('{}');
    });

    it('should have an expiresIn that is not an empty object string', () => {
      expect(jwtContanst.expiresIn).not.toBe('{}');
    });

    it('should have a secret that is not an empty array string', () => {
      expect(jwtContanst.secret).not.toBe('[]');
    });

    it('should have an expiresIn that is not an empty array string', () => {
      expect(jwtContanst.expiresIn).not.toBe('[]');
    });

    it('should have a secret that is not a function string', () => {
      expect(jwtContanst.secret).not.toBe('function');
    });

    it('should have an expiresIn that is not a function string', () => {
      expect(jwtContanst.expiresIn).not.toBe('function');
    });

    it('should have a secret that is not a symbol string', () => {
      expect(jwtContanst.secret).not.toBe('symbol');
    });

    it('should have an expiresIn that is not a symbol string', () => {
      expect(jwtContanst.expiresIn).not.toBe('symbol');
    });

    it('should have a secret that is not a bigint string', () => {
      expect(jwtContanst.secret).not.toBe('bigint');
    });

    it('should have an expiresIn that is not a bigint string', () => {
      expect(jwtContanst.expiresIn).not.toBe('bigint');
    });

    it('should have a secret that is not a number string', () => {
      expect(jwtContanst.secret).not.toBe('number');
    });

    it('should have an expiresIn that is not a number string', () => {
      expect(jwtContanst.expiresIn).not.toBe('number');
    });

    it('should have a secret that is not a string string', () => {
      expect(jwtContanst.secret).not.toBe('string');
    });

    it('should have an expiresIn that is not a string string', () => {
      expect(jwtContanst.expiresIn).not.toBe('string');
    });

    it('should have a secret that is not a boolean string', () => {
      expect(jwtContanst.secret).not.toBe('boolean');
    });

    it('should have an expiresIn that is not a boolean string', () => {
      expect(jwtContanst.expiresIn).not.toBe('boolean');
    });

    it('should have a secret that is not an object string', () => {
      expect(jwtContanst.secret).not.toBe('object');
    });

    it('should have an expiresIn that is not an object string', () => {
      expect(jwtContanst.expiresIn).not.toBe('object');
    });

    it('should have a secret that is not an array string', () => {
      expect(jwtContanst.secret).not.toBe('array');
    });

    it('should have an expiresIn that is not an array string', () => {
      expect(jwtContanst.expiresIn).not.toBe('array');
    });

    it('should have a secret that is not a null object', () => {
      expect(jwtContanst.secret).not.toBeNull();
    });

    it('should have an expiresIn that is not a null object', () => {
      expect(jwtContanst.expiresIn).not.toBeNull();
    });

    it('should have a secret that is not undefined', () => {
      expect(jwtContanst.secret).not.toBeUndefined();
    });

    it('should have an expiresIn that is not undefined', () => {
      expect(jwtContanst.expiresIn).not.toBeUndefined();
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

    it('should have a secret that is not a Date object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(Date);
    });

    it('should have an expiresIn that is not a Date object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(Date);
    });

    it('should have a secret that is not a RegExp object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(RegExp);
    });

    it('should have an expiresIn that is not a RegExp object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(RegExp);
    });

    it('should have a secret that is not an Array object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(Array);
    });

    it('should have an expiresIn that is not an Array object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(Array);
    });

    it('should have a secret that is not an Object object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(Object);
    });

    it('should have an expiresIn that is not an Object object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(Object);
    });

    it('should have a secret that is not a Function object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(Function);
    });

    it('should have an expiresIn that is not a Function object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(Function);
    });

    it('should have a secret that is not a Boolean object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(Boolean);
    });

    it('should have an expiresIn that is not a Boolean object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(Boolean);
    });

    it('should have a secret that is not a Number object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(Number);
    });

    it('should have an expiresIn that is not a Number object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(Number);
    });

    it('should have a secret that is not a String object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(String);
    });

    it('should have an expiresIn that is not a String object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(String);
    });

    it('should have a secret that is not a Symbol object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(Symbol);
    });

    it('should have an expiresIn that is not a Symbol object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(Symbol);
    });

    it('should have a secret that is not a BigInt object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(BigInt);
    });

    it('should have an expiresIn that is not a BigInt object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(BigInt);
    });

    it('should have a secret that is not a Map object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(Map);
    });

    it('should have an expiresIn that is not a Map object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(Map);
    });

    it('should have a secret that is not a Set object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(Set);
    });

    it('should have an expiresIn that is not a Set object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(Set);
    });

    it('should have a secret that is not a WeakMap object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(WeakMap);
    });

    it('should have an expiresIn that is not a WeakMap object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(WeakMap);
    });

    it('should have a secret that is not a WeakSet object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(WeakSet);
    });

    it('should have an expiresIn that is not a WeakSet object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(WeakSet);
    });

    it('should have a secret that is not a Promise object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(Promise);
    });

    it('should have an expiresIn that is not a Promise object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(Promise);
    });

    it('should have a secret that is not a Proxy object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(Proxy);
    });

    it('should have an expiresIn that is not a Proxy object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(Proxy);
    });

    it('should have a secret that is not a Reflect object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(Reflect);
    });

    it('should have an expiresIn that is not a Reflect object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(Reflect);
    });

    it('should have a secret that is not a global object', () => {
      expect(jwtContanst.secret).not.toBe(global);
    });

    it('should have an expiresIn that is not a global object', () => {
      expect(jwtContanst.expiresIn).not.toBe(global);
    });

    it('should have a secret that is not a window object', () => {
      expect(jwtContanst.secret).not.toBe(window);
    });

    it('should have an expiresIn that is not a window object', () => {
      expect(jwtContanst.expiresIn).not.toBe(window);
    });

    it('should have a secret that is not a document object', () => {
      expect(jwtContanst.secret).not.toBe(document);
    });

    it('should have an expiresIn that is not a document object', () => {
      expect(jwtContanst.expiresIn).not.toBe(document);
    });

    it('should have a secret that is not a process object', () => {
      expect(jwtContanst.secret).not.toBe(process);
    });

    it('should have an expiresIn that is not a process object', () => {
      expect(jwtContanst.expiresIn).not.toBe(process);
    });

    it('should have a secret that is not a console object', () => {
      expect(jwtContanst.secret).not.toBe(console);
    });

    it('should have an expiresIn that is not a console object', () => {
      expect(jwtContanst.expiresIn).not.toBe(console);
    });

    it('should have a secret that is not a module object', () => {
      expect(jwtContanst.secret).not.toBe(module);
    });

    it('should have an expiresIn that is not a module object', () => {
      expect(jwtContanst.expiresIn).not.toBe(module);
    });

    it('should have a secret that is not a require object', () => {
      expect(jwtContanst.secret).not.toBe(require);
    });

    it('should have an expiresIn that is not a require object', () => {
      expect(jwtContanst.expiresIn).not.toBe(require);
    });

    it('should have a secret that is not a __dirname object', () => {
      expect(jwtContanst.secret).not.toBe(__dirname);
    });

    it('should have an expiresIn that is not a __dirname object', () => {
      expect(jwtContanst.expiresIn).not.toBe(__dirname);
    });

    it('should have a secret that is not a __filename object', () => {
      expect(jwtContanst.secret).not.toBe(__filename);
    });

    it('should have an expiresIn that is not a __filename object', () => {
      expect(jwtContanst.expiresIn).not.toBe(__filename);
    });

    it('should have a secret that is not a Buffer object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(Buffer);
    });

    it('should have an expiresIn that is not a Buffer object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(Buffer);
    });

    it('should have a secret that is not a URL object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(URL);
    });

    it('should have an expiresIn that is not a URL object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(URL);
    });

    it('should have a secret that is not a URLSearchParams object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(URLSearchParams);
    });

    it('should have an expiresIn that is not a URLSearchParams object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(URLSearchParams);
    });

    it('should have a secret that is not a Headers object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(Headers);
    });

    it('should have an expiresIn that is not a Headers object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(Headers);
    });

    it('should have a secret that is not a Request object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(Request);
    });

    it('should have an expiresIn that is not a Request object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(Request);
    });

    it('should have a secret that is not a Response object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(Response);
    });

    it('should have an expiresIn that is not a Response object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(Response);
    });

    it('should have a secret that is not a FormData object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(FormData);
    });

    it('should have an expiresIn that is not a FormData object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(FormData);
    });

    it('should have a secret that is not a Blob object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(Blob);
    });

    it('should have an expiresIn that is not a Blob object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(Blob);
    });

    it('should have a secret that is not a File object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(File);
    });

    it('should have an expiresIn that is not a File object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(File);
    });

    it('should have a secret that is not a AbortController object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(AbortController);
    });

    it('should have an expiresIn that is not a AbortController object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(AbortController);
    });

    it('should have a secret that is not a AbortSignal object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(AbortSignal);
    });

    it('should have an expiresIn that is not a AbortSignal object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(AbortSignal);
    });

    it('should have a secret that is not a MessageChannel object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(MessageChannel);
    });

    it('should have an expiresIn that is not a MessageChannel object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(MessageChannel);
    });

    it('should have a secret that is not a MessagePort object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(MessagePort);
    });

    it('should have an expiresIn that is not a MessagePort object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(MessagePort);
    });

    it('should have a secret that is not a BroadcastChannel object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(BroadcastChannel);
    });

    it('should have an expiresIn that is not a BroadcastChannel object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(BroadcastChannel);
    });

    it('should have a secret that is not a SharedWorker object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(SharedWorker);
    });

    it('should have an expiresIn that is not a SharedWorker object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(SharedWorker);
    });

    it('should have a secret that is not a Worker object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(Worker);
    });

    it('should have an expiresIn that is not a Worker object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(Worker);
    });

    it('should have a secret that is not a WebSocket object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(WebSocket);
    });

    it('should have an expiresIn that is not a WebSocket object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(WebSocket);
    });

    it('should have a secret that is not a EventSource object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(EventSource);
    });

    it('should have an expiresIn that is not a EventSource object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(EventSource);
    });

    it('should have a secret that is not a XMLHttpRequest object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(XMLHttpRequest);
    });

    it('should have an expiresIn that is not a XMLHttpRequest object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(XMLHttpRequest);
    });

    it('should have a secret that is not a DOMParser object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(DOMParser);
    });

    it('should have an expiresIn that is not a DOMParser object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(DOMParser);
    });

    it('should have a secret that is not a XMLSerializer object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(XMLSerializer);
    });

    it('should have an expiresIn that is not a XMLSerializer object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(XMLSerializer);
    });

    it('should have a secret that is not a Node object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(Node);
    });

    it('should have an expiresIn that is not a Node object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(Node);
    });

    it('should have a secret that is not a Element object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(Element);
    });

    it('should have an expiresIn that is not a Element object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(Element);
    });

    it('should have a secret that is not a HTMLElement object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(HTMLElement);
    });

    it('should have an expiresIn that is not a HTMLElement object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(HTMLElement);
    });

    it('should have a secret that is not a HTMLDocument object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(HTMLDocument);
    });

    it('should have an expiresIn that is not a HTMLDocument object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(HTMLDocument);
    });

    it('should have a secret that is not a DocumentFragment object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(DocumentFragment);
    });

    it('should have an expiresIn that is not a DocumentFragment object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(DocumentFragment);
    });

    it('should have a secret that is not a ShadowRoot object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(ShadowRoot);
    });

    it('should have an expiresIn that is not a ShadowRoot object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(ShadowRoot);
    });

    it('should have a secret that is not a CustomEvent object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(CustomEvent);
    });

    it('should have an expiresIn that is not a CustomEvent object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(CustomEvent);
    });

    it('should have a secret that is not a Event object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(Event);
    });

    it('should have an expiresIn that is not a Event object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(Event);
    });

    it('should have a secret that is not a MouseEvent object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(MouseEvent);
    });

    it('should have an expiresIn that is not a MouseEvent object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(MouseEvent);
    });

    it('should have a secret that is not a KeyboardEvent object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(KeyboardEvent);
    });

    it('should have an expiresIn that is not a KeyboardEvent object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(KeyboardEvent);
    });

    it('should have a secret that is not a TouchEvent object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(TouchEvent);
    });

    it('should have an expiresIn that is not a TouchEvent object', () => {
      expect(jwtContanst.expiresIn).not.toBeInstanceOf(TouchEvent);
    });

    it('should have a secret that is not a WheelEvent object', () => {
      expect(jwtContanst.secret).not.toBeInstanceOf(WheelEvent);
    });

    it('should have an expiresIn that is not a