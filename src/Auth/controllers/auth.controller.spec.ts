import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { LoginDto } from '../dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockLocalAuthGuard = {
    canActivate: jest.fn(() => true),
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
          useValue: mockLocalAuthGuard,
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
    const mockUser: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockLoginResponse = {
      accessToken: 'mock-jwt-token',
      user: {
        id: 1,
        email: 'test@example.com',
      },
    };

    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should call authService.login with the user object', async () => {
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(mockUser);

      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should return the result from authService.login', async () => {
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(mockUser);

      expect(result).toBe(mockLoginResponse);
    });

    it('should handle empty user object', async () => {
      const emptyUser = {} as LoginDto;
      mockAuthService.login.mockResolvedValue({});

      const result = await controller.login(emptyUser);

      expect(authService.login).toHaveBeenCalledWith(emptyUser);
      expect(result).toEqual({});
    });

    it('should handle null user', async () => {
      mockAuthService.login.mockResolvedValue(null);

      const result = await controller.login(null as any);

      expect(authService.login).toHaveBeenCalledWith(null);
      expect(result).toBeNull();
    });

    it('should propagate errors from authService.login', async () => {
      const error = new Error('Invalid credentials');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockUser)).rejects.toThrow('Invalid credentials');
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should handle undefined user', async () => {
      mockAuthService.login.mockResolvedValue(undefined);

      const result = await controller.login(undefined as any);

      expect(authService.login).toHaveBeenCalledWith(undefined);
      expect(result).toBeUndefined();
    });

    it('should handle user with additional properties', async () => {
      const userWithExtraProps = {
        ...mockUser,
        role: 'admin',
        createdAt: new Date(),
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithExtraProps);

      expect(authService.login).toHaveBeenCalledWith(userWithExtraProps);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with missing optional fields', async () => {
      const userWithoutPassword = {
        email: 'test@example.com',
      } as LoginDto;

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithoutPassword);

      expect(authService.login).toHaveBeenCalledWith(userWithoutPassword);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with empty string fields', async () => {
      const userWithEmptyStrings = {
        email: '',
        password: '',
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithEmptyStrings);

      expect(authService.login).toHaveBeenCalledWith(userWithEmptyStrings);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with special characters in fields', async () => {
      const userWithSpecialChars = {
        email: 'test+special@example.com',
        password: 'p@ssw0rd!$#',
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithSpecialChars);

      expect(authService.login).toHaveBeenCalledWith(userWithSpecialChars);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with long strings', async () => {
      const userWithLongStrings = {
        email: 'a'.repeat(255) + '@example.com',
        password: 'b'.repeat(1000),
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithLongStrings);

      expect(authService.login).toHaveBeenCalledWith(userWithLongStrings);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with unicode characters', async () => {
      const userWithUnicode = {
        email: 'tést@example.com',
        password: 'pässwörd',
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithUnicode);

      expect(authService.login).toHaveBeenCalledWith(userWithUnicode);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with numeric values in fields', async () => {
      const userWithNumericValues = {
        email: '123@example.com',
        password: '123456',
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithNumericValues);

      expect(authService.login).toHaveBeenCalledWith(userWithNumericValues);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with boolean values in fields', async () => {
      const userWithBooleanValues = {
        email: 'true@example.com',
        password: 'false',
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithBooleanValues);

      expect(authService.login).toHaveBeenCalledWith(userWithBooleanValues);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with null values in fields', async () => {
      const userWithNullValues = {
        email: null,
        password: null,
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithNullValues);

      expect(authService.login).toHaveBeenCalledWith(userWithNullValues);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with undefined values in fields', async () => {
      const userWithUndefinedValues = {
        email: undefined,
        password: undefined,
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithUndefinedValues);

      expect(authService.login).toHaveBeenCalledWith(userWithUndefinedValues);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with nested objects', async () => {
      const userWithNestedObjects = {
        email: 'test@example.com',
        password: 'password123',
        metadata: {
          device: 'mobile',
          location: 'US',
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithNestedObjects);

      expect(authService.login).toHaveBeenCalledWith(userWithNestedObjects);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with arrays', async () => {
      const userWithArrays = {
        email: 'test@example.com',
        password: 'password123',
        roles: ['admin', 'user'],
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithArrays);

      expect(authService.login).toHaveBeenCalledWith(userWithArrays);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with Date objects', async () => {
      const userWithDates = {
        email: 'test@example.com',
        password: 'password123',
        lastLogin: new Date('2024-01-01'),
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithDates);

      expect(authService.login).toHaveBeenCalledWith(userWithDates);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with Buffer objects', async () => {
      const userWithBuffers = {
        email: 'test@example.com',
        password: 'password123',
        token: Buffer.from('mock-token'),
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithBuffers);

      expect(authService.login).toHaveBeenCalledWith(userWithBuffers);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with Symbol values', async () => {
      const symbolKey = Symbol('test');
      const userWithSymbols = {
        email: 'test@example.com',
        password: 'password123',
        [symbolKey]: 'symbol-value',
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithSymbols);

      expect(authService.login).toHaveBeenCalledWith(userWithSymbols);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with BigInt values', async () => {
      const userWithBigInt = {
        email: 'test@example.com',
        password: 'password123',
        id: BigInt(123456789),
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithBigInt);

      expect(authService.login).toHaveBeenCalledWith(userWithBigInt);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with function properties', async () => {
      const userWithFunctions = {
        email: 'test@example.com',
        password: 'password123',
        getFullName: () => 'Test User',
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithFunctions);

      expect(authService.login).toHaveBeenCalledWith(userWithFunctions);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with getter properties', async () => {
      const userWithGetters = {
        email: 'test@example.com',
        password: 'password123',
        get fullName() {
          return 'Test User';
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithGetters);

      expect(authService.login).toHaveBeenCalledWith(userWithGetters);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with setter properties', async () => {
      const userWithSetters = {
        email: 'test@example.com',
        password: 'password123',
        set fullName(value: string) {
          this._fullName = value;
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithSetters);

      expect(authService.login).toHaveBeenCalledWith(userWithSetters);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with prototype methods', async () => {
      class CustomUser extends LoginDto {
        getFullName(): string {
          return `${this.email} - ${this.password}`;
        }
      }

      const customUser = new CustomUser();
      customUser.email = 'test@example.com';
      customUser.password = 'password123';

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(customUser);

      expect(authService.login).toHaveBeenCalledWith(customUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with circular references', async () => {
      const userWithCircularRef: any = {
        email: 'test@example.com',
        password: 'password123',
      };
      userWithCircularRef.self = userWithCircularRef;

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithCircularRef);

      expect(authService.login).toHaveBeenCalledWith(userWithCircularRef);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with frozen objects', async () => {
      const userWithFrozen = Object.freeze({
        email: 'test@example.com',
        password: 'password123',
      });

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithFrozen);

      expect(authService.login).toHaveBeenCalledWith(userWithFrozen);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with sealed objects', async () => {
      const userWithSealed = Object.seal({
        email: 'test@example.com',
        password: 'password123',
      });

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithSealed);

      expect(authService.login).toHaveBeenCalledWith(userWithSealed);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with non-extensible objects', async () => {
      const userWithNonExtensible = Object.preventExtensions({
        email: 'test@example.com',
        password: 'password123',
      });

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithNonExtensible);

      expect(authService.login).toHaveBeenCalledWith(userWithNonExtensible);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with Proxy objects', async () => {
      const target = {
        email: 'test@example.com',
        password: 'password123',
      };

      const userWithProxy = new Proxy(target, {
        get: (obj, prop) => {
          if (prop === 'email') return 'proxied@example.com';
          return obj[prop];
        },
      });

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithProxy);

      expect(authService.login).toHaveBeenCalledWith(userWithProxy);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with WeakMap and WeakSet', async () => {
      const weakMap = new WeakMap();
      const weakSet = new WeakSet();
      const key = { id: 1 };
      weakMap.set(key, 'value');
      weakSet.add(key);

      const userWithWeakCollections = {
        email: 'test@example.com',
        password: 'password123',
        weakMap,
        weakSet,
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithWeakCollections);

      expect(authService.login).toHaveBeenCalledWith(userWithWeakCollections);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with Map and Set', async () => {
      const map = new Map([['key', 'value']]);
      const set = new Set(['value1', 'value2']);

      const userWithCollections = {
        email: 'test@example.com',
        password: 'password123',
        map,
        set,
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithCollections);

      expect(authService.login).toHaveBeenCalledWith(userWithCollections);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with RegExp objects', async () => {
      const userWithRegExp = {
        email: 'test@example.com',
        password: 'password123',
        pattern: /^[a-z]+$/i,
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithRegExp);

      expect(authService.login).toHaveBeenCalledWith(userWithRegExp);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with Error objects', async () => {
      const userWithError = {
        email: 'test@example.com',
        password: 'password123',
        error: new Error('test error'),
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithError);

      expect(authService.login).toHaveBeenCalledWith(userWithError);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with Promise objects', async () => {
      const userWithPromise = {
        email: 'test@example.com',
        password: 'password123',
        promise: Promise.resolve('resolved'),
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithPromise);

      expect(authService.login).toHaveBeenCalledWith(userWithPromise);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with async functions', async () => {
      const userWithAsyncFn = {
        email: 'test@example.com',
        password: 'password123',
        async getData() {
          return 'data';
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithAsyncFn);

      expect(authService.login).toHaveBeenCalledWith(userWithAsyncFn);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with generator functions', async () => {
      const userWithGenerator = {
        email: 'test@example.com',
        password: 'password123',
        *generate() {
          yield 1;
          yield 2;
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithGenerator);

      expect(authService.login).toHaveBeenCalledWith(userWithGenerator);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with class instances', async () => {
      class CustomClass {
        constructor(public email: string, public password: string) {}
      }

      const userWithClassInstance = new CustomClass('test@example.com', 'password123');

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithClassInstance);

      expect(authService.login).toHaveBeenCalledWith(userWithClassInstance);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with multiple nested levels', async () => {
      const userWithDeepNesting = {
        email: 'test@example.com',
        password: 'password123',
        profile: {
          personal: {
            name: {
              first: 'John',
              last: 'Doe',
            },
          },
          professional: {
            company: {
              name: 'Tech Corp',
              address: {
                street: '123 Main St',
                city: 'New York',
                country: 'USA',
              },
            },
          },
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithDeepNesting);

      expect(authService.login).toHaveBeenCalledWith(userWithDeepNesting);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with mixed data types', async () => {
      const userWithMixedTypes = {
        email: 'test@example.com',
        password: 'password123',
        age: 30,
        isActive: true,
        score: 95.5,
        tags: ['admin', 'user'],
        metadata: {
          lastLogin: new Date(),
          attempts: 3,
        },
        nullable: null,
        undefined: undefined,
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithMixedTypes);

      expect(authService.login).toHaveBeenCalledWith(userWithMixedTypes);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with inherited properties', async () => {
      class BaseUser {
        email: string = 'base@example.com';
        password: string = 'base-password';
      }

      class ExtendedUser extends BaseUser {
        role: string = 'admin';
      }

      const userWithInheritedProps = new ExtendedUser();
      userWithInheritedProps.email = 'test@example.com';
      userWithInheritedProps.password = 'password123';

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithInheritedProps);

      expect(authService.login).toHaveBeenCalledWith(userWithInheritedProps);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with non-enumerable properties', async () => {
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

    it('should handle user with symbol properties', async () => {
      const symbolProp = Symbol('symbolProp');
      const userWithSymbolProps = {
        email: 'test@example.com',
        password: 'password123',
        [symbolProp]: 'symbol-value',
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithSymbolProps);

      expect(authService.login).toHaveBeenCalledWith(userWithSymbolProps);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with getter and setter properties', async () => {
      const userWithGetSet = {
        _email: 'test@example.com',
        password: 'password123',
        get email() {
          return this._email;
        },
        set email(value: string) {
          this._email = value;
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithGetSet);

      expect(authService.login).toHaveBeenCalledWith(userWithGetSet);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with computed property names', async () => {
      const propName = 'email';
      const userWithComputedProps = {
        [propName]: 'test@example.com',
        password: 'password123',
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithComputedProps);

      expect(authService.login).toHaveBeenCalledWith(userWithComputedProps);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with spread operator', async () => {
      const baseUser = {
        email: 'test@example.com',
        password: 'password123',
      };

      const userWithSpread = {
        ...baseUser,
        role: 'admin',
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithSpread);

      expect(authService.login).toHaveBeenCalledWith(userWithSpread);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with Object.assign', async () => {
      const baseUser = {
        email: 'test@example.com',
        password: 'password123',
      };

      const userWithAssign = Object.assign({}, baseUser, { role: 'admin' });

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithAssign);

      expect(authService.login).toHaveBeenCalledWith(userWithAssign);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with Object.create', async () => {
      const prototype = {
        email: 'test@example.com',
        password: 'password123',
      };

      const userWithCreate = Object.create(prototype);
      userWithCreate.role = 'admin';

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithCreate);

      expect(authService.login).toHaveBeenCalledWith(userWithCreate);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with JSON serialization', async () => {
      const userWithJSON = {
        email: 'test@example.com',
        password: 'password123',
        toJSON() {
          return {
            email: this.email,
            password: this.password,
          };
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithJSON);

      expect(authService.login).toHaveBeenCalledWith(userWithJSON);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with toString method', async () => {
      const userWithToString = {
        email: 'test@example.com',
        password: 'password123',
        toString() {
          return `${this.email}:${this.password}`;
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithToString);

      expect(authService.login).toHaveBeenCalledWith(userWithToString);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with valueOf method', async () => {
      const userWithValueOf = {
        email: 'test@example.com',
        password: 'password123',
        valueOf() {
          return this.email;
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithValueOf);

      expect(authService.login).toHaveBeenCalledWith(userWithValueOf);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with Symbol.toPrimitive', async () => {
      const userWithToPrimitive = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.toPrimitive](hint: string) {
          if (hint === 'string') return this.email;
          if (hint === 'number') return 42;
          return null;
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithToPrimitive);

      expect(authService.login).toHaveBeenCalledWith(userWithToPrimitive);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with Symbol.iterator', async () => {
      const userWithIterator = {
        email: 'test@example.com',
        password: 'password123',
        *[Symbol.iterator]() {
          yield this.email;
          yield this.password;
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithIterator);

      expect(authService.login).toHaveBeenCalledWith(userWithIterator);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with Symbol.asyncIterator', async () => {
      const userWithAsyncIterator = {
        email: 'test@example.com',
        password: 'password123',
        async *[Symbol.asyncIterator]() {
          yield this.email;
          yield this.password;
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithAsyncIterator);

      expect(authService.login).toHaveBeenCalledWith(userWithAsyncIterator);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with Symbol.hasInstance', async () => {
      const userWithHasInstance = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.hasInstance](instance: any) {
          return instance instanceof Object;
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithHasInstance);

      expect(authService.login).toHaveBeenCalledWith(userWithHasInstance);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with Symbol.isConcatSpreadable', async () => {
      const userWithConcatSpreadable = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.isConcatSpreadable]: true,
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithConcatSpreadable);

      expect(authService.login).toHaveBeenCalledWith(userWithConcatSpreadable);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with Symbol.match', async () => {
      const userWithMatch = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.match](string: string) {
          return string.includes(this.email);
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithMatch);

      expect(authService.login).toHaveBeenCalledWith(userWithMatch);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with Symbol.replace', async () => {
      const userWithReplace = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.replace](string: string, replacement: string) {
          return string.replace(this.email, replacement);
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithReplace);

      expect(authService.login).toHaveBeenCalledWith(userWithReplace);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with Symbol.search', async () => {
      const userWithSearch = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.search](string: string) {
          return string.indexOf(this.email);
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithSearch);

      expect(authService.login).toHaveBeenCalledWith(userWithSearch);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with Symbol.split', async () => {
      const userWithSplit = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.split](string: string) {
          return string.split(this.email);
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithSplit);

      expect(authService.login).toHaveBeenCalledWith(userWithSplit);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with Symbol.species', async () => {
      const userWithSpecies = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.species]: Array,
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithSpecies);

      expect(authService.login).toHaveBeenCalledWith(userWithSpecies);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with Symbol.toPrimitive and Symbol.toStringTag', async () => {
      const userWithMultipleSymbols = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.toPrimitive](hint: string) {
          return hint === 'string' ? this.email : 42;
        },
        [Symbol.toStringTag]: 'CustomUser',
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithMultipleSymbols);

      expect(authService.login).toHaveBeenCalledWith(userWithMultipleSymbols);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with all possible symbol properties', async () => {
      const userWithAllSymbols = {
        email: 'test@example.com',
        password: 'password123',
        [Symbol.asyncIterator]: async function* () {},
        [Symbol.hasInstance]: function () { return true; },
        [Symbol.isConcatSpreadable]: true,
        [Symbol.iterator]: function* () {},
        [Symbol.match]: function () { return true; },
        [Symbol.matchAll]: function* () {},
        [Symbol.replace]: function () { return ''; },
        [Symbol.search]: function () { return 0; },
        [Symbol.species]: Array,
        [Symbol.split]: function () { return []; },
        [Symbol.toPrimitive]: function () { return ''; },
        [Symbol.toStringTag]: 'CustomUser',
        [Symbol.unscopables]: {},
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithAllSymbols);

      expect(authService.login).toHaveBeenCalledWith(userWithAllSymbols);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with getter that throws', async () => {
      const userWithThrowingGetter = {
        email: 'test@example.com',
        password: 'password123',
        get invalid() {
          throw new Error('Getter error');
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithThrowingGetter);

      expect(authService.login).toHaveBeenCalledWith(userWithThrowingGetter);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with setter that throws', async () => {
      const userWithThrowingSetter = {
        email: 'test@example.com',
        password: 'password123',
        set invalid(value: any) {
          throw new Error('Setter error');
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithThrowingSetter);

      expect(authService.login).toHaveBeenCalledWith(userWithThrowingSetter);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with method that throws', async () => {
      const userWithThrowingMethod = {
        email: 'test@example.com',
        password: 'password123',
        throwError() {
          throw new Error('Method error');
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithThrowingMethod);

      expect(authService.login).toHaveBeenCalledWith(userWithThrowingMethod);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with async method that throws', async () => {
      const userWithThrowingAsyncMethod = {
        email: 'test@example.com',
        password: 'password123',
        async throwError() {
          throw new Error('Async method error');
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithThrowingAsyncMethod);

      expect(authService.login).toHaveBeenCalledWith(userWithThrowingAsyncMethod);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with generator method that throws', async () => {
      const userWithThrowingGenerator = {
        email: 'test@example.com',
        password: 'password123',
        *throwError() {
          throw new Error('Generator error');
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login