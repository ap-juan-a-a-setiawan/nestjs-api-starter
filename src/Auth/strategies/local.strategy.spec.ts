import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../services/auth.service';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: jest.Mocked<AuthService>;

  const mockUser = {
    id: 1,
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

    it('should return the user when credentials are valid', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(
        localStrategy.validate('nonexistent@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'nonexistent@example.com',
        'wrongpassword',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException when validateUser returns undefined', async () => {
      authService.validateUser.mockResolvedValue(undefined);

      await expect(
        localStrategy.validate('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException when validateUser returns empty object', async () => {
      authService.validateUser.mockResolvedValue({} as any);

      await expect(
        localStrategy.validate('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException when validateUser returns false', async () => {
      authService.validateUser.mockResolvedValue(false as any);

      await expect(
        localStrategy.validate('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException when validateUser returns empty string', async () => {
      authService.validateUser.mockResolvedValue('' as any);

      await expect(
        localStrategy.validate('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException when validateUser returns 0', async () => {
      authService.validateUser.mockResolvedValue(0 as any);

      await expect(
        localStrategy.validate('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from authService.validateUser', async () => {
      const error = new Error('Database connection failed');
      authService.validateUser.mockRejectedValue(error);

      await expect(
        localStrategy.validate('test@example.com', 'password123'),
      ).rejects.toThrow(error);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle empty email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate('', '');

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith('', '');
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle special characters in email and password', async () => {
      const specialEmail = 'user+tag@example.com';
      const specialPassword = 'p@ssw0rd!$#';
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(specialEmail, specialPassword);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(
        specialEmail,
        specialPassword,
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle very long email and password', async () => {
      const longEmail = 'a'.repeat(255) + '@example.com';
      const longPassword = 'b'.repeat(1000);
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(longEmail, longPassword);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(longEmail, longPassword);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle whitespace in email and password', async () => {
      const whitespaceEmail = '  test@example.com  ';
      const whitespacePassword = '  password123  ';
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(whitespaceEmail, whitespacePassword);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(
        whitespaceEmail,
        whitespacePassword,
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle null email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(null as any, null as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(null, null);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle undefined email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(undefined as any, undefined as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(undefined, undefined);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle numeric email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(123 as any, 456 as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(123, 456);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle boolean email and password', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(true as any, false as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(true, false);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle object email and password', async () => {
      const emailObj = { email: 'test@example.com' };
      const passwordObj = { password: 'password123' };
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailObj as any, passwordObj as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(emailObj, passwordObj);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle array email and password', async () => {
      const emailArray = ['test@example.com'];
      const passwordArray = ['password123'];
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailArray as any, passwordArray as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(emailArray, passwordArray);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle symbol email and password', async () => {
      const emailSymbol = Symbol('email');
      const passwordSymbol = Symbol('password');
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailSymbol as any, passwordSymbol as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(emailSymbol, passwordSymbol);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle bigint email and password', async () => {
      const emailBigInt = BigInt(123);
      const passwordBigInt = BigInt(456);
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailBigInt as any, passwordBigInt as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(emailBigInt, passwordBigInt);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle function email and password', async () => {
      const emailFunc = () => 'test@example.com';
      const passwordFunc = () => 'password123';
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailFunc as any, passwordFunc as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(emailFunc, passwordFunc);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle Date object email and password', async () => {
      const emailDate = new Date('2024-01-01');
      const passwordDate = new Date('2024-12-31');
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailDate as any, passwordDate as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(emailDate, passwordDate);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle RegExp email and password', async () => {
      const emailRegex = /test@example\.com/;
      const passwordRegex = /password123/;
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailRegex as any, passwordRegex as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(emailRegex, passwordRegex);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle Map email and password', async () => {
      const emailMap = new Map([['email', 'test@example.com']]);
      const passwordMap = new Map([['password', 'password123']]);
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailMap as any, passwordMap as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(emailMap, passwordMap);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle Set email and password', async () => {
      const emailSet = new Set(['test@example.com']);
      const passwordSet = new Set(['password123']);
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailSet as any, passwordSet as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(emailSet, passwordSet);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle Promise email and password', async () => {
      const emailPromise = Promise.resolve('test@example.com');
      const passwordPromise = Promise.resolve('password123');
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(emailPromise as any, passwordPromise as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(emailPromise, passwordPromise);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle mixed types for email and password', async () => {
      const mixedEmail = { toString: () => 'test@example.com' };
      const mixedPassword = ['password123'];
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(mixedEmail as any, mixedPassword as any);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(mixedEmail, mixedPassword);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle user object with additional properties', async () => {
      const userWithExtraProps = {
        ...mockUser,
        roles: ['admin'],
        permissions: ['read', 'write'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      authService.validateUser.mockResolvedValue(userWithExtraProps);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(userWithExtraProps);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle user object with nested objects', async () => {
      const userWithNested = {
        ...mockUser,
        profile: {
          address: {
            street: '123 Main St',
            city: 'New York',
            country: 'USA',
          },
          preferences: {
            theme: 'dark',
            notifications: true,
          },
        },
      };
      authService.validateUser.mockResolvedValue(userWithNested);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(userWithNested);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle user object with arrays', async () => {
      const userWithArrays = {
        ...mockUser,
        tags: ['admin', 'user', 'premium'],
        permissions: [1, 2, 3, 4, 5],
      };
      authService.validateUser.mockResolvedValue(userWithArrays);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(userWithArrays);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle user object with null values', async () => {
      const userWithNulls = {
        id: 1,
        email: 'test@example.com',
        name: null,
        phone: null,
        address: null,
      };
      authService.validateUser.mockResolvedValue(userWithNulls);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(userWithNulls);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle user object with undefined values', async () => {
      const userWithUndefined = {
        id: 1,
        email: 'test@example.com',
        name: undefined,
        phone: undefined,
      };
      authService.validateUser.mockResolvedValue(userWithUndefined);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(userWithUndefined);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle user object with Date values', async () => {
      const userWithDates = {
        id: 1,
        email: 'test@example.com',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-12-31T23:59:59Z'),
        lastLogin: new Date('2024-06-15T12:30:00Z'),
      };
      authService.validateUser.mockResolvedValue(userWithDates);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(userWithDates);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle user object with Buffer values', async () => {
      const userWithBuffer = {
        id: 1,
        email: 'test@example.com',
        avatar: Buffer.from('base64encodedimage'),
        token: Buffer.from('encryptedtoken'),
      };
      authService.validateUser.mockResolvedValue(userWithBuffer);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(userWithBuffer);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle user object with Symbol values', async () => {
      const userWithSymbol = {
        id: 1,
        email: 'test@example.com',
        [Symbol('secret')]: 'hidden value',
      };
      authService.validateUser.mockResolvedValue(userWithSymbol);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(userWithSymbol);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle user object with BigInt values', async () => {
      const userWithBigInt = {
        id: 1,
        email: 'test@example.com',
        accountNumber: BigInt(12345678901234567890),
        balance: BigInt(1000000),
      };
      authService.validateUser.mockResolvedValue(userWithBigInt);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(userWithBigInt);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle user object with function values', async () => {
      const userWithFunctions = {
        id: 1,
        email: 'test@example.com',
        getFullName: () => 'Test User',
        isActive: () => true,
      };
      authService.validateUser.mockResolvedValue(userWithFunctions);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(userWithFunctions);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle user object with circular references', async () => {
      const userWithCircular: any = {
        id: 1,
        email: 'test@example.com',
      };
      userWithCircular.self = userWithCircular;
      authService.validateUser.mockResolvedValue(userWithCircular);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(userWithCircular);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle user object with getters', async () => {
      const userWithGetters = {
        id: 1,
        email: 'test@example.com',
        get name() {
          return 'Test User';
        },
        get fullInfo() {
          return `${this.email} - ${this.name}`;
        },
      };
      authService.validateUser.mockResolvedValue(userWithGetters);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(userWithGetters);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle user object with setters', async () => {
      const userWithSetters = {
        id: 1,
        email: 'test@example.com',
        _name: 'Test User',
        set name(value: string) {
          this._name = value;
        },
        get name() {
          return this._name;
        },
      };
      authService.validateUser.mockResolvedValue(userWithSetters);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(userWithSetters);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle user object with prototype methods', async () => {
      class User {
        constructor(
          public id: number,
          public email: string,
          public name: string,
        ) {}
        getDisplayName(): string {
          return `${this.name} (${this.email})`;
        }
      }
      const userInstance = new User(1, 'test@example.com', 'Test User');
      authService.validateUser.mockResolvedValue(userInstance);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(userInstance);
      expect(result).toBeInstanceOf(User);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle user object with frozen properties', async () => {
      const userWithFrozen = Object.freeze({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      });
      authService.validateUser.mockResolvedValue(userWithFrozen);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(userWithFrozen);
      expect(Object.isFrozen(result)).toBe(true);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle user object with sealed properties', async () => {
      const userWithSealed = Object.seal({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      });
      authService.validateUser.mockResolvedValue(userWithSealed);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(userWithSealed);
      expect(Object.isSealed(result)).toBe(true);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle user object with non-extensible properties', async () => {
      const userWithNonExtensible = Object.preventExtensions({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      });
      authService.validateUser.mockResolvedValue(userWithNonExtensible);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(userWithNonExtensible);
      expect(Object.isExtensible(result)).toBe(false);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle user object with property descriptors', async () => {
      const userWithDescriptors: any = {};
      Object.defineProperty(userWithDescriptors, 'id', {
        value: 1,
        writable: false,
        enumerable: true,
        configurable: false,
      });
      Object.defineProperty(userWithDescriptors, 'email', {
        value: 'test@example.com',
        writable: true,
        enumerable: true,
        configurable: true,
      });
      authService.validateUser.mockResolvedValue(userWithDescriptors);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(userWithDescriptors);
      expect(Object.getOwnPropertyDescriptor(result, 'id')?.writable).toBe(false);
      expect(Object.getOwnPropertyDescriptor(result, 'email')?.writable).toBe(true);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle user object with multiple levels of nesting', async () => {
      const deeplyNestedUser = {
        id: 1,
        email: 'test@example.com',
        profile: {
          personal: {
            name: {
              first: 'Test',
              last: 'User',
              middle: {
                initial: 'A',
                full: 'Alpha'
              }
            },
            contact: {
              email: 'personal@example.com',
              phone: {
                home: '123-456-7890',
                work: '098-765-4321',
                mobile: {
                  primary: '555-123-4567',
                  secondary: '555-987-6543'
                }
              }
            }
          },
          professional: {
            company: {
              name: 'Test Corp',
              department: {
                name: 'Engineering',
                team: {
                  name: 'Backend',
                  lead: 'John Doe'
                }
              }
            },
            position: {
              title: 'Senior Developer',
              level: {
                seniority: 'Senior',
                grade: 'L5'
              }
            }
          }
        },
        settings: {
          preferences: {
            theme: {
              mode: 'dark',
              accent: 'blue',
              font: {
                family: 'Arial',
                size: 14,
                weight: {
                  regular: 400,
                  bold: 700
                }
              }
            },
            notifications: {
              email: true,
              push: false,
              sms: {
                enabled: true,
                frequency: 'daily'
              }
            }
          }
        }
      };
      authService.validateUser.mockResolvedValue(deeplyNestedUser);

      const result = await localStrategy.validate('test@example.com', 'password123');

      expect(result).toEqual(deeplyNestedUser);
      expect(result.profile.personal.name.middle.initial).toBe('A');
      expect(result.profile.professional.company.department.team.manager).toBe('John Doe');
      expect(result.settings.preferences.theme.font.weight.bold).toBe(700);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });
  });
});