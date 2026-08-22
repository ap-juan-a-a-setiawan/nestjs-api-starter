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
    jest.clearAllMocks();

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
      const partialUser = { email: 'test@example.com' } as LoginDto;
      mockAuthService.login.mockResolvedValue({ error: 'Invalid credentials' });

      const result = await controller.login(partialUser);

      expect(authService.login).toHaveBeenCalledWith(partialUser);
      expect(result).toEqual({ error: 'Invalid credentials' });
    });

    it('should propagate errors from authService', async () => {
      const error = new Error('Authentication failed');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Authentication failed');
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

    it('should handle authService returning a promise that resolves to a complex object', async () => {
      const complexResponse = {
        access_token: 'token',
        user: {
          id: 1,
          email: 'test@example.com',
          roles: ['admin', 'user'],
          permissions: ['read', 'write'],
        },
        expiresIn: 3600,
      };
      mockAuthService.login.mockResolvedValue(complexResponse);

      const result = await controller.login(mockUser);

      expect(result).toEqual(complexResponse);
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('expiresIn');
    });

    it('should handle authService returning a promise that resolves to an array', async () => {
      const arrayResponse = [{ id: 1 }, { id: 2 }];
      mockAuthService.login.mockResolvedValue(arrayResponse as any);

      const result = await controller.login(mockUser);

      expect(result).toEqual(arrayResponse);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle authService returning a promise that resolves to a string', async () => {
      const stringResponse = 'login successful';
      mockAuthService.login.mockResolvedValue(stringResponse as any);

      const result = await controller.login(mockUser);

      expect(result).toBe(stringResponse);
    });

    it('should handle authService returning a promise that resolves to a number', async () => {
      const numberResponse = 200;
      mockAuthService.login.mockResolvedValue(numberResponse as any);

      const result = await controller.login(mockUser);

      expect(result).toBe(numberResponse);
    });

    it('should handle authService returning a promise that resolves to a boolean', async () => {
      const booleanResponse = true;
      mockAuthService.login.mockResolvedValue(booleanResponse as any);

      const result = await controller.login(mockUser);

      expect(result).toBe(booleanResponse);
    });

    it('should handle authService throwing a generic error', async () => {
      const error = new Error('Internal server error');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Internal server error');
    });

    it('should handle authService throwing an HttpException', async () => {
      const error = new Error('Unauthorized');
      error.name = 'HttpException';
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Unauthorized');
    });

    it('should handle authService throwing a string error', async () => {
      const error = 'Authentication failed';
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toBe(error);
    });

    it('should handle authService throwing an object error', async () => {
      const error = { message: 'Authentication failed', statusCode: 401 };
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toEqual(error);
    });

    it('should handle authService returning a promise that never resolves', async () => {
      mockAuthService.login.mockReturnValue(new Promise(() => {}));

      const promise = controller.login(mockUser);
      
      // Test that the promise is pending
      let resolved = false;
      promise.then(() => { resolved = true; });
      
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(resolved).toBe(false);
    });

    it('should handle multiple consecutive calls', async () => {
      mockAuthService.login
        .mockResolvedValueOnce(mockLoginResponse)
        .mockResolvedValueOnce({ access_token: 'second-token' });

      const firstResult = await controller.login(mockUser);
      const secondResult = await controller.login(mockUser);

      expect(firstResult).toEqual(mockLoginResponse);
      expect(secondResult).toEqual({ access_token: 'second-token' });
      expect(authService.login).toHaveBeenCalledTimes(2);
    });

    it('should handle concurrent calls', async () => {
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const [result1, result2] = await Promise.all([
        controller.login(mockUser),
        controller.login(mockUser),
      ]);

      expect(result1).toEqual(mockLoginResponse);
      expect(result2).toEqual(mockLoginResponse);
      expect(authService.login).toHaveBeenCalledTimes(2);
    });

    it('should handle user object with additional properties', async () => {
      const userWithExtraProps = {
        ...mockUser,
        rememberMe: true,
        deviceId: 'device-123',
      } as LoginDto;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithExtraProps);

      expect(authService.login).toHaveBeenCalledWith(userWithExtraProps);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with special characters in email', async () => {
      const specialUser = {
        email: 'user+test@example.com',
        password: 'pass@word123',
      } as LoginDto;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(specialUser);

      expect(authService.login).toHaveBeenCalledWith(specialUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle very long password', async () => {
      const longPasswordUser = {
        email: 'test@example.com',
        password: 'x'.repeat(1000),
      } as LoginDto;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(longPasswordUser);

      expect(authService.login).toHaveBeenCalledWith(longPasswordUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle empty string fields', async () => {
      const emptyFieldsUser = {
        email: '',
        password: '',
      } as LoginDto;
      mockAuthService.login.mockResolvedValue({ error: 'Invalid input' });

      const result = await controller.login(emptyFieldsUser);

      expect(authService.login).toHaveBeenCalledWith(emptyFieldsUser);
      expect(result).toEqual({ error: 'Invalid input' });
    });

    it('should handle whitespace-only fields', async () => {
      const whitespaceUser = {
        email: '   ',
        password: '   ',
      } as LoginDto;
      mockAuthService.login.mockResolvedValue({ error: 'Invalid input' });

      const result = await controller.login(whitespaceUser);

      expect(authService.login).toHaveBeenCalledWith(whitespaceUser);
      expect(result).toEqual({ error: 'Invalid input' });
    });

    it('should handle user object with null fields', async () => {
      const nullFieldsUser = {
        email: null,
        password: null,
      } as any;
      mockAuthService.login.mockResolvedValue({ error: 'Invalid input' });

      const result = await controller.login(nullFieldsUser);

      expect(authService.login).toHaveBeenCalledWith(nullFieldsUser);
      expect(result).toEqual({ error: 'Invalid input' });
    });

    it('should handle user object with undefined fields', async () => {
      const undefinedFieldsUser = {
        email: undefined,
        password: undefined,
      } as any;
      mockAuthService.login.mockResolvedValue({ error: 'Invalid input' });

      const result = await controller.login(undefinedFieldsUser);

      expect(authService.login).toHaveBeenCalledWith(undefinedFieldsUser);
      expect(result).toEqual({ error: 'Invalid input' });
    });

    it('should handle user object with numeric fields', async () => {
      const numericFieldsUser = {
        email: 12345,
        password: 67890,
      } as any;
      mockAuthService.login.mockResolvedValue({ error: 'Invalid input' });

      const result = await controller.login(numericFieldsUser);

      expect(authService.login).toHaveBeenCalledWith(numericFieldsUser);
      expect(result).toEqual({ error: 'Invalid input' });
    });

    it('should handle user object with boolean fields', async () => {
      const booleanFieldsUser = {
        email: true,
        password: false,
      } as any;
      mockAuthService.login.mockResolvedValue({ error: 'Invalid input' });

      const result = await controller.login(booleanFieldsUser);

      expect(authService.login).toHaveBeenCalledWith(booleanFieldsUser);
      expect(result).toEqual({ error: 'Invalid input' });
    });

    it('should handle user object with array fields', async () => {
      const arrayFieldsUser = {
        email: ['test@example.com'],
        password: ['password123'],
      } as any;
      mockAuthService.login.mockResolvedValue({ error: 'Invalid input' });

      const result = await controller.login(arrayFieldsUser);

      expect(authService.login).toHaveBeenCalledWith(arrayFieldsUser);
      expect(result).toEqual({ error: 'Invalid input' });
    });

    it('should handle user object with object fields', async () => {
      const objectFieldsUser = {
        email: { value: 'test@example.com' },
        password: { value: 'password123' },
      } as any;
      mockAuthService.login.mockResolvedValue({ error: 'Invalid input' });

      const result = await controller.login(objectFieldsUser);

      expect(authService.login).toHaveBeenCalledWith(objectFieldsUser);
      expect(result).toEqual({ error: 'Invalid input' });
    });

    it('should handle user object with symbol fields', async () => {
      const symbolFieldsUser = {
        email: Symbol('email'),
        password: Symbol('password'),
      } as any;
      mockAuthService.login.mockResolvedValue({ error: 'Invalid input' });

      const result = await controller.login(symbolFieldsUser);

      expect(authService.login).toHaveBeenCalledWith(symbolFieldsUser);
      expect(result).toEqual({ error: 'Invalid input' });
    });

    it('should handle user object with function fields', async () => {
      const functionFieldsUser = {
        email: () => 'test@example.com',
        password: () => 'password123',
      } as any;
      mockAuthService.login.mockResolvedValue({ error: 'Invalid input' });

      const result = await controller.login(functionFieldsUser);

      expect(authService.login).toHaveBeenCalledWith(functionFieldsUser);
      expect(result).toEqual({ error: 'Invalid input' });
    });

    it('should handle user object with Date fields', async () => {
      const dateFieldsUser = {
        email: new Date(),
        password: new Date(),
      } as any;
      mockAuthService.login.mockResolvedValue({ error: 'Invalid input' });

      const result = await controller.login(dateFieldsUser);

      expect(authService.login).toHaveBeenCalledWith(dateFieldsUser);
      expect(result).toEqual({ error: 'Invalid input' });
    });

    it('should handle user object with RegExp fields', async () => {
      const regexpFieldsUser = {
        email: /test@example\.com/,
        password: /password123/,
      } as any;
      mockAuthService.login.mockResolvedValue({ error: 'Invalid input' });

      const result = await controller.login(regexpFieldsUser);

      expect(authService.login).toHaveBeenCalledWith(regexpFieldsUser);
      expect(result).toEqual({ error: 'Invalid input' });
    });

    it('should handle user object with BigInt fields', async () => {
      const bigintFieldsUser = {
        email: BigInt(123),
        password: BigInt(456),
      } as any;
      mockAuthService.login.mockResolvedValue({ error: 'Invalid input' });

      const result = await controller.login(bigintFieldsUser);

      expect(authService.login).toHaveBeenCalledWith(bigintFieldsUser);
      expect(result).toEqual({ error: 'Invalid input' });
    });

    it('should handle user object with mixed type fields', async () => {
      const mixedFieldsUser = {
        email: 'test@example.com',
        password: 12345,
      } as any;
      mockAuthService.login.mockResolvedValue({ error: 'Invalid input' });

      const result = await controller.login(mixedFieldsUser);

      expect(authService.login).toHaveBeenCalledWith(mixedFieldsUser);
      expect(result).toEqual({ error: 'Invalid input' });
    });

    it('should handle user object with getter properties', async () => {
      const getterUser = {
        get email() { return 'test@example.com'; },
        get password() { return 'password123'; },
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(getterUser);

      expect(authService.login).toHaveBeenCalledWith(getterUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with setter properties', async () => {
      const setterUser = {
        _email: 'test@example.com',
        _password: 'password123',
        set email(value) { this._email = value; },
        set password(value) { this._password = value; },
        get email() { return this._email; },
        get password() { return this._password; },
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(setterUser);

      expect(authService.login).toHaveBeenCalledWith(setterUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with inherited properties', async () => {
      class BaseUser {
        email = 'test@example.com';
        password = 'password123';
      }
      class ExtendedUser extends BaseUser {
        extraField = 'extra';
      }
      const inheritedUser = new ExtendedUser() as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(inheritedUser);

      expect(authService.login).toHaveBeenCalledWith(inheritedUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with frozen properties', async () => {
      const frozenUser = Object.freeze({
        email: 'test@example.com',
        password: 'password123',
      }) as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(frozenUser);

      expect(authService.login).toHaveBeenCalledWith(frozenUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with sealed properties', async () => {
      const sealedUser = Object.seal({
        email: 'test@example.com',
        password: 'password123',
      }) as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(sealedUser);

      expect(authService.login).toHaveBeenCalledWith(sealedUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with non-extensible properties', async () => {
      const nonExtensibleUser = Object.preventExtensions({
        email: 'test@example.com',
        password: 'password123',
      }) as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(nonExtensibleUser);

      expect(authService.login).toHaveBeenCalledWith(nonExtensibleUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with circular references', async () => {
      const circularUser: any = {
        email: 'test@example.com',
        password: 'password123',
      };
      circularUser.self = circularUser;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(circularUser);

      expect(authService.login).toHaveBeenCalledWith(circularUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with prototype chain', async () => {
      const proto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const userWithProto = Object.create(proto);
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithProto);

      expect(authService.login).toHaveBeenCalledWith(userWithProto);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Symbol properties', async () => {
      const symbolKey = Symbol('email');
      const userWithSymbol = {
        [symbolKey]: 'test@example.com',
        password: 'password123',
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithSymbol);

      expect(authService.login).toHaveBeenCalledWith(userWithSymbol);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with non-enumerable properties', async () => {
      const userWithNonEnumerable = {
        email: 'test@example.com',
        password: 'password123',
      };
      Object.defineProperty(userWithNonEnumerable, 'hidden', {
        value: 'hidden-value',
        enumerable: false,
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithNonEnumerable);

      expect(authService.login).toHaveBeenCalledWith(userWithNonEnumerable);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with getter that throws', async () => {
      const throwingGetterUser = {
        get email() { throw new Error('Getter error'); },
        password: 'password123',
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(throwingGetterUser);

      expect(authService.login).toHaveBeenCalledWith(throwingGetterUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with setter that throws', async () => {
      const throwingSetterUser = {
        _email: 'test@example.com',
        password: 'password123',
        set email(value) { throw new Error('Setter error'); },
        get email() { return this._email; },
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(throwingSetterUser);

      expect(authService.login).toHaveBeenCalledWith(throwingSetterUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy', async () => {
      const target = {
        email: 'test@example.com',
        password: 'password123',
      };
      const proxyUser = new Proxy(target, {
        get(obj, prop) {
          return obj[prop];
        },
      }) as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(proxyUser);

      expect(authService.login).toHaveBeenCalledWith(proxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with WeakMap/WeakSet', async () => {
      const weakMapUser = {
        email: 'test@example.com',
        password: 'password123',
        weakMap: new WeakMap(),
        weakSet: new WeakSet(),
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(weakMapUser);

      expect(authService.login).toHaveBeenCalledWith(weakMapUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Map/Set', async () => {
      const mapSetUser = {
        email: 'test@example.com',
        password: 'password123',
        map: new Map(),
        set: new Set(),
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(mapSetUser);

      expect(authService.login).toHaveBeenCalledWith(mapSetUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with typed arrays', async () => {
      const typedArrayUser = {
        email: 'test@example.com',
        password: 'password123',
        uint8Array: new Uint8Array([1, 2, 3]),
        float64Array: new Float64Array([1.5, 2.5]),
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(typedArrayUser);

      expect(authService.login).toHaveBeenCalledWith(typedArrayUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with ArrayBuffer', async () => {
      const arrayBufferUser = {
        email: 'test@example.com',
        password: 'password123',
        buffer: new ArrayBuffer(8),
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(arrayBufferUser);

      expect(authService.login).toHaveBeenCalledWith(arrayBufferUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with DataView', async () => {
      const dataViewUser = {
        email: 'test@example.com',
        password: 'password123',
        dataView: new DataView(new ArrayBuffer(8)),
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(dataViewUser);

      expect(authService.login).toHaveBeenCalledWith(dataViewUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Error objects', async () => {
      const errorUser = {
        email: new Error('email error'),
        password: new Error('password error'),
      } as any;
      mockAuthService.login.mockResolvedValue({ error: 'Invalid input' });

      const result = await controller.login(errorUser);

      expect(authService.login).toHaveBeenCalledWith(errorUser);
      expect(result).toEqual({ error: 'Invalid input' });
    });

    it('should handle user object with Promise fields', async () => {
      const promiseUser = {
        email: Promise.resolve('test@example.com'),
        password: Promise.resolve('password123'),
      } as any;
      mockAuthService.login.mockResolvedValue({ error: 'Invalid input' });

      const result = await controller.login(promiseUser);

      expect(authService.login).toHaveBeenCalledWith(promiseUser);
      expect(result).toEqual({ error: 'Invalid input' });
    });

    it('should handle user object with async function fields', async () => {
      const asyncFunctionUser = {
        email: async () => 'test@example.com',
        password: async () => 'password123',
      } as any;
      mockAuthService.login.mockResolvedValue({ error: 'Invalid input' });

      const result = await controller.login(asyncFunctionUser);

      expect(authService.login).toHaveBeenCalledWith(asyncFunctionUser);
      expect(result).toEqual({ error: 'Invalid input' });
    });

    it('should handle user object with generator function fields', async () => {
      const generatorUser = {
        email: function* () { yield 'test@example.com'; },
        password: function* () { yield 'password123'; },
      } as any;
      mockAuthService.login.mockResolvedValue({ error: 'Invalid input' });

      const result = await controller.login(generatorUser);

      expect(authService.login).toHaveBeenCalledWith(generatorUser);
      expect(result).toEqual({ error: 'Invalid input' });
    });

    it('should handle user object with async generator function fields', async () => {
      const asyncGeneratorUser = {
        email: async function* () { yield 'test@example.com'; },
        password: async function* () { yield 'password123'; },
      } as any;
      mockAuthService.login.mockResolvedValue({ error: 'Invalid input' });

      const result = await controller.login(asyncGeneratorUser);

      expect(authService.login).toHaveBeenCalledWith(asyncGeneratorUser);
      expect(result).toEqual({ error: 'Invalid input' });
    });

    it('should handle user object with class instances as fields', async () => {
      class EmailClass {
        value = 'test@example.com';
      }
      class PasswordClass {
        value = 'password123';
      }
      const classInstanceUser = {
        email: new EmailClass(),
        password: new PasswordClass(),
      } as any;
      mockAuthService.login.mockResolvedValue({ error: 'Invalid input' });

      const result = await controller.login(classInstanceUser);

      expect(authService.login).toHaveBeenCalledWith(classInstanceUser);
      expect(result).toEqual({ error: 'Invalid input' });
    });

    it('should handle user object with null prototype', async () => {
      const nullProtoUser = Object.create(null);
      nullProtoUser.email = 'test@example.com';
      nullProtoUser.password = 'password123';
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(nullProtoUser);

      expect(authService.login).toHaveBeenCalledWith(nullProtoUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Symbol.toStringTag', async () => {
      const symbolTagUser = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.toStringTag]: 'CustomUser',
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(symbolTagUser);

      expect(authService.login).toHaveBeenCalledWith(symbolTagUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Symbol.iterator', async () => {
      const iterableUser = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.iterator]: function* () {
          yield this.email;
          yield this.password;
        },
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(iterableUser);

      expect(authService.login).toHaveBeenCalledWith(iterableUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Symbol.asyncIterator', async () => {
      const asyncIterableUser = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.asyncIterator]: async function* () {
          yield this.email;
          yield this.password;
        },
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(asyncIterableUser);

      expect(authService.login).toHaveBeenCalledWith(asyncIterableUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Symbol.hasInstance', async () => {
      const hasInstanceUser = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.hasInstance]: function() { return true; },
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(hasInstanceUser);

      expect(authService.login).toHaveBeenCalledWith(hasInstanceUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Symbol.isConcatSpreadable', async () => {
      const concatSpreadableUser = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.isConcatSpreadable]: true,
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(concatSpreadableUser);

      expect(authService.login).toHaveBeenCalledWith(concatSpreadableUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Symbol.species', async () => {
      const speciesUser = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.species]: Array,
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(speciesUser);

      expect(authService.login).toHaveBeenCalledWith(speciesUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Symbol.match', async () => {
      const matchUser = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.match]: function() { return true; },
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(matchUser);

      expect(authService.login).toHaveBeenCalledWith(matchUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Symbol.replace', async () => {
      const replaceUser = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.replace]: function() { return 'replaced'; },
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(replaceUser);

      expect(authService.login).toHaveBeenCalledWith(replaceUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Symbol.search', async () => {
      const searchUser = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.search]: function() { return 0; },
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(searchUser);

      expect(authService.login).toHaveBeenCalledWith(searchUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Symbol.split', async () => {
      const splitUser = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.split]: function() { return ['test', 'example']; },
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(splitUser);

      expect(authService.login).toHaveBeenCalledWith(splitUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Symbol.toPrimitive', async () => {
      const toPrimitiveUser = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.toPrimitive]: function() { return 'primitive'; },
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(toPrimitiveUser);

      expect(authService.login).toHaveBeenCalledWith(toPrimitiveUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Symbol.unscopables', async () => {
      const unscopablesUser = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.unscopables]: { email: true },
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(unscopablesUser);

      expect(authService.login).toHaveBeenCalledWith(unscopablesUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Symbol.asyncDispose', async () => {
      const asyncDisposeUser = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.asyncDispose]: async function() {},
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(asyncDisposeUser);

      expect(authService.login).toHaveBeenCalledWith(asyncDisposeUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Symbol.dispose', async () => {
      const disposeUser = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.dispose]: function() {},
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(disposeUser);

      expect(authService.login).toHaveBeenCalledWith(disposeUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Symbol.metadata', async () => {
      const metadataUser = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.metadata]: { version: '1.0' },
      } as any;
      mock