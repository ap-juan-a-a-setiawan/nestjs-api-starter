import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { User } from '../../Users/decorators/user.decorator';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockLoginDto: LoginDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  const mockLoginResponse = {
    accessToken: 'mock-jwt-token',
    user: {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
        {
          provide: LocalAuthGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should call authService.login with the user object', async () => {
      authService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(mockLoginDto);

      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should return the login response from authService', async () => {
      authService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle login with empty user object', async () => {
      const emptyUser = {} as LoginDto;
      authService.login.mockResolvedValue({});

      const result = await controller.login(emptyUser);

      expect(authService.login).toHaveBeenCalledWith(emptyUser);
      expect(result).toEqual({});
    });

    it('should handle login with null user', async () => {
      const nullUser = null as unknown as LoginDto;
      authService.login.mockResolvedValue(null);

      const result = await controller.login(nullUser);

      expect(authService.login).toHaveBeenCalledWith(nullUser);
      expect(result).toBeNull();
    });

    it('should handle login with undefined user', async () => {
      const undefinedUser = undefined as unknown as LoginDto;
      authService.login.mockResolvedValue(undefined);

      const result = await controller.login(undefinedUser);

      expect(authService.login).toHaveBeenCalledWith(undefinedUser);
      expect(result).toBeUndefined();
    });

    it('should propagate errors from authService', async () => {
      const error = new Error('Invalid credentials');
      authService.login.mockRejectedValue(error);

      await expect(controller.login(mockLoginDto)).rejects.toThrow('Invalid credentials');
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login with additional user properties', async () => {
      const userWithExtraProps = {
        ...mockLoginDto,
        id: 123,
        role: 'admin',
      } as LoginDto;

      authService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithExtraProps);

      expect(authService.login).toHaveBeenCalledWith(userWithExtraProps);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle login with missing email', async () => {
      const userWithoutEmail = {
        password: 'password123',
      } as LoginDto;

      authService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithoutEmail);

      expect(authService.login).toHaveBeenCalledWith(userWithoutEmail);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle login with missing password', async () => {
      const userWithoutPassword = {
        email: 'test@example.com',
      } as LoginDto;

      authService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithoutPassword);

      expect(authService.login).toHaveBeenCalledWith(userWithoutPassword);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle login with empty string values', async () => {
      const userWithEmptyStrings = {
        email: '',
        password: '',
      } as LoginDto;

      authService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithEmptyStrings);

      expect(authService.login).toHaveBeenCalledWith(userWithEmptyStrings);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle login with whitespace values', async () => {
      const userWithWhitespace = {
        email: '   ',
        password: '   ',
      } as LoginDto;

      authService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithWhitespace);

      expect(authService.login).toHaveBeenCalledWith(userWithWhitespace);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle login with special characters in credentials', async () => {
      const userWithSpecialChars = {
        email: 'test+special@example.com',
        password: 'p@ssw0rd!$#',
      } as LoginDto;

      authService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithSpecialChars);

      expect(authService.login).toHaveBeenCalledWith(userWithSpecialChars);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle login with very long credentials', async () => {
      const longEmail = 'a'.repeat(255) + '@example.com';
      const longPassword = 'b'.repeat(1000);
      const userWithLongCredentials = {
        email: longEmail,
        password: longPassword,
      } as LoginDto;

      authService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithLongCredentials);

      expect(authService.login).toHaveBeenCalledWith(userWithLongCredentials);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle login when authService returns a promise that resolves later', async () => {
      authService.login.mockImplementation(() => 
        new Promise((resolve) => {
          setTimeout(() => resolve(mockLoginResponse), 100);
        })
      );

      const result = await controller.login(mockLoginDto);

      expect(result).toEqual(mockLoginResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a complex response', async () => {
      const complexResponse = {
        accessToken: 'token',
        refreshToken: 'refresh-token',
        user: {
          id: 1,
          email: 'test@example.com',
          profile: {
            firstName: 'John',
            lastName: 'Doe',
            roles: ['admin', 'user'],
          },
          settings: {
            theme: 'dark',
            notifications: true,
          },
        },
        expiresIn: 3600,
      };

      authService.login.mockResolvedValue(complexResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toEqual(complexResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns an error response', async () => {
      const errorResponse = {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Invalid credentials',
      };

      authService.login.mockResolvedValue(errorResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toEqual(errorResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService throws a non-Error exception', async () => {
      const customError = { code: 'AUTH_ERROR', message: 'Authentication failed' };
      authService.login.mockRejectedValue(customError);

      await expect(controller.login(mockLoginDto)).rejects.toEqual(customError);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService throws a string error', async () => {
      const stringError = 'Authentication failed';
      authService.login.mockRejectedValue(stringError);

      await expect(controller.login(mockLoginDto)).rejects.toBe(stringError);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService throws a null error', async () => {
      authService.login.mockRejectedValue(null);

      await expect(controller.login(mockLoginDto)).rejects.toBeNull();
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService throws an undefined error', async () => {
      authService.login.mockRejectedValue(undefined);

      await expect(controller.login(mockLoginDto)).rejects.toBeUndefined();
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService throws an Error with custom properties', async () => {
      const error = new Error('Custom error');
      error.name = 'CustomError';
      error.stack = 'Custom stack trace';
      (error as any).statusCode = 500;
      (error as any).code = 'INTERNAL_ERROR';

      authService.login.mockRejectedValue(error);

      await expect(controller.login(mockLoginDto)).rejects.toThrow('Custom error');
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns null', async () => {
      authService.login.mockResolvedValue(null);

      const result = await controller.login(mockLoginDto);

      expect(result).toBeNull();
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns undefined', async () => {
      authService.login.mockResolvedValue(undefined);

      const result = await controller.login(mockLoginDto);

      expect(result).toBeUndefined();
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns an empty object', async () => {
      authService.login.mockResolvedValue({});

      const result = await controller.login(mockLoginDto);

      expect(result).toEqual({});
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns an array', async () => {
      const arrayResponse = ['token', 'user'];
      authService.login.mockResolvedValue(arrayResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toEqual(arrayResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a string', async () => {
      const stringResponse = 'login successful';
      authService.login.mockResolvedValue(stringResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(stringResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a number', async () => {
      const numberResponse = 200;
      authService.login.mockResolvedValue(numberResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(numberResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a boolean', async () => {
      const booleanResponse = true;
      authService.login.mockResolvedValue(booleanResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(booleanResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Date object', async () => {
      const dateResponse = new Date('2024-01-01T00:00:00Z');
      authService.login.mockResolvedValue(dateResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toEqual(dateResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Buffer', async () => {
      const bufferResponse = Buffer.from('test');
      authService.login.mockResolvedValue(bufferResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toEqual(bufferResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Symbol', async () => {
      const symbolResponse = Symbol('test');
      authService.login.mockResolvedValue(symbolResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(symbolResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a BigInt', async () => {
      const bigIntResponse = BigInt(123456789);
      authService.login.mockResolvedValue(bigIntResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(bigIntResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a function', async () => {
      const functionResponse = () => 'test';
      authService.login.mockResolvedValue(functionResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(functionResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that rejects', async () => {
      const error = new Error('Promise rejection');
      authService.login.mockRejectedValue(error);

      await expect(controller.login(mockLoginDto)).rejects.toThrow('Promise rejection');
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to null', async () => {
      authService.login.mockResolvedValue(null);

      const result = await controller.login(mockLoginDto);

      expect(result).toBeNull();
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to undefined', async () => {
      authService.login.mockResolvedValue(undefined);

      const result = await controller.login(mockLoginDto);

      expect(result).toBeUndefined();
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to an empty object', async () => {
      authService.login.mockResolvedValue({});

      const result = await controller.login(mockLoginDto);

      expect(result).toEqual({});
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to an array', async () => {
      const arrayResponse = ['token', 'user'];
      authService.login.mockResolvedValue(arrayResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toEqual(arrayResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a string', async () => {
      const stringResponse = 'login successful';
      authService.login.mockResolvedValue(stringResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(stringResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a number', async () => {
      const numberResponse = 200;
      authService.login.mockResolvedValue(numberResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(numberResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a boolean', async () => {
      const booleanResponse = true;
      authService.login.mockResolvedValue(booleanResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(booleanResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a Date object', async () => {
      const dateResponse = new Date('2024-01-01T00:00:00Z');
      authService.login.mockResolvedValue(dateResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toEqual(dateResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a Buffer', async () => {
      const bufferResponse = Buffer.from('test');
      authService.login.mockResolvedValue(bufferResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toEqual(bufferResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a Symbol', async () => {
      const symbolResponse = Symbol('test');
      authService.login.mockResolvedValue(symbolResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(symbolResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a BigInt', async () => {
      const bigIntResponse = BigInt(123456789);
      authService.login.mockResolvedValue(bigIntResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(bigIntResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a function', async () => {
      const functionResponse = () => 'test';
      authService.login.mockResolvedValue(functionResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(functionResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a nested object', async () => {
      const nestedResponse = {
        data: {
          user: {
            id: 1,
            name: 'Test',
            address: {
              street: '123 Main St',
              city: 'Test City',
              country: 'Test Country',
            },
          },
          token: 'jwt-token',
        },
        status: 'success',
      };

      authService.login.mockResolvedValue(nestedResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toEqual(nestedResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a circular object', async () => {
      const circularObject: any = { name: 'test' };
      circularObject.self = circularObject;

      authService.login.mockResolvedValue(circularObject);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(circularObject);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a frozen object', async () => {
      const frozenObject = Object.freeze({ token: 'jwt-token', user: { id: 1 } });

      authService.login.mockResolvedValue(frozenObject);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(frozenObject);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a sealed object', async () => {
      const sealedObject = Object.seal({ token: 'jwt-token', user: { id: 1 } });

      authService.login.mockResolvedValue(sealedObject);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(sealedObject);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a non-extensible object', async () => {
      const nonExtensibleObject = Object.preventExtensions({ token: 'jwt-token', user: { id: 1 } });

      authService.login.mockResolvedValue(nonExtensibleObject);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(nonExtensibleObject);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a Map', async () => {
      const mapResponse = new Map([['key', 'value']]);

      authService.login.mockResolvedValue(mapResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(mapResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a Set', async () => {
      const setResponse = new Set(['value1', 'value2']);

      authService.login.mockResolvedValue(setResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(setResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a WeakMap', async () => {
      const weakMapResponse = new WeakMap();
      const key = {};
      weakMapResponse.set(key, 'value');

      authService.login.mockResolvedValue(weakMapResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(weakMapResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a WeakSet', async () => {
      const weakSetResponse = new WeakSet();
      const obj = {};
      weakSetResponse.add(obj);

      authService.login.mockResolvedValue(weakSetResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(weakSetResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a RegExp', async () => {
      const regexResponse = /test/g;

      authService.login.mockResolvedValue(regexResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(regexResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a Promise', async () => {
      const promiseResponse = Promise.resolve('nested promise');
      authService.login.mockResolvedValue(promiseResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(promiseResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a class instance', async () => {
      class TestClass {
        constructor(public value: string) {}
      }
      const classInstance = new TestClass('test');

      authService.login.mockResolvedValue(classInstance);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(classInstance);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a generator object', async () => {
      function* generator() {
        yield 1;
        yield 2;
      }
      const generatorObject = generator();

      authService.login.mockResolvedValue(generatorObject);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(generatorObject);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to an async generator object', async () => {
      async function* asyncGenerator() {
        yield 1;
        yield 2;
      }
      const asyncGeneratorObject = asyncGenerator();

      authService.login.mockResolvedValue(asyncGeneratorObject);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(asyncGeneratorObject);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a Proxy object', async () => {
      const target = { token: 'jwt-token' };
      const proxyObject = new Proxy(target, {
        get: (obj, prop) => {
          if (prop === 'token') return 'proxied-token';
          return obj[prop];
        },
      });

      authService.login.mockResolvedValue(proxyObject);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(proxyObject);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a typed array', async () => {
      const typedArray = new Uint8Array([1, 2, 3]);

      authService.login.mockResolvedValue(typedArray);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(typedArray);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a DataView', async () => {
      const buffer = new ArrayBuffer(16);
      const dataView = new DataView(buffer);

      authService.login.mockResolvedValue(dataView);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(dataView);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to an ArrayBuffer', async () => {
      const arrayBuffer = new ArrayBuffer(16);

      authService.login.mockResolvedValue(arrayBuffer);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(arrayBuffer);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a SharedArrayBuffer', async () => {
      const sharedArrayBuffer = new SharedArrayBuffer(16);

      authService.login.mockResolvedValue(sharedArrayBuffer);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(sharedArrayBuffer);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to an Error object', async () => {
      const errorObject = new Error('Test error');

      authService.login.mockResolvedValue(errorObject);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(errorObject);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a TypeError', async () => {
      const typeError = new TypeError('Type error');

      authService.login.mockResolvedValue(typeError);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(typeError);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a RangeError', async () => {
      const rangeError = new RangeError('Range error');

      authService.login.mockResolvedValue(rangeError);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(rangeError);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a ReferenceError', async () => {
      const referenceError = new ReferenceError('Reference error');

      authService.login.mockResolvedValue(referenceError);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(referenceError);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a SyntaxError', async () => {
      const syntaxError = new SyntaxError('Syntax error');

      authService.login.mockResolvedValue(syntaxError);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(syntaxError);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a URIError', async () => {
      const uriError = new URIError('URI error');

      authService.login.mockResolvedValue(uriError);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(uriError);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to an EvalError', async () => {
      const evalError = new EvalError('Eval error');

      authService.login.mockResolvedValue(evalError);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(evalError);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to an AggregateError', async () => {
      const aggregateError = new AggregateError([new Error('Error 1'), new Error('Error 2')], 'Aggregate error');

      authService.login.mockResolvedValue(aggregateError);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(aggregateError);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a custom error class', async () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'CustomError';
        }
      }
      const customError = new CustomError('Custom error');

      authService.login.mockResolvedValue(customError);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(customError);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to a null prototype object', async () => {
      const nullProtoObject = Object.create(null);
      nullProtoObject.token = 'jwt-token';

      authService.login.mockResolvedValue(nullProtoObject);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(nullProtoObject);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to an object with getters', async () => {
      const objectWithGetters = {
        get token() {
          return 'jwt-token';
        },
        get user() {
          return { id: 1, email: 'test@example.com' };
        },
      };

      authService.login.mockResolvedValue(objectWithGetters);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(objectWithGetters);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to an object with setters', async () => {
      const objectWithSetters = {
        _token: 'jwt-token',
        set token(value: string) {
          this._token = value;
        },
        get token() {
          return this._token;
        },
      };

      authService.login.mockResolvedValue(objectWithSetters);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(objectWithSetters);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to an object with symbol properties', async () => {
      const symbolKey = Symbol('symbolKey');
      const objectWithSymbols = {
        [symbolKey]: 'symbol-value',
        token: 'jwt-token',
      };

      authService.login.mockResolvedValue(objectWithSymbols);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(objectWithSymbols);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to an object with non-enumerable properties', async () => {
      const objectWithNonEnumerable = { token: 'jwt-token' };
      Object.defineProperty(objectWithNonEnumerable, 'hidden', {
        value: 'hidden-value',
        enumerable: false,
      });

      authService.login.mockResolvedValue(objectWithNonEnumerable);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(objectWithNonEnumerable);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to an object with inherited properties', async () => {
      const parent = { inherited: 'value' };
      const child = Object.create(parent);
      child.token = 'jwt-token';

      authService.login.mockResolvedValue(child);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(child);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to an object with a custom toString method', async () => {
      const objectWithCustomToString = {
        token: 'jwt-token',
        toString() {
          return 'Custom string representation';
        },
      };

      authService.login.mockResolvedValue(objectWithCustomToString);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(objectWithCustomToString);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to an object with a custom valueOf method', async () => {
      const objectWithCustomValueOf = {
        token: 'jwt-token',
        valueOf() {
          return 42;
        },
      };

      authService.login.mockResolvedValue(objectWithCustomValueOf);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(objectWithCustomValueOf);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle login when authService returns a Promise that resolves to an object with a custom Symbol.toPrimitive method', async () => {
      const objectWithToPrimitive = {
        token: 'jwt-token',
        [Symbol.toPrimitive](hint: string) {
          if (hint === 'string') return 'string representation';
          if (hint === 'number') return 42;
          return null;
        },
      };

      authService.login.mockResolvedValue(objectWithToPrimitive);

      const result = await controller.login(mockLoginDto);

      expect(result).toBe(objectWithToPrimitive);
      expect(authService.login).to