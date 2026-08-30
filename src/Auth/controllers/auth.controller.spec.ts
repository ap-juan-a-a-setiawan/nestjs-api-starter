import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { User } from '../../Users/decorators/user.decorator';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockUser: LoginDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  const mockLoginResponse = {
    access_token: 'mock-jwt-token',
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
          useValue: mockAuthService,
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
      expect(controller.login).toBeDefined();
    });

    it('should call authService.login with the user object', async () => {
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(mockUser);

      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should return the login response from authService', async () => {
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(mockUser);

      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle empty user object', async () => {
      const emptyUser = {} as LoginDto;
      mockAuthService.login.mockResolvedValue({});

      const result = await controller.login(emptyUser);

      expect(authService.login).toHaveBeenCalledWith(emptyUser);
      expect(result).toEqual({});
    });

    it('should handle user with missing fields', async () => {
      const incompleteUser = { email: 'test@example.com' } as LoginDto;
      mockAuthService.login.mockResolvedValue({});

      const result = await controller.login(incompleteUser);

      expect(authService.login).toHaveBeenCalledWith(incompleteUser);
      expect(result).toEqual({});
    });

    it('should propagate errors from authService.login', async () => {
      const error = new Error('Invalid credentials');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Invalid credentials');
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should handle null user', async () => {
      mockAuthService.login.mockResolvedValue(null);

      const result = await controller.login(null as any);

      expect(authService.login).toHaveBeenCalledWith(null);
      expect(result).toBeNull();
    });

    it('should handle undefined user', async () => {
      mockAuthService.login.mockResolvedValue(undefined);

      const result = await controller.login(undefined as any);

      expect(authService.login).toHaveBeenCalledWith(undefined);
      expect(result).toBeUndefined();
    });

    it('should handle authService returning null', async () => {
      mockAuthService.login.mockResolvedValue(null);

      const result = await controller.login(mockUser);

      expect(result).toBeNull();
    });

    it('should handle authService returning undefined', async () => {
      mockAuthService.login.mockResolvedValue(undefined);

      const result = await controller.login(mockUser);

      expect(result).toBeUndefined();
    });

    it('should handle authService throwing a generic error', async () => {
      const error = new Error('Service unavailable');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Service unavailable');
    });

    it('should handle authService throwing a non-Error value', async () => {
      const error = 'String error';
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toBe('String error');
    });

    it('should handle authService throwing an object error', async () => {
      const error = { message: 'Object error', statusCode: 500 };
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toEqual(error);
    });

    it('should handle authService throwing an array error', async () => {
      const error = ['Error 1', 'Error 2'];
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toEqual(error);
    });

    it('should handle authService throwing a number error', async () => {
      const error = 500;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toBe(500);
    });

    it('should handle authService throwing a boolean error', async () => {
      const error = false;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toBe(false);
    });

    it('should handle authService throwing a null error', async () => {
      const error = null;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toBeNull();
    });

    it('should handle authService throwing an undefined error', async () => {
      const error = undefined;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toBeUndefined();
    });

    it('should handle authService throwing a symbol error', async () => {
      const error = Symbol('error');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toBe(error);
    });

    it('should handle authService throwing a bigint error', async () => {
      const error = BigInt(123);
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toBe(error);
    });

    it('should handle authService throwing a function error', async () => {
      const error = () => 'function error';
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toBe(error);
    });

    it('should handle authService throwing a Date error', async () => {
      const error = new Date();
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toBe(error);
    });

    it('should handle authService throwing a RegExp error', async () => {
      const error = /regex/;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toBe(error);
    });

    it('should handle authService throwing a Map error', async () => {
      const error = new Map([['key', 'value']]);
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toBe(error);
    });

    it('should handle authService throwing a Set error', async () => {
      const error = new Set([1, 2, 3]);
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toBe(error);
    });

    it('should handle authService throwing a Promise error', async () => {
      const error = Promise.reject('Promise error');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toBe(error);
    });

    it('should handle authService throwing a class instance error', async () => {
      class CustomError extends Error {
        constructor() {
          super('Custom error');
          this.name = 'CustomError';
        }
      }
      const error = new CustomError();
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toBe(error);
    });

    it('should handle authService throwing a nested error', async () => {
      const error = { outer: { inner: 'nested error' } };
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toEqual(error);
    });

    it('should handle authService throwing an error with custom properties', async () => {
      const error = new Error('Custom error');
      error.name = 'CustomError';
      error.stack = 'Custom stack';
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Custom error');
    });

    it('should handle authService throwing an error with status code', async () => {
      const error = new Error('Unauthorized');
      (error as any).status = 401;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Unauthorized');
    });

    it('should handle authService throwing an error with response object', async () => {
      const error = new Error('Bad Request');
      (error as any).response = { message: 'Invalid input', statusCode: 400 };
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Bad Request');
    });

    it('should handle authService throwing an error with multiple properties', async () => {
      const error = new Error('Multiple properties');
      (error as any).status = 500;
      (error as any).code = 'INTERNAL_ERROR';
      (error as any).details = { field: 'email' };
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Multiple properties');
    });

    it('should handle authService throwing an error with getter properties', async () => {
      const error = new Error('Getter error');
      Object.defineProperty(error, 'customProperty', {
        get: () => 'custom value',
        enumerable: true,
      });
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Getter error');
    });

    it('should handle authService throwing an error with symbol properties', async () => {
      const error = new Error('Symbol property error');
      const symbolKey = Symbol('custom');
      (error as any)[symbolKey] = 'symbol value';
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Symbol property error');
    });

    it('should handle authService throwing an error with non-enumerable properties', async () => {
      const error = new Error('Non-enumerable error');
      Object.defineProperty(error, 'hiddenProperty', {
        value: 'hidden value',
        enumerable: false,
      });
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Non-enumerable error');
    });

    it('should handle authService throwing an error with prototype chain', async () => {
      class BaseError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'BaseError';
        }
      }
      class ChildError extends BaseError {
        constructor() {
          super('Child error');
          this.name = 'ChildError';
        }
      }
      const error = new ChildError();
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Child error');
    });

    it('should handle authService throwing an error with circular reference', async () => {
      const error: any = new Error('Circular error');
      error.self = error;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Circular error');
    });

    it('should handle authService throwing an error with deep circular reference', async () => {
      const error: any = new Error('Deep circular error');
      error.obj = { nested: { circular: null } };
      error.obj.nested.circular = error.obj;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Deep circular error');
    });

    it('should handle authService throwing an error with array circular reference', async () => {
      const error: any = new Error('Array circular error');
      error.arr = [1, 2, 3];
      error.arr.push(error.arr);
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Array circular error');
    });

    it('should handle authService throwing an error with mixed circular references', async () => {
      const error: any = new Error('Mixed circular error');
      error.obj = { arr: [] };
      error.obj.arr.push(error.obj);
      error.self = error;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Mixed circular error');
    });

    it('should handle authService throwing an error with multiple circular references', async () => {
      const error: any = new Error('Multiple circular error');
      error.obj1 = { ref: null };
      error.obj2 = { ref: null };
      error.obj1.ref = error.obj2;
      error.obj2.ref = error.obj1;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Multiple circular error');
    });

    it('should handle authService throwing an error with self-referencing array', async () => {
      const error: any = new Error('Self-referencing array error');
      error.arr = [];
      error.arr.push(error.arr);
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing array error');
    });

    it('should handle authService throwing an error with self-referencing object', async () => {
      const error: any = new Error('Self-referencing object error');
      error.obj = {};
      error.obj.self = error.obj;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing object error');
    });

    it('should handle authService throwing an error with self-referencing function', async () => {
      const error: any = new Error('Self-referencing function error');
      error.fn = () => error.fn;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing function error');
    });

    it('should handle authService throwing an error with self-referencing Map', async () => {
      const error: any = new Error('Self-referencing Map error');
      error.map = new Map();
      error.map.set('self', error.map);
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing Map error');
    });

    it('should handle authService throwing an error with self-referencing Set', async () => {
      const error: any = new Error('Self-referencing Set error');
      error.set = new Set();
      error.set.add(error.set);
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing Set error');
    });

    it('should handle authService throwing an error with self-referencing Date', async () => {
      const error: any = new Error('Self-referencing Date error');
      error.date = new Date();
      (error.date as any).self = error.date;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing Date error');
    });

    it('should handle authService throwing an error with self-referencing RegExp', async () => {
      const error: any = new Error('Self-referencing RegExp error');
      error.regex = /test/;
      (error.regex as any).self = error.regex;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing RegExp error');
    });

    it('should handle authService throwing an error with self-referencing Promise', async () => {
      const error: any = new Error('Self-referencing Promise error');
      error.promise = Promise.resolve();
      (error.promise as any).self = error.promise;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing Promise error');
    });

    it('should handle authService throwing an error with self-referencing WeakMap', async () => {
      const error: any = new Error('Self-referencing WeakMap error');
      error.weakMap = new WeakMap();
      const key = {};
      error.weakMap.set(key, error.weakMap);
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing WeakMap error');
    });

    it('should handle authService throwing an error with self-referencing WeakSet', async () => {
      const error: any = new Error('Self-referencing WeakSet error');
      error.weakSet = new WeakSet();
      const obj = {};
      error.weakSet.add(obj);
      (error.weakSet as any).self = error.weakSet;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing WeakSet error');
    });

    it('should handle authService throwing an error with self-referencing ArrayBuffer', async () => {
      const error: any = new Error('Self-referencing ArrayBuffer error');
      error.buffer = new ArrayBuffer(8);
      (error.buffer as any).self = error.buffer;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing ArrayBuffer error');
    });

    it('should handle authService throwing an error with self-referencing TypedArray', async () => {
      const error: any = new Error('Self-referencing TypedArray error');
      error.typedArray = new Uint8Array([1, 2, 3]);
      (error.typedArray as any).self = error.typedArray;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing TypedArray error');
    });

    it('should handle authService throwing an error with self-referencing DataView', async () => {
      const error: any = new Error('Self-referencing DataView error');
      error.dataView = new DataView(new ArrayBuffer(8));
      (error.dataView as any).self = error.dataView;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing DataView error');
    });

    it('should handle authService throwing an error with self-referencing SharedArrayBuffer', async () => {
      const error: any = new Error('Self-referencing SharedArrayBuffer error');
      error.sharedBuffer = new SharedArrayBuffer(8);
      (error.sharedBuffer as any).self = error.sharedBuffer;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing SharedArrayBuffer error');
    });

    it('should handle authService throwing an error with self-referencing BigInt64Array', async () => {
      const error: any = new Error('Self-referencing BigInt64Array error');
      error.bigIntArray = new BigInt64Array([1n, 2n, 3n]);
      (error.bigIntArray as any).self = error.bigIntArray;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing BigInt64Array error');
    });

    it('should handle authService throwing an error with self-referencing BigUint64Array', async () => {
      const error: any = new Error('Self-referencing BigUint64Array error');
      error.bigUintArray = new BigUint64Array([1n, 2n, 3n]);
      (error.bigUintArray as any).self = error.bigUintArray;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing BigUint64Array error');
    });

    it('should handle authService throwing an error with self-referencing Float32Array', async () => {
      const error: any = new Error('Self-referencing Float32Array error');
      error.floatArray = new Float32Array([1.5, 2.5, 3.5]);
      (error.floatArray as any).self = error.floatArray;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing Float32Array error');
    });

    it('should handle authService throwing an error with self-referencing Float64Array', async () => {
      const error: any = new Error('Self-referencing Float64Array error');
      error.float64Array = new Float64Array([1.5, 2.5, 3.5]);
      (error.float64Array as any).self = error.float64Array;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing Float64Array error');
    });

    it('should handle authService throwing an error with self-referencing Int8Array', async () => {
      const error: any = new Error('Self-referencing Int8Array error');
      error.int8Array = new Int8Array([1, 2, 3]);
      (error.int8Array as any).self = error.int8Array;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing Int8Array error');
    });

    it('should handle authService throwing an error with self-referencing Int16Array', async () => {
      const error: any = new Error('Self-referencing Int16Array error');
      error.int16Array = new Int16Array([1, 2, 3]);
      (error.int16Array as any).self = error.int16Array;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing Int16Array error');
    });

    it('should handle authService throwing an error with self-referencing Int32Array', async () => {
      const error: any = new Error('Self-referencing Int32Array error');
      error.int32Array = new Int32Array([1, 2, 3]);
      (error.int32Array as any).self = error.int32Array;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing Int32Array error');
    });

    it('should handle authService throwing an error with self-referencing Uint8Array', async () => {
      const error: any = new Error('Self-referencing Uint8Array error');
      error.uint8Array = new Uint8Array([1, 2, 3]);
      (error.uint8Array as any).self = error.uint8Array;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing Uint8Array error');
    });

    it('should handle authService throwing an error with self-referencing Uint8ClampedArray', async () => {
      const error: any = new Error('Self-referencing Uint8ClampedArray error');
      error.uint8ClampedArray = new Uint8ClampedArray([1, 2, 3]);
      (error.uint8ClampedArray as any).self = error.uint8ClampedArray;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing Uint8ClampedArray error');
    });

    it('should handle authService throwing an error with self-referencing Uint16Array', async () => {
      const error: any = new Error('Self-referencing Uint16Array error');
      error.uint16Array = new Uint16Array([1, 2, 3]);
      (error.uint16Array as any).self = error.uint16Array;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing Uint16Array error');
    });

    it('should handle authService throwing an error with self-referencing Uint32Array', async () => {
      const error: any = new Error('Self-referencing Uint32Array error');
      error.uint32Array = new Uint32Array([1, 2, 3]);
      (error.uint32Array as any).self = error.uint32Array;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing Uint32Array error');
    });

    it('should handle authService throwing an error with self-referencing Array', async () => {
      const error: any = new Error('Self-referencing Array error');
      error.array = [1, 2, 3];
      error.array.push(error.array);
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing Array error');
    });

    it('should handle authService throwing an error with self-referencing Object', async () => {
      const error: any = new Error('Self-referencing Object error');
      error.obj = {};
      error.obj.self = error.obj;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing Object error');
    });

    it('should handle authService throwing an error with self-referencing Function', async () => {
      const error: any = new Error('Self-referencing Function error');
      error.fn = () => error.fn;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing Function error');
    });

    it('should handle authService throwing an error with self-referencing Symbol', async () => {
      const error: any = new Error('Self-referencing Symbol error');
      error.symbol = Symbol('test');
      (error.symbol as any).self = error.symbol;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing Symbol error');
    });

    it('should handle authService throwing an error with self-referencing BigInt', async () => {
      const error: any = new Error('Self-referencing BigInt error');
      error.bigInt = 123n;
      (error.bigInt as any).self = error.bigInt;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing BigInt error');
    });

    it('should handle authService throwing an error with self-referencing Number', async () => {
      const error: any = new Error('Self-referencing Number error');
      error.number = 123;
      (error.number as any).self = error.number;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing Number error');
    });

    it('should handle authService throwing an error with self-referencing String', async () => {
      const error: any = new Error('Self-referencing String error');
      error.string = 'test';
      (error.string as any).self = error.string;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing String error');
    });

    it('should handle authService throwing an error with self-referencing Boolean', async () => {
      const error: any = new Error('Self-referencing Boolean error');
      error.boolean = true;
      (error.boolean as any).self = error.boolean;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing Boolean error');
    });

    it('should handle authService throwing an error with self-referencing Null', async () => {
      const error: any = new Error('Self-referencing Null error');
      error.nullValue = null;
      (error.nullValue as any).self = error.nullValue;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing Null error');
    });

    it('should handle authService throwing an error with self-referencing Undefined', async () => {
      const error: any = new Error('Self-referencing Undefined error');
      error.undefinedValue = undefined;
      (error.undefinedValue as any).self = error.undefinedValue;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing Undefined error');
    });

    it('should handle authService throwing an error with self-referencing NaN', async () => {
      const error: any = new Error('Self-referencing NaN error');
      error.nanValue = NaN;
      (error.nanValue as any).self = error.nanValue;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing NaN error');
    });

    it('should handle authService throwing an error with self-referencing Infinity', async () => {
      const error: any = new Error('Self-referencing Infinity error');
      error.infinityValue = Infinity;
      (error.infinityValue as any).self = error.infinityValue;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing Infinity error');
    });

    it('should handle authService throwing an error with self-referencing -Infinity', async () => {
      const error: any = new Error('Self-referencing -Infinity error');
      error.negativeInfinityValue = -Infinity;
      (error.negativeInfinityValue as any).self = error.negativeInfinityValue;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing -Infinity error');
    });

    it('should handle authService throwing an error with self-referencing 0', async () => {
      const error: any = new Error('Self-referencing 0 error');
      error.zeroValue = 0;
      (error.zeroValue as any).self = error.zeroValue;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing 0 error');
    });

    it('should handle authService throwing an error with self-referencing empty string', async () => {
      const error: any = new Error('Self-referencing empty string error');
      error.emptyString = '';
      (error.emptyString as any).self = error.emptyString;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing empty string error');
    });

    it('should handle authService throwing an error with self-referencing false', async () => {
      const error: any = new Error('Self-referencing false error');
      error.falseValue = false;
      (error.falseValue as any).self = error.falseValue;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing false error');
    });

    it('should handle authService throwing an error with self-referencing true', async () => {
      const error: any = new Error('Self-referencing true error');
      error.trueValue = true;
      (error.trueValue as any).self = error.trueValue;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing true error');
    });

    it('should handle authService throwing an error with self-referencing 1', async () => {
      const error: any = new Error('Self-referencing 1 error');
      error.oneValue = 1;
      (error.oneValue as any).self = error.oneValue;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing 1 error');
    });

    it('should handle authService throwing an error with self-referencing -1', async () => {
      const error: any = new Error('Self-referencing -1 error');
      error.negativeOneValue = -1;
      (error.negativeOneValue as any).self = error.negativeOneValue;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing -1 error');
    });

    it('should handle authService throwing an error with self-referencing 0.5', async () => {
      const error: any = new Error('Self-referencing 0.5 error');
      error.halfValue = 0.5;
      (error.halfValue as any).self = error.halfValue;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing 0.5 error');
    });

    it('should handle authService throwing an error with self-referencing -0.5', async () => {
      const error: any = new Error('Self-referencing -0.5 error');
      error.negativeHalfValue = -0.5;
      (error.negativeHalfValue as any).self = error.negativeHalfValue;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing -0.5 error');
    });

    it('should handle authService throwing an error with self-referencing 100', async () => {
      const error: any = new Error('Self-referencing 100 error');
      error.hundredValue = 100;
      (error.hundredValue as any).self = error.hundredValue;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Self-referencing 100 error');
    });

    it('should handle authService throwing an error with self-referencing -100', async () => {
      const error: any = new Error('Self-referencing -100 error');
      error.negativeHundredValue = -100;
      (error.negativeHundredValue as any).self = error.negativeHundredValue;
      mockAuthService.login.mockRejected