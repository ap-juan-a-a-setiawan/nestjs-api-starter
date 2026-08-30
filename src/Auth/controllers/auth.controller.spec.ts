import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { LoginDto } from '../dto/login.dto';
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

    it('should handle null user', async () => {
      mockAuthService.login.mockResolvedValue(null);

      const result = await controller.login(null as any);

      expect(authService.login).toHaveBeenCalledWith(null);
      expect(result).toBeNull();
    });

    it('should propagate errors from authService', async () => {
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
        name: 'Test User',
        role: 'admin',
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithExtraProps);

      expect(authService.login).toHaveBeenCalledWith(userWithExtraProps);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle user with missing optional fields', async () => {
      const userWithoutOptional = {
        email: 'test@example.com',
      } as LoginDto;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithoutOptional);

      expect(authService.login).toHaveBeenCalledWith(userWithoutOptional);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle special characters in user credentials', async () => {
      const userWithSpecialChars = {
        email: 'test+special@example.com',
        password: 'p@ssw0rd!$#',
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithSpecialChars);

      expect(authService.login).toHaveBeenCalledWith(userWithSpecialChars);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle very long strings in user credentials', async () => {
      const longEmail = 'a'.repeat(255) + '@example.com';
      const longPassword = 'b'.repeat(1000);
      const userWithLongStrings = {
        email: longEmail,
        password: longPassword,
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithLongStrings);

      expect(authService.login).toHaveBeenCalledWith(userWithLongStrings);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle unicode characters in user credentials', async () => {
      const userWithUnicode = {
        email: 'tést@example.com',
        password: 'pässwörd',
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithUnicode);

      expect(authService.login).toHaveBeenCalledWith(userWithUnicode);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle whitespace in user credentials', async () => {
      const userWithWhitespace = {
        email: '  test@example.com  ',
        password: '  password123  ',
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithWhitespace);

      expect(authService.login).toHaveBeenCalledWith(userWithWhitespace);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle empty string credentials', async () => {
      const userWithEmptyStrings = {
        email: '',
        password: '',
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithEmptyStrings);

      expect(authService.login).toHaveBeenCalledWith(userWithEmptyStrings);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle numeric values in credentials', async () => {
      const userWithNumericValues = {
        email: 12345,
        password: 67890,
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithNumericValues);

      expect(authService.login).toHaveBeenCalledWith(userWithNumericValues);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle boolean values in credentials', async () => {
      const userWithBooleanValues = {
        email: true,
        password: false,
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithBooleanValues);

      expect(authService.login).toHaveBeenCalledWith(userWithBooleanValues);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle array values in credentials', async () => {
      const userWithArrayValues = {
        email: ['test@example.com'],
        password: ['password123'],
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithArrayValues);

      expect(authService.login).toHaveBeenCalledWith(userWithArrayValues);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle object values in credentials', async () => {
      const userWithObjectValues = {
        email: { value: 'test@example.com' },
        password: { value: 'password123' },
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithObjectValues);

      expect(authService.login).toHaveBeenCalledWith(userWithObjectValues);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle null values in credentials', async () => {
      const userWithNullValues = {
        email: null,
        password: null,
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithNullValues);

      expect(authService.login).toHaveBeenCalledWith(userWithNullValues);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle undefined values in credentials', async () => {
      const userWithUndefinedValues = {
        email: undefined,
        password: undefined,
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithUndefinedValues);

      expect(authService.login).toHaveBeenCalledWith(userWithUndefinedValues);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle symbol values in credentials', async () => {
      const symbolEmail = Symbol('email');
      const symbolPassword = Symbol('password');
      const userWithSymbolValues = {
        email: symbolEmail,
        password: symbolPassword,
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithSymbolValues);

      expect(authService.login).toHaveBeenCalledWith(userWithSymbolValues);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle bigint values in credentials', async () => {
      const userWithBigIntValues = {
        email: BigInt(1234567890),
        password: BigInt(9876543210),
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithBigIntValues);

      expect(authService.login).toHaveBeenCalledWith(userWithBigIntValues);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle Date objects in credentials', async () => {
      const userWithDateValues = {
        email: new Date('2024-01-01'),
        password: new Date('2024-12-31'),
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithDateValues);

      expect(authService.login).toHaveBeenCalledWith(userWithDateValues);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle RegExp objects in credentials', async () => {
      const userWithRegExpValues = {
        email: /test@example\.com/,
        password: /password123/,
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithRegExpValues);

      expect(authService.login).toHaveBeenCalledWith(userWithRegExpValues);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle functions in credentials', async () => {
      const emailFunction = () => 'test@example.com';
      const passwordFunction = () => 'password123';
      const userWithFunctionValues = {
        email: emailFunction,
        password: passwordFunction,
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithFunctionValues);

      expect(authService.login).toHaveBeenCalledWith(userWithFunctionValues);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle circular references in credentials', async () => {
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

    it('should handle frozen objects in credentials', async () => {
      const frozenUser = Object.freeze({
        email: 'test@example.com',
        password: 'password123',
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(frozenUser);

      expect(authService.login).toHaveBeenCalledWith(frozenUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle sealed objects in credentials', async () => {
      const sealedUser = Object.seal({
        email: 'test@example.com',
        password: 'password123',
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(sealedUser);

      expect(authService.login).toHaveBeenCalledWith(sealedUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle non-extensible objects in credentials', async () => {
      const nonExtensibleUser = Object.preventExtensions({
        email: 'test@example.com',
        password: 'password123',
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(nonExtensibleUser);

      expect(authService.login).toHaveBeenCalledWith(nonExtensibleUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with getters in credentials', async () => {
      const userWithGetters = {
        get email() {
          return 'test@example.com';
        },
        get password() {
          return 'password123';
        },
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithGetters);

      expect(authService.login).toHaveBeenCalledWith(userWithGetters);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with setters in credentials', async () => {
      let emailValue = 'test@example.com';
      let passwordValue = 'password123';
      const userWithSetters = {
        set email(value: string) {
          emailValue = value;
        },
        get email() {
          return emailValue;
        },
        set password(value: string) {
          passwordValue = value;
        },
        get password() {
          return passwordValue;
        },
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithSetters);

      expect(authService.login).toHaveBeenCalledWith(userWithSetters);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with prototype chain in credentials', async () => {
      const baseUser = {
        email: 'test@example.com',
        password: 'password123',
      };
      const userWithPrototype = Object.create(baseUser);
      userWithPrototype.extraField = 'extra';
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithPrototype);

      expect(authService.login).toHaveBeenCalledWith(userWithPrototype);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with symbol properties in credentials', async () => {
      const symbolKey = Symbol('custom');
      const userWithSymbolProps = {
        email: 'test@example.com',
        password: 'password123',
        [symbolKey]: 'customValue',
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithSymbolProps);

      expect(authService.login).toHaveBeenCalledWith(userWithSymbolProps);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with non-enumerable properties in credentials', async () => {
      const userWithNonEnumerable = {
        email: 'test@example.com',
        password: 'password123',
      };
      Object.defineProperty(userWithNonEnumerable, 'hidden', {
        value: 'hiddenValue',
        enumerable: false,
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithNonEnumerable);

      expect(authService.login).toHaveBeenCalledWith(userWithNonEnumerable);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with inherited properties in credentials', async () => {
      class UserBase {
        email = 'test@example.com';
        password = 'password123';
      }
      class ExtendedUser extends UserBase {
        extraField = 'extra';
      }
      const userWithInherited = new ExtendedUser();
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithInherited);

      expect(authService.login).toHaveBeenCalledWith(userWithInherited);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with computed property names in credentials', async () => {
      const emailKey = 'email';
      const passwordKey = 'password';
      const userWithComputed = {
        [emailKey]: 'test@example.com',
        [passwordKey]: 'password123',
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithComputed);

      expect(authService.login).toHaveBeenCalledWith(userWithComputed);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with spread properties in credentials', async () => {
      const baseUser = {
        email: 'test@example.com',
        password: 'password123',
      };
      const userWithSpread = {
        ...baseUser,
        extraField: 'extra',
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithSpread);

      expect(authService.login).toHaveBeenCalledWith(userWithSpread);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with destructured properties in credentials', async () => {
      const baseUser = {
        email: 'test@example.com',
        password: 'password123',
      };
      const { email, password } = baseUser;
      const userWithDestructured = { email, password };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithDestructured);

      expect(authService.login).toHaveBeenCalledWith(userWithDestructured);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with optional chaining in credentials', async () => {
      const userWithOptionalChaining = {
        email: 'test@example.com',
        password: 'password123',
        profile: {
          name: 'Test User',
        },
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithOptionalChaining);

      expect(authService.login).toHaveBeenCalledWith(userWithOptionalChaining);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with nullish coalescing in credentials', async () => {
      const userWithNullishCoalescing = {
        email: 'test@example.com',
        password: 'password123',
        profile: null,
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithNullishCoalescing);

      expect(authService.login).toHaveBeenCalledWith(userWithNullishCoalescing);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with logical assignment in credentials', async () => {
      const userWithLogicalAssignment = {
        email: 'test@example.com',
        password: 'password123',
      };
      userWithLogicalAssignment.email ||= 'fallback@example.com';
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithLogicalAssignment);

      expect(authService.login).toHaveBeenCalledWith(userWithLogicalAssignment);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with numeric separators in credentials', async () => {
      const userWithNumericSeparators = {
        email: 'test@example.com',
        password: 'pass123_456',
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithNumericSeparators);

      expect(authService.login).toHaveBeenCalledWith(userWithNumericSeparators);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with template literals in credentials', async () => {
      const domain = 'example.com';
      const userWithTemplateLiterals = {
        email: `test@${domain}`,
        password: `pass${123}`,
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithTemplateLiterals);

      expect(authService.login).toHaveBeenCalledWith(userWithTemplateLiterals);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with tagged templates in credentials', async () => {
      const tag = (strings: TemplateStringsArray, ...values: any[]) => 
        strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
      const userWithTaggedTemplates = {
        email: tag`test@${'example'}.com`,
        password: tag`pass${'word'}123`,
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithTaggedTemplates);

      expect(authService.login).toHaveBeenCalledWith(userWithTaggedTemplates);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with regex literals in credentials', async () => {
      const userWithRegexLiterals = {
        email: /test@example\.com/,
        password: /password123/,
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithRegexLiterals);

      expect(authService.login).toHaveBeenCalledWith(userWithRegexLiterals);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with array destructuring in credentials', async () => {
      const [email, password] = ['test@example.com', 'password123'];
      const userWithArrayDestructuring = { email, password };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithArrayDestructuring);

      expect(authService.login).toHaveBeenCalledWith(userWithArrayDestructuring);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with object destructuring in credentials', async () => {
      const { email, password } = { email: 'test@example.com', password: 'password123' };
      const userWithObjectDestructuring = { email, password };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithObjectDestructuring);

      expect(authService.login).toHaveBeenCalledWith(userWithObjectDestructuring);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with rest parameters in credentials', async () => {
      const userWithRestParams = {
        email: 'test@example.com',
        password: 'password123',
        ...{ extraField: 'extra' },
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithRestParams);

      expect(authService.login).toHaveBeenCalledWith(userWithRestParams);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with default parameters in credentials', async () => {
      const userWithDefaultParams = {
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithDefaultParams);

      expect(authService.login).toHaveBeenCalledWith(userWithDefaultParams);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with arrow functions in credentials', async () => {
      const userWithArrowFunctions = {
        email: () => 'test@example.com',
        password: () => 'password123',
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithArrowFunctions);

      expect(authService.login).toHaveBeenCalledWith(userWithArrowFunctions);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with async functions in credentials', async () => {
      const userWithAsyncFunctions = {
        email: async () => 'test@example.com',
        password: async () => 'password123',
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithAsyncFunctions);

      expect(authService.login).toHaveBeenCalledWith(userWithAsyncFunctions);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with generator functions in credentials', async () => {
      const userWithGeneratorFunctions = {
        email: function* () { yield 'test@example.com'; },
        password: function* () { yield 'password123'; },
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithGeneratorFunctions);

      expect(authService.login).toHaveBeenCalledWith(userWithGeneratorFunctions);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with class instances in credentials', async () => {
      class UserCredentials {
        email = 'test@example.com';
        password = 'password123';
      }
      const userWithClassInstance = new UserCredentials();
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithClassInstance);

      expect(authService.login).toHaveBeenCalledWith(userWithClassInstance);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with Map instances in credentials', async () => {
      const userWithMap = new Map([
        ['email', 'test@example.com'],
        ['password', 'password123'],
      ]);
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithMap as any);

      expect(authService.login).toHaveBeenCalledWith(userWithMap);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with Set instances in credentials', async () => {
      const userWithSet = new Set(['test@example.com', 'password123']);
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithSet as any);

      expect(authService.login).toHaveBeenCalledWith(userWithSet);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with WeakMap instances in credentials', async () => {
      const userWithWeakMap = new WeakMap();
      const key = {};
      userWithWeakMap.set(key, 'test@example.com');
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithWeakMap as any);

      expect(authService.login).toHaveBeenCalledWith(userWithWeakMap);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with WeakSet instances in credentials', async () => {
      const userWithWeakSet = new WeakSet();
      const key = {};
      userWithWeakSet.add(key);
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithWeakSet as any);

      expect(authService.login).toHaveBeenCalledWith(userWithWeakSet);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with typed arrays in credentials', async () => {
      const userWithTypedArrays = {
        email: new Uint8Array([1, 2, 3]),
        password: new Float64Array([1.5, 2.5]),
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithTypedArrays);

      expect(authService.login).toHaveBeenCalledWith(userWithTypedArrays);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with ArrayBuffer in credentials', async () => {
      const userWithArrayBuffer = {
        email: new ArrayBuffer(8),
        password: new ArrayBuffer(16),
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithArrayBuffer);

      expect(authService.login).toHaveBeenCalledWith(userWithArrayBuffer);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with DataView in credentials', async () => {
      const userWithDataView = {
        email: new DataView(new ArrayBuffer(8)),
        password: new DataView(new ArrayBuffer(16)),
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithDataView);

      expect(authService.login).toHaveBeenCalledWith(userWithDataView);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with Promise in credentials', async () => {
      const userWithPromise = {
        email: Promise.resolve('test@example.com'),
        password: Promise.resolve('password123'),
      } as any;
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithPromise);

      expect(authService.login).toHaveBeenCalledWith(userWithPromise);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with Proxy in credentials', async () => {
      const target = {
        email: 'test@example.com',
        password: 'password123',
      };
      const userWithProxy = new Proxy(target, {
        get: (obj, prop) => {
          if (prop === 'email') return 'proxied@example.com';
          return obj[prop as keyof typeof obj];
        },
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithProxy);

      expect(authService.login).toHaveBeenCalledWith(userWithProxy);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with Reflect in credentials', async () => {
      const userWithReflect = {
        email: 'test@example.com',
        password: 'password123',
      };
      Reflect.set(userWithReflect, 'extraField', 'extra');
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithReflect);

      expect(authService.login).toHaveBeenCalledWith(userWithReflect);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with eval in credentials', async () => {
      const userWithEval = {
        email: eval("'test@example.com'"),
        password: eval("'password123'"),
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithEval);

      expect(authService.login).toHaveBeenCalledWith(userWithEval);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with Function constructor in credentials', async () => {
      const userWithFunctionConstructor = {
        email: new Function("return 'test@example.com'")(),
        password: new Function("return 'password123'")(),
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithFunctionConstructor);

      expect(authService.login).toHaveBeenCalledWith(userWithFunctionConstructor);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with global variables in credentials', async () => {
      globalThis.testEmail = 'test@example.com';
      globalThis.testPassword = 'password123';
      const userWithGlobalVars = {
        email: globalThis.testEmail,
        password: globalThis.testPassword,
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithGlobalVars);

      expect(authService.login).toHaveBeenCalledWith(userWithGlobalVars);
      expect(result).toEqual(mockLoginResponse);

      delete globalThis.testEmail;
      delete globalThis.testPassword;
    });

    it('should handle objects with process.env in credentials', async () => {
      process.env.TEST_EMAIL = 'test@example.com';
      process.env.TEST_PASSWORD = 'password123';
      const userWithEnvVars = {
        email: process.env.TEST_EMAIL,
        password: process.env.TEST_PASSWORD,
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithEnvVars);

      expect(authService.login).toHaveBeenCalledWith(userWithEnvVars);
      expect(result).toEqual(mockLoginResponse);

      delete process.env.TEST_EMAIL;
      delete process.env.TEST_PASSWORD;
    });

    it('should handle objects with JSON in credentials', async () => {
      const userWithJSON = {
        email: JSON.parse('"test@example.com"'),
        password: JSON.parse('"password123"'),
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithJSON);

      expect(authService.login).toHaveBeenCalledWith(userWithJSON);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with Math in credentials', async () => {
      const userWithMath = {
        email: 'test@example.com',
        password: Math.random().toString(),
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithMath);

      expect(authService.login).toHaveBeenCalledWith(userWithMath);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with Date in credentials', async () => {
      const userWithDate = {
        email: 'test@example.com',
        password: new Date().toISOString(),
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithDate);

      expect(authService.login).toHaveBeenCalledWith(userWithDate);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with RegExp in credentials', async () => {
      const userWithRegExp = {
        email: 'test@example.com',
        password: new RegExp('password123').toString(),
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithRegExp);

      expect(authService.login).toHaveBeenCalledWith(userWithRegExp);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with Error in credentials', async () => {
      const userWithError = {
        email: 'test@example.com',
        password: new Error('password123').message,
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithError);

      expect(authService.login).toHaveBeenCalledWith(userWithError);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with Symbol in credentials', async () => {
      const userWithSymbol = {
        email: 'test@example.com',
        password: Symbol('password123').toString(),
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithSymbol);

      expect(authService.login).toHaveBeenCalledWith(userWithSymbol);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle objects with BigInt in credentials', async () => {
      const userWithBigInt = {
        email: 'test@example.com',
        password: BigInt(1234567890).toString(),
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(userWithBigInt);

      expect(authService.login).toHaveBeenCalledWith(userWithBigInt);
      expect(result).