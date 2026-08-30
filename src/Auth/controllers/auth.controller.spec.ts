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

    it('should handle login with different user data', async () => {
      const anotherUser: LoginDto = {
        email: 'another@example.com',
        password: 'different-password',
      };
      const anotherResponse = {
        accessToken: 'another-token',
        user: {
          id: 2,
          email: 'another@example.com',
          name: 'Another User',
        },
      };

      mockAuthService.login.mockResolvedValue(anotherResponse);

      const result = await controller.login(anotherUser);

      expect(authService.login).toHaveBeenCalledWith(anotherUser);
      expect(result).toEqual(anotherResponse);
    });

    it('should propagate errors from authService', async () => {
      const error = new Error('Invalid credentials');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Invalid credentials');
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should handle empty user object', async () => {
      const emptyUser = {} as LoginDto;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(emptyUser);

      expect(authService.login).toHaveBeenCalledWith(emptyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with missing fields', async () => {
      const incompleteUser = {
        email: 'test@example.com',
      } as LoginDto;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(incompleteUser);

      expect(authService.login).toHaveBeenCalledWith(incompleteUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle null user', async () => {
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(null as any);

      expect(authService.login).toHaveBeenCalledWith(null);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle undefined user', async () => {
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(undefined as any);

      expect(authService.login).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockLoginResponse);
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

    it('should handle authService throwing non-Error exceptions', async () => {
      const error = 'String error';
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toBe('String error');
    });

    it('should handle authService throwing Error with custom message', async () => {
      const error = new Error('Custom error message');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Custom error message');
    });

    it('should handle authService throwing Error with status code', async () => {
      const error = new Error('Unauthorized');
      (error as any).status = 401;
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Unauthorized');
      await expect(controller.login(mockUser)).rejects.toHaveProperty('status', 401);
    });

    it('should handle multiple sequential calls', async () => {
      mockAuthService.login
        .mockResolvedValueOnce(mockLoginResponse)
        .mockResolvedValueOnce({ ...mockLoginResponse, accessToken: 'second-token' });

      const firstResult = await controller.login(mockUser);
      const secondResult = await controller.login(mockUser);

      expect(authService.login).toHaveBeenCalledTimes(2);
      expect(firstResult).toEqual(mockLoginResponse);
      expect(secondResult).toEqual({ ...mockLoginResponse, accessToken: 'second-token' });
    });

    it('should handle concurrent calls', async () => {
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const results = await Promise.all([
        controller.login(mockUser),
        controller.login(mockUser),
        controller.login(mockUser),
      ]);

      expect(authService.login).toHaveBeenCalledTimes(3);
      results.forEach((result) => {
        expect(result).toEqual(mockLoginResponse);
      });
    });

    it('should handle user with additional properties', async () => {
      const userWithExtraProps = {
        ...mockUser,
        extraField: 'extra-value',
        role: 'admin',
      } as LoginDto;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithExtraProps);

      expect(authService.login).toHaveBeenCalledWith(userWithExtraProps);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with special characters in email', async () => {
      const specialUser = {
        email: 'user+tag@example.com',
        password: 'pass@123',
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
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(emptyFieldsUser);

      expect(authService.login).toHaveBeenCalledWith(emptyFieldsUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle whitespace-only fields', async () => {
      const whitespaceUser = {
        email: '   ',
        password: '   ',
      } as LoginDto;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(whitespaceUser);

      expect(authService.login).toHaveBeenCalledWith(whitespaceUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with numeric values', async () => {
      const numericUser = {
        email: 12345,
        password: 67890,
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(numericUser);

      expect(authService.login).toHaveBeenCalledWith(numericUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with boolean values', async () => {
      const booleanUser = {
        email: true,
        password: false,
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(booleanUser);

      expect(authService.login).toHaveBeenCalledWith(booleanUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with array values', async () => {
      const arrayUser = {
        email: ['test@example.com'],
        password: ['password123'],
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(arrayUser);

      expect(authService.login).toHaveBeenCalledWith(arrayUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with object values', async () => {
      const objectUser = {
        email: { value: 'test@example.com' },
        password: { value: 'password123' },
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(objectUser);

      expect(authService.login).toHaveBeenCalledWith(objectUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with symbol values', async () => {
      const symbolUser = {
        email: Symbol('email'),
        password: Symbol('password'),
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(symbolUser);

      expect(authService.login).toHaveBeenCalledWith(symbolUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with function values', async () => {
      const functionUser = {
        email: () => 'test@example.com',
        password: () => 'password123',
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(functionUser);

      expect(authService.login).toHaveBeenCalledWith(functionUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with Date values', async () => {
      const dateUser = {
        email: new Date(),
        password: new Date(),
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(dateUser);

      expect(authService.login).toHaveBeenCalledWith(dateUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with Buffer values', async () => {
      const bufferUser = {
        email: Buffer.from('test@example.com'),
        password: Buffer.from('password123'),
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(bufferUser);

      expect(authService.login).toHaveBeenCalledWith(bufferUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with BigInt values', async () => {
      const bigIntUser = {
        email: BigInt(1234567890),
        password: BigInt(9876543210),
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(bigIntUser);

      expect(authService.login).toHaveBeenCalledWith(bigIntUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with mixed type values', async () => {
      const mixedUser = {
        email: 'test@example.com',
        password: 12345,
        extra: true,
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(mixedUser);

      expect(authService.login).toHaveBeenCalledWith(mixedUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle frozen user object', async () => {
      const frozenUser = Object.freeze({ ...mockUser });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(frozenUser);

      expect(authService.login).toHaveBeenCalledWith(frozenUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle sealed user object', async () => {
      const sealedUser = Object.seal({ ...mockUser });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(sealedUser);

      expect(authService.login).toHaveBeenCalledWith(sealedUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with getters', async () => {
      const userWithGetters = {
        get email() { return 'test@example.com'; },
        get password() { return 'password123'; },
      } as LoginDto;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithGetters);

      expect(authService.login).toHaveBeenCalledWith(userWithGetters);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with prototype chain', async () => {
      const userWithPrototype = Object.create({ inheritedProp: 'value' });
      userWithPrototype.email = 'test@example.com';
      userWithPrototype.password = 'password123';
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithPrototype);

      expect(authService.login).toHaveBeenCalledWith(userWithPrototype);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with circular reference', async () => {
      const circularUser: any = { ...mockUser };
      circularUser.self = circularUser;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(circularUser);

      expect(authService.login).toHaveBeenCalledWith(circularUser);
      expect(result).toEqual(mockLoginResponse);
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

    it('should handle user object with non-enumerable properties', async () => {
      const nonEnumerableUser: any = { ...mockUser };
      Object.defineProperty(nonEnumerableUser, 'hidden', {
        value: 'hidden-value',
        enumerable: false,
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(nonEnumerableUser);

      expect(authService.login).toHaveBeenCalledWith(nonEnumerableUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with symbol properties', async () => {
      const symbolPropUser: any = { ...mockUser };
      const symbol = Symbol('hidden');
      symbolPropUser[symbol] = 'symbol-value';
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(symbolPropUser);

      expect(authService.login).toHaveBeenCalledWith(symbolPropUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with getter that throws', async () => {
      const throwingGetterUser: any = {
        get email() { throw new Error('Getter error'); },
        password: 'password123',
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(throwingGetterUser);

      expect(authService.login).toHaveBeenCalledWith(throwingGetterUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with setter that throws', async () => {
      const throwingSetterUser: any = {
        set email(value) { throw new Error('Setter error'); },
        password: 'password123',
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(throwingSetterUser);

      expect(authService.login).toHaveBeenCalledWith(throwingSetterUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy', async () => {
      const proxyUser = new Proxy({ ...mockUser }, {
        get(target, prop) {
          return target[prop];
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(proxyUser);

      expect(authService.login).toHaveBeenCalledWith(proxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that throws', async () => {
      const throwingProxyUser = new Proxy({ ...mockUser }, {
        get(target, prop) {
          throw new Error('Proxy error');
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(throwingProxyUser);

      expect(authService.login).toHaveBeenCalledWith(throwingProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that returns undefined', async () => {
      const undefinedProxyUser = new Proxy({ ...mockUser }, {
        get(target, prop) {
          return undefined;
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(undefinedProxyUser);

      expect(authService.login).toHaveBeenCalledWith(undefinedProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that returns null', async () => {
      const nullProxyUser = new Proxy({ ...mockUser }, {
        get(target, prop) {
          return null;
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(nullProxyUser);

      expect(authService.login).toHaveBeenCalledWith(nullProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that returns different values', async () => {
      const dynamicProxyUser = new Proxy({ ...mockUser }, {
        get(target, prop) {
          if (prop === 'email') return 'dynamic@example.com';
          if (prop === 'password') return 'dynamic-password';
          return target[prop];
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(dynamicProxyUser);

      expect(authService.login).toHaveBeenCalledWith(dynamicProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has ownKeys trap', async () => {
      const ownKeysProxyUser = new Proxy({ ...mockUser }, {
        ownKeys() {
          return ['email', 'password'];
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(ownKeysProxyUser);

      expect(authService.login).toHaveBeenCalledWith(ownKeysProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has getOwnPropertyDescriptor trap', async () => {
      const getOwnPropertyDescriptorProxyUser = new Proxy({ ...mockUser }, {
        getOwnPropertyDescriptor(target, prop) {
          return {
            configurable: true,
            enumerable: true,
            value: target[prop],
            writable: true,
          };
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(getOwnPropertyDescriptorProxyUser);

      expect(authService.login).toHaveBeenCalledWith(getOwnPropertyDescriptorProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has has trap', async () => {
      const hasProxyUser = new Proxy({ ...mockUser }, {
        has(target, prop) {
          return prop in target;
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(hasProxyUser);

      expect(authService.login).toHaveBeenCalledWith(hasProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has set trap', async () => {
      const setProxyUser = new Proxy({ ...mockUser }, {
        set(target, prop, value) {
          target[prop] = value;
          return true;
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(setProxyUser);

      expect(authService.login).toHaveBeenCalledWith(setProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has deleteProperty trap', async () => {
      const deleteProxyUser = new Proxy({ ...mockUser }, {
        deleteProperty(target, prop) {
          delete target[prop];
          return true;
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(deleteProxyUser);

      expect(authService.login).toHaveBeenCalledWith(deleteProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has defineProperty trap', async () => {
      const defineProxyUser = new Proxy({ ...mockUser }, {
        defineProperty(target, prop, descriptor) {
          Object.defineProperty(target, prop, descriptor);
          return true;
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(defineProxyUser);

      expect(authService.login).toHaveBeenCalledWith(defineProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has getPrototypeOf trap', async () => {
      const getPrototypeOfProxyUser = new Proxy({ ...mockUser }, {
        getPrototypeOf() {
          return null;
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(getPrototypeOfProxyUser);

      expect(authService.login).toHaveBeenCalledWith(getPrototypeOfProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has setPrototypeOf trap', async () => {
      const setPrototypeOfProxyUser = new Proxy({ ...mockUser }, {
        setPrototypeOf() {
          return true;
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(setPrototypeOfProxyUser);

      expect(authService.login).toHaveBeenCalledWith(setPrototypeOfProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has isExtensible trap', async () => {
      const isExtensibleProxyUser = new Proxy({ ...mockUser }, {
        isExtensible() {
          return true;
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(isExtensibleProxyUser);

      expect(authService.login).toHaveBeenCalledWith(isExtensibleProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has preventExtensions trap', async () => {
      const preventExtensionsProxyUser = new Proxy({ ...mockUser }, {
        preventExtensions() {
          return true;
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(preventExtensionsProxyUser);

      expect(authService.login).toHaveBeenCalledWith(preventExtensionsProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has getOwnPropertyNames trap', async () => {
      const getOwnPropertyNamesProxyUser = new Proxy({ ...mockUser }, {
        getOwnPropertyNames() {
          return ['email', 'password'];
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(getOwnPropertyNamesProxyUser);

      expect(authService.login).toHaveBeenCalledWith(getOwnPropertyNamesProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has getOwnPropertySymbols trap', async () => {
      const getOwnPropertySymbolsProxyUser = new Proxy({ ...mockUser }, {
        getOwnPropertySymbols() {
          return [];
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(getOwnPropertySymbolsProxyUser);

      expect(authService.login).toHaveBeenCalledWith(getOwnPropertySymbolsProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has enumerate trap', async () => {
      const enumerateProxyUser = new Proxy({ ...mockUser }, {
        enumerate() {
          return ['email', 'password'];
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(enumerateProxyUser);

      expect(authService.login).toHaveBeenCalledWith(enumerateProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has apply trap', async () => {
      const applyProxyUser = new Proxy({ ...mockUser }, {
        apply() {
          return mockLoginResponse;
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(applyProxyUser);

      expect(authService.login).toHaveBeenCalledWith(applyProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has construct trap', async () => {
      const constructProxyUser = new Proxy({ ...mockUser }, {
        construct() {
          return mockLoginResponse;
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(constructProxyUser);

      expect(authService.login).toHaveBeenCalledWith(constructProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has get trap returning Promise', async () => {
      const promiseProxyUser = new Proxy({ ...mockUser }, {
        get(target, prop) {
          return Promise.resolve(target[prop]);
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(promiseProxyUser);

      expect(authService.login).toHaveBeenCalledWith(promiseProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has get trap returning async function', async () => {
      const asyncProxyUser = new Proxy({ ...mockUser }, {
        get(target, prop) {
          return async () => target[prop];
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(asyncProxyUser);

      expect(authService.login).toHaveBeenCalledWith(asyncProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has get trap returning generator', async () => {
      const generatorProxyUser = new Proxy({ ...mockUser }, {
        get(target, prop) {
          return function* () { yield target[prop]; };
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(generatorProxyUser);

      expect(authService.login).toHaveBeenCalledWith(generatorProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has get trap returning iterator', async () => {
      const iteratorProxyUser = new Proxy({ ...mockUser }, {
        get(target, prop) {
          return {
            [Symbol.iterator]: function* () { yield target[prop]; }
          };
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(iteratorProxyUser);

      expect(authService.login).toHaveBeenCalledWith(iteratorProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has get trap returning async iterator', async () => {
      const asyncIteratorProxyUser = new Proxy({ ...mockUser }, {
        get(target, prop) {
          return {
            [Symbol.asyncIterator]: async function* () { yield target[prop]; }
          };
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(asyncIteratorProxyUser);

      expect(authService.login).toHaveBeenCalledWith(asyncIteratorProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has get trap returning thenable', async () => {
      const thenableProxyUser = new Proxy({ ...mockUser }, {
        get(target, prop) {
          return {
            then(resolve) { resolve(target[prop]); }
          };
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(thenableProxyUser);

      expect(authService.login).toHaveBeenCalledWith(thenableProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has get trap returning class', async () => {
      const classProxyUser = new Proxy({ ...mockUser }, {
        get(target, prop) {
          return class { value = target[prop]; };
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(classProxyUser);

      expect(authService.login).toHaveBeenCalledWith(classProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has get trap returning Map', async () => {
      const mapProxyUser = new Proxy({ ...mockUser }, {
        get(target, prop) {
          return new Map([[prop, target[prop]]]);
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(mapProxyUser);

      expect(authService.login).toHaveBeenCalledWith(mapProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has get trap returning Set', async () => {
      const setProxyUser = new Proxy({ ...mockUser }, {
        get(target, prop) {
          return new Set([target[prop]]);
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(setProxyUser);

      expect(authService.login).toHaveBeenCalledWith(setProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has get trap returning WeakMap', async () => {
      const weakMapProxyUser = new Proxy({ ...mockUser }, {
        get(target, prop) {
          return new WeakMap([[{}, target[prop]]]);
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(weakMapProxyUser);

      expect(authService.login).toHaveBeenCalledWith(weakMapProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has get trap returning WeakSet', async () => {
      const weakSetProxyUser = new Proxy({ ...mockUser }, {
        get(target, prop) {
          return new WeakSet([target[prop]]);
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(weakSetProxyUser);

      expect(authService.login).toHaveBeenCalledWith(weakSetProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has get trap returning ArrayBuffer', async () => {
      const arrayBufferProxyUser = new Proxy({ ...mockUser }, {
        get(target, prop) {
          return new ArrayBuffer(8);
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(arrayBufferProxyUser);

      expect(authService.login).toHaveBeenCalledWith(arrayBufferProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has get trap returning DataView', async () => {
      const dataViewProxyUser = new Proxy({ ...mockUser }, {
        get(target, prop) {
          return new DataView(new ArrayBuffer(8));
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(dataViewProxyUser);

      expect(authService.login).toHaveBeenCalledWith(dataViewProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has get trap returning TypedArray', async () => {
      const typedArrayProxyUser = new Proxy({ ...mockUser }, {
        get(target, prop) {
          return new Uint8Array(8);
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(typedArrayProxyUser);

      expect(authService.login).toHaveBeenCalledWith(typedArrayProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has get trap returning RegExp', async () => {
      const regexProxyUser = new Proxy({ ...mockUser }, {
        get(target, prop) {
          return new RegExp(target[prop]);
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(regexProxyUser);

      expect(authService.login).toHaveBeenCalledWith(regexProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has get trap returning Date', async () => {
      const dateProxyUser = new Proxy({ ...mockUser }, {
        get(target, prop) {
          return new Date();
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(dateProxyUser);

      expect(authService.login).toHaveBeenCalledWith(dateProxyUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user object with Proxy that has get trap returning Error', async () => {
      const errorProxyUser = new Proxy({ ...mockUser }, {
        get(target, prop) {
          return new Error(target[prop]);
        },
      });
      mockAuthService.login.mockResolvedValue(mock