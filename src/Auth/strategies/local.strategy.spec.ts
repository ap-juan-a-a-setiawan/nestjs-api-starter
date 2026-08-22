import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../services/auth.service';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: jest.Mocked<AuthService>;

  const mockUser = {
    id: '123',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    localStrategy = moduleRef.get<LocalStrategy>(LocalStrategy);
    authService = moduleRef.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should be defined', () => {
      expect(localStrategy).toBeDefined();
    });

    it('should return user when credentials are valid', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(authService.validateUser).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(localStrategy.validate('test@example.com', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.validateUser).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
    });

    it('should throw UnauthorizedException when validateUser returns undefined', async () => {
      authService.validateUser.mockResolvedValue(undefined);

      await expect(localStrategy.validate('test@example.com', 'password123')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when validateUser returns empty object', async () => {
      authService.validateUser.mockResolvedValue({} as any);

      await expect(localStrategy.validate('test@example.com', 'password123')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should propagate errors from authService.validateUser', async () => {
      const error = new Error('Database connection error');
      authService.validateUser.mockRejectedValue(error);

      await expect(localStrategy.validate('test@example.com', 'password123')).rejects.toThrow(error);
      expect(authService.validateUser).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should handle empty email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('', '');

      expect(authService.validateUser).toHaveBeenCalledWith('', '');
      expect(result).toEqual(mockUser);
    });

    it('should handle special characters in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('user+test@example.com', 'p@ssw0rd!');

      expect(authService.validateUser).toHaveBeenCalledWith('user+test@example.com', 'p@ssw0rd!');
      expect(result).toEqual(mockUser);
    });

    it('should handle long email and password strings', async () => {
      const longEmail = 'a'.repeat(255) + '@example.com';
      const longPassword = 'b'.repeat(1000);
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(longEmail, longPassword);

      expect(authService.validateUser).toHaveBeenCalledWith(longEmail, longPassword);
      expect(result).toEqual(mockUser);
    });

    it('should handle whitespace in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('  test@example.com  ', '  password123  ');

      expect(authService.validateUser).toHaveBeenCalledWith('  test@example.com  ', '  password123  ');
      expect(result).toEqual(mockUser);
    });

    it('should handle null values', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(null as any, null as any);

      expect(authService.validateUser).toHaveBeenCalledWith(null, null);
      expect(result).toEqual(mockUser);
    });

    it('should handle undefined values', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(undefined as any, undefined as any);

      expect(authService.validateUser).toHaveBeenCalledWith(undefined, undefined);
      expect(result).toEqual(mockUser);
    });

    it('should handle numeric values', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(123 as any, 456 as any);

      expect(authService.validateUser).toHaveBeenCalledWith(123, 456);
      expect(result).toEqual(mockUser);
    });

    it('should handle boolean values', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(true as any, false as any);

      expect(authService.validateUser).toHaveBeenCalledWith(true, false);
      expect(result).toEqual(mockUser);
    });

    it('should handle object values', async () => {
      const emailObj = { email: 'test@example.com' };
      const passwordObj = { password: 'password123' };
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailObj as any, passwordObj as any);

      expect(authService.validateUser).toHaveBeenCalledWith(emailObj, passwordObj);
      expect(result).toEqual(mockUser);
    });

    it('should handle array values', async () => {
      const emailArray = ['test@example.com'];
      const passwordArray = ['password123'];
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailArray as any, passwordArray as any);

      expect(authService.validateUser).toHaveBeenCalledWith(emailArray, passwordArray);
      expect(result).toEqual(mockUser);
    });

    it('should handle symbol values', async () => {
      const emailSymbol = Symbol('email');
      const passwordSymbol = Symbol('password');
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailSymbol as any, passwordSymbol as any);

      expect(authService.validateUser).toHaveBeenCalledWith(emailSymbol, passwordSymbol);
      expect(result).toEqual(mockUser);
    });

    it('should handle bigint values', async () => {
      const emailBigInt = BigInt(123);
      const passwordBigInt = BigInt(456);
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailBigInt as any, passwordBigInt as any);

      expect(authService.validateUser).toHaveBeenCalledWith(emailBigInt, passwordBigInt);
      expect(result).toEqual(mockUser);
    });

    it('should handle function values', async () => {
      const emailFunc = () => 'test@example.com';
      const passwordFunc = () => 'password123';
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailFunc as any, passwordFunc as any);

      expect(authService.validateUser).toHaveBeenCalledWith(emailFunc, passwordFunc);
      expect(result).toEqual(mockUser);
    });

    it('should handle Date values', async () => {
      const emailDate = new Date('2023-01-01');
      const passwordDate = new Date('2023-12-31');
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailDate as any, passwordDate as any);

      expect(authService.validateUser).toHaveBeenCalledWith(emailDate, passwordDate);
      expect(result).toEqual(mockUser);
    });

    it('should handle RegExp values', async () => {
      const emailRegex = /test@example\.com/;
      const passwordRegex = /password123/;
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailRegex as any, passwordRegex as any);

      expect(authService.validateUser).toHaveBeenCalledWith(emailRegex, passwordRegex);
      expect(result).toEqual(mockUser);
    });

    it('should handle Map values', async () => {
      const emailMap = new Map([['email', 'test@example.com']]);
      const passwordMap = new Map([['password', 'password123']]);
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailMap as any, passwordMap as any);

      expect(authService.validateUser).toHaveBeenCalledWith(emailMap, passwordMap);
      expect(result).toEqual(mockUser);
    });

    it('should handle Set values', async () => {
      const emailSet = new Set(['test@example.com']);
      const passwordSet = new Set(['password123']);
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailSet as any, passwordSet as any);

      expect(authService.validateUser).toHaveBeenCalledWith(emailSet, passwordSet);
      expect(result).toEqual(mockUser);
    });

    it('should handle Promise values', async () => {
      const emailPromise = Promise.resolve('test@example.com');
      const passwordPromise = Promise.resolve('password123');
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailPromise as any, passwordPromise as any);

      expect(authService.validateUser).toHaveBeenCalledWith(emailPromise, passwordPromise);
      expect(result).toEqual(mockUser);
    });

    it('should handle mixed type values', async () => {
      const emailMixed = { email: 'test@example.com', id: 123 };
      const passwordMixed = ['password123', { type: 'string' }];
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailMixed as any, passwordMixed as any);

      expect(authService.validateUser).toHaveBeenCalledWith(emailMixed, passwordMixed);
      expect(result).toEqual(mockUser);
    });

    it('should handle multiple calls with different arguments', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      await localStrategy.validate('user1@example.com', 'pass1');
      await localStrategy.validate('user2@example.com', 'pass2');
      await localStrategy.validate('user3@example.com', 'pass3');

      expect(authService.validateUser).toHaveBeenCalledTimes(3);
      expect(authService.validateUser).toHaveBeenNthCalledWith(1, 'user1@example.com', 'pass1');
      expect(authService.validateUser).toHaveBeenNthCalledWith(2, 'user2@example.com', 'pass2');
      expect(authService.validateUser).toHaveBeenNthCalledWith(3, 'user3@example.com', 'pass3');
    });

    it('should handle concurrent calls', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const results = await Promise.all([
        localStrategy.validate('user1@example.com', 'pass1'),
        localStrategy.validate('user2@example.com', 'pass2'),
        localStrategy.validate('user3@example.com', 'pass3'),
      ]);

      expect(results).toEqual([mockUser, mockUser, mockUser]);
      expect(authService.validateUser).toHaveBeenCalledTimes(3);
    });

    it('should handle case sensitivity in email', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('TEST@EXAMPLE.COM', 'password123');

      expect(authService.validateUser).toHaveBeenCalledWith('TEST@EXAMPLE.COM', 'password123');
      expect(result).toEqual(mockUser);
    });

    it('should handle unicode characters in email and password', async () => {
      const unicodeEmail = 'tëst@éxample.com';
      const unicodePassword = 'pässwörd123';
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(unicodeEmail, unicodePassword);

      expect(authService.validateUser).toHaveBeenCalledWith(unicodeEmail, unicodePassword);
      expect(result).toEqual(mockUser);
    });

    it('should handle emoji in email and password', async () => {
      const emojiEmail = 'test😊@example.com';
      const emojiPassword = 'password😊123';
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emojiEmail, emojiPassword);

      expect(authService.validateUser).toHaveBeenCalledWith(emojiEmail, emojiPassword);
      expect(result).toEqual(mockUser);
    });

    it('should handle very large password', async () => {
      const largePassword = 'x'.repeat(100000);
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('test@example.com', largePassword);

      expect(authService.validateUser).toHaveBeenCalledWith('test@example.com', largePassword);
      expect(result).toEqual(mockUser);
    });

    it('should handle very large email', async () => {
      const largeEmail = 'a'.repeat(10000) + '@example.com';
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(largeEmail, 'password123');

      expect(authService.validateUser).toHaveBeenCalledWith(largeEmail, 'password123');
      expect(result).toEqual(mockUser);
    });

    it('should handle empty string email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('', '');

      expect(authService.validateUser).toHaveBeenCalledWith('', '');
      expect(result).toEqual(mockUser);
    });

    it('should handle whitespace-only email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('   ', '   ');

      expect(authService.validateUser).toHaveBeenCalledWith('   ', '   ');
      expect(result).toEqual(mockUser);
    });

    it('should handle newline characters in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('test@example.com\n', 'password123\n');

      expect(authService.validateUser).toHaveBeenCalledWith('test@example.com\n', 'password123\n');
      expect(result).toEqual(mockUser);
    });

    it('should handle tab characters in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('test@example.com\t', 'password123\t');

      expect(authService.validateUser).toHaveBeenCalledWith('test@example.com\t', 'password123\t');
      expect(result).toEqual(mockUser);
    });

    it('should handle null bytes in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('test@example.com\0', 'password123\0');

      expect(authService.validateUser).toHaveBeenCalledWith('test@example.com\0', 'password123\0');
      expect(result).toEqual(mockUser);
    });

    it('should handle control characters in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('test@example.com\x01', 'password123\x02');

      expect(authService.validateUser).toHaveBeenCalledWith('test@example.com\x01', 'password123\x02');
      expect(result).toEqual(mockUser);
    });

    it('should handle escaped characters in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('test\\@example.com', 'password\\123');

      expect(authService.validateUser).toHaveBeenCalledWith('test\\@example.com', 'password\\123');
      expect(result).toEqual(mockUser);
    });

    it('should handle quotes in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('"test"@example.com', '"password123"');

      expect(authService.validateUser).toHaveBeenCalledWith('"test"@example.com', '"password123"');
      expect(result).toEqual(mockUser);
    });

    it('should handle backticks in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('`test`@example.com', '`password123`');

      expect(authService.validateUser).toHaveBeenCalledWith('`test`@example.com', '`password123`');
      expect(result).toEqual(mockUser);
    });

    it('should handle dollar signs in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('$test$@example.com', '$password123$');

      expect(authService.validateUser).toHaveBeenCalledWith('$test$@example.com', '$password123$');
      expect(result).toEqual(mockUser);
    });

    it('should handle percent signs in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('%test%@example.com', '%password123%');

      expect(authService.validateUser).toHaveBeenCalledWith('%test%@example.com', '%password123%');
      expect(result).toEqual(mockUser);
    });

    it('should handle ampersands in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('&test&@example.com', '&password123&');

      expect(authService.validateUser).toHaveBeenCalledWith('&test&@example.com', '&password123&');
      expect(result).toEqual(mockUser);
    });

    it('should handle asterisks in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('*test*@example.com', '*password123*');

      expect(authService.validateUser).toHaveBeenCalledWith('*test*@example.com', '*password123*');
      expect(result).toEqual(mockUser);
    });

    it('should handle plus signs in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('+test+@example.com', '+password123+');

      expect(authService.validateUser).toHaveBeenCalledWith('+test+@example.com', '+password123+');
      expect(result).toEqual(mockUser);
    });

    it('should handle hyphens in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('-test-@example.com', '-password123-');

      expect(authService.validateUser).toHaveBeenCalledWith('-test-@example.com', '-password123-');
      expect(result).toEqual(mockUser);
    });

    it('should handle underscores in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('_test_@example.com', '_password123_');

      expect(authService.validateUser).toHaveBeenCalledWith('_test_@example.com', '_password123_');
      expect(result).toEqual(mockUser);
    });

    it('should handle periods in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('.test.@example.com', '.password123.');

      expect(authService.validateUser).toHaveBeenCalledWith('.test.@example.com', '.password123.');
      expect(result).toEqual(mockUser);
    });

    it('should handle slashes in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('/test/@example.com', '/password123/');

      expect(authService.validateUser).toHaveBeenCalledWith('/test/@example.com', '/password123/');
      expect(result).toEqual(mockUser);
    });

    it('should handle backslashes in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('\\test\\@example.com', '\\password123\\');

      expect(authService.validateUser).toHaveBeenCalledWith('\\test\\@example.com', '\\password123\\');
      expect(result).toEqual(mockUser);
    });

    it('should handle brackets in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('[test]@example.com', '[password123]');

      expect(authService.validateUser).toHaveBeenCalledWith('[test]@example.com', '[password123]');
      expect(result).toEqual(mockUser);
    });

    it('should handle braces in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('{test}@example.com', '{password123}');

      expect(authService.validateUser).toHaveBeenCalledWith('{test}@example.com', '{password123}');
      expect(result).toEqual(mockUser);
    });

    it('should handle parentheses in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('(test)@example.com', '(password123)');

      expect(authService.validateUser).toHaveBeenCalledWith('(test)@example.com', '(password123)');
      expect(result).toEqual(mockUser);
    });

    it('should handle angle brackets in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('<test>@example.com', '<password123>');

      expect(authService.validateUser).toHaveBeenCalledWith('<test>@example.com', '<password123>');
      expect(result).toEqual(mockUser);
    });

    it('should handle pipes in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('|test|@example.com', '|password123|');

      expect(authService.validateUser).toHaveBeenCalledWith('|test|@example.com', '|password123|');
      expect(result).toEqual(mockUser);
    });

    it('should handle colons in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(':test:@example.com', ':password123:');

      expect(authService.validateUser).toHaveBeenCalledWith(':test:@example.com', ':password123:');
      expect(result).toEqual(mockUser);
    });

    it('should handle semicolons in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(';test;@example.com', ';password123;');

      expect(authService.validateUser).toHaveBeenCalledWith(';test;@example.com', ';password123;');
      expect(result).toEqual(mockUser);
    });

    it('should handle exclamation marks in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('!test!@example.com', '!password123!');

      expect(authService.validateUser).toHaveBeenCalledWith('!test!@example.com', '!password123!');
      expect(result).toEqual(mockUser);
    });

    it('should handle question marks in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('?test?@example.com', '?password123?');

      expect(authService.validateUser).toHaveBeenCalledWith('?test?@example.com', '?password123?');
      expect(result).toEqual(mockUser);
    });

    it('should handle at signs in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('@test@@example.com', '@password123@');

      expect(authService.validateUser).toHaveBeenCalledWith('@test@@example.com', '@password123@');
      expect(result).toEqual(mockUser);
    });

    it('should handle hash signs in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('#test#@example.com', '#password123#');

      expect(authService.validateUser).toHaveBeenCalledWith('#test#@example.com', '#password123#');
      expect(result).toEqual(mockUser);
    });

    it('should handle caret signs in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('^test^@example.com', '^password123^');

      expect(authService.validateUser).toHaveBeenCalledWith('^test^@example.com', '^password123^');
      expect(result).toEqual(mockUser);
    });

    it('should handle tilde signs in email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('~test~@example.com', '~password123~');

      expect(authService.validateUser).toHaveBeenCalledWith('~test~@example.com', '~password123~');
      expect(result).toEqual(mockUser);
    });

    it('should handle all special characters combined', async () => {
      const specialEmail = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`@example.com';
      const specialPassword = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(specialEmail, specialPassword);

      expect(authService.validateUser).toHaveBeenCalledWith(specialEmail, specialPassword);
      expect(result).toEqual(mockUser);
    });
  });
});