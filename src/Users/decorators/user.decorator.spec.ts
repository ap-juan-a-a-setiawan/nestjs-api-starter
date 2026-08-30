import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.decorator';

jest.mock('@nestjs/common', () => ({
  createParamDecorator: jest.fn((fn) => fn),
  ExecutionContext: jest.fn(),
}));

describe('UserDecorator', () => {
  let mockExecutionContext: jest.Mocked<ExecutionContext>;
  let mockRequest: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      user: {
        id: '123',
        email: 'test@example.com',
        roles: ['admin'],
      },
    };

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as unknown as jest.Mocked<ExecutionContext>;
  });

  describe('User decorator factory function', () => {
    it('should be defined', () => {
      expect(User).toBeDefined();
    });

    it('should return the user object from the request', () => {
      const result = User('someData', mockExecutionContext);
      expect(result).toEqual(mockRequest.user);
    });

    it('should call switchToHttp on the execution context', () => {
      User('someData', mockExecutionContext);
      expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
    });

    it('should call getRequest on the http context', () => {
      User('someData', mockExecutionContext);
      const httpContext = mockExecutionContext.switchToHttp();
      expect(httpContext.getRequest).toHaveBeenCalled();
    });

    it('should return undefined when request.user is not set', () => {
      mockRequest.user = undefined;
      const result = User('someData', mockExecutionContext);
      expect(result).toBeUndefined();
    });

    it('should return null when request.user is null', () => {
      mockRequest.user = null;
      const result = User('someData', mockExecutionContext);
      expect(result).toBeNull();
    });

    it('should handle empty user object', () => {
      mockRequest.user = {};
      const result = User('someData', mockExecutionContext);
      expect(result).toEqual({});
    });

    it('should handle user object with various properties', () => {
      const complexUser = {
        id: '456',
        username: 'john_doe',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          age: 30,
        },
        permissions: ['read', 'write', 'delete'],
        isActive: true,
        createdAt: new Date('2023-01-01'),
      };
      mockRequest.user = complexUser;
      const result = User('someData', mockExecutionContext);
      expect(result).toEqual(complexUser);
    });

    it('should pass the data parameter to the decorator function', () => {
      const data = { key: 'value' };
      const result = User(data, mockExecutionContext);
      expect(result).toEqual(mockRequest.user);
    });

    it('should handle undefined data parameter', () => {
      const result = User(undefined, mockExecutionContext);
      expect(result).toEqual(mockRequest.user);
    });

    it('should handle null data parameter', () => {
      const result = User(null, mockExecutionContext);
      expect(result).toEqual(mockRequest.user);
    });

    it('should handle string data parameter', () => {
      const result = User('userId', mockExecutionContext);
      expect(result).toEqual(mockRequest.user);
    });

    it('should handle number data parameter', () => {
      const result = User(123, mockExecutionContext);
      expect(result).toEqual(mockRequest.user);
    });

    it('should handle boolean data parameter', () => {
      const result = User(true, mockExecutionContext);
      expect(result).toEqual(mockRequest.user);
    });

    it('should handle array data parameter', () => {
      const result = User(['a', 'b', 'c'], mockExecutionContext);
      expect(result).toEqual(mockRequest.user);
    });

    it('should handle object data parameter', () => {
      const result = User({ nested: { object: true } }, mockExecutionContext);
      expect(result).toEqual(mockRequest.user);
    });

    it('should handle missing request object', () => {
      mockExecutionContext.switchToHttp = jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(undefined),
      });
      const result = User('someData', mockExecutionContext);
      expect(result).toBeUndefined();
    });

    it('should handle request without user property', () => {
      mockRequest = {};
      mockExecutionContext.switchToHttp = jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      });
      const result = User('someData', mockExecutionContext);
      expect(result).toBeUndefined();
    });

    it('should handle errors from switchToHttp', () => {
      mockExecutionContext.switchToHttp = jest.fn().mockImplementation(() => {
        throw new Error('Switch to HTTP failed');
      });
      expect(() => User('someData', mockExecutionContext)).toThrow('Switch to HTTP failed');
    });

    it('should handle errors from getRequest', () => {
      mockExecutionContext.switchToHttp = jest.fn().mockReturnValue({
        getRequest: jest.fn().mockImplementation(() => {
          throw new Error('Get request failed');
        }),
      });
      expect(() => User('someData', mockExecutionContext)).toThrow('Get request failed');
    });

    it('should handle user object with getter properties', () => {
      const userWithGetter = {
        get fullName() {
          return 'John Doe';
        },
        id: '789',
      };
      mockRequest.user = userWithGetter;
      const result = User('someData', mockExecutionContext);
      expect(result).toEqual(userWithGetter);
      expect(result.fullName).toBe('John Doe');
    });

    it('should handle frozen user object', () => {
      const frozenUser = Object.freeze({
        id: '101',
        email: 'frozen@example.com',
      });
      mockRequest.user = frozenUser;
      const result = User('someData', mockExecutionContext);
      expect(result).toEqual(frozenUser);
      expect(Object.isFrozen(result)).toBe(true);
    });

    it('should handle user object with symbol properties', () => {
      const symbolKey = Symbol('unique');
      const userWithSymbol = {
        id: '202',
        [symbolKey]: 'symbolValue',
      };
      mockRequest.user = userWithSymbol;
      const result = User('someData', mockExecutionContext);
      expect(result).toEqual(userWithSymbol);
      expect(result[symbolKey]).toBe('symbolValue');
    });

    it('should handle user object with circular references', () => {
      const circularUser: any = {
        id: '303',
        name: 'Circular',
      };
      circularUser.self = circularUser;
      mockRequest.user = circularUser;
      const result = User('someData', mockExecutionContext);
      expect(result).toBe(circularUser);
      expect(result.self).toBe(circularUser);
    });

    it('should handle user object with Date properties', () => {
      const dateUser = {
        id: '404',
        createdAt: new Date('2024-01-15T10:30:00Z'),
        updatedAt: new Date('2024-01-16T12:45:00Z'),
      };
      mockRequest.user = dateUser;
      const result = User('someData', mockExecutionContext);
      expect(result).toEqual(dateUser);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should handle user object with Buffer properties', () => {
      const bufferUser = {
        id: '505',
        avatar: Buffer.from('avatar-data'),
      };
      mockRequest.user = bufferUser;
      const result = User('someData', mockExecutionContext);
      expect(result).toEqual(bufferUser);
      expect(Buffer.isBuffer(result.avatar)).toBe(true);
    });

    it('should handle user object with Map and Set', () => {
      const mapUser = {
        id: '606',
        metadata: new Map([['key', 'value']]),
        tags: new Set(['tag1', 'tag2']),
      };
      mockRequest.user = mapUser;
      const result = User('someData', mockExecutionContext);
      expect(result).toEqual(mapUser);
      expect(result.metadata).toBeInstanceOf(Map);
      expect(result.tags).toBeInstanceOf(Set);
    });

    it('should handle user object with nested arrays and objects', () => {
      const nestedUser = {
        id: '707',
        addresses: [
          { street: '123 Main St', city: 'Springfield' },
          { street: '456 Oak Ave', city: 'Shelbyville' },
        ],
        preferences: {
          theme: 'dark',
          notifications: {
            email: true,
            sms: false,
          },
        },
      };
      mockRequest.user = nestedUser;
      const result = User('someData', mockExecutionContext);
      expect(result).toEqual(nestedUser);
      expect(result.addresses).toHaveLength(2);
      expect(result.preferences.theme).toBe('dark');
    });

    it('should handle user object with prototype methods', () => {
      class UserClass {
        constructor(public id: string, public name: string) {}
        getDisplayName(): string {
          return `${this.name} (${this.id})`;
        }
      }
      const classUser = new UserClass('808', 'Class User');
      mockRequest.user = classUser;
      const result = User('someData', mockExecutionContext);
      expect(result).toBe(classUser);
      expect(result.getDisplayName()).toBe('Class User (808)');
    });

    it('should handle user object with non-enumerable properties', () => {
      const nonEnumUser: any = {
        id: '909',
        name: 'Non-Enumerable',
      };
      Object.defineProperty(nonEnumUser, 'hidden', {
        value: 'secret',
        enumerable: false,
      });
      mockRequest.user = nonEnumUser;
      const result = User('someData', mockExecutionContext);
      expect(result).toEqual(nonEnumUser);
      expect(result.hidden).toBe('secret');
    });

    it('should handle user object with inherited properties', () => {
      const parent = { inheritedProp: 'fromParent' };
      const child = Object.create(parent);
      child.id = '1010';
      child.ownProp = 'ownValue';
      mockRequest.user = child;
      const result = User('someData', mockExecutionContext);
      expect(result).toBe(child);
      expect(result.inheritedProp).toBe('fromParent');
      expect(result.ownProp).toBe('ownValue');
    });

    it('should handle user object with getter that throws', () => {
      const throwingUser: any = {
        id: '1111',
        get problematic() {
          throw new Error('Getter error');
        },
      };
      mockRequest.user = throwingUser;
      const result = User('someData', mockExecutionContext);
      expect(result).toBe(throwingUser);
      expect(() => result.problematic).toThrow('Getter error');
    });

    it('should handle user object with Proxy', () => {
      const target = { id: '1212', name: 'Proxy User' };
      const proxyUser = new Proxy(target, {
        get: (obj, prop) => {
          if (prop === 'name') {
            return 'Modified Proxy Name';
          }
          return obj[prop as keyof typeof obj];
        },
      });
      mockRequest.user = proxyUser;
      const result = User('someData', mockExecutionContext);
      expect(result).toBe(proxyUser);
      expect(result.name).toBe('Modified Proxy Name');
      expect(result.id).toBe('1212');
    });

    it('should handle user object with BigInt values', () => {
      const bigIntUser = {
        id: '1313',
        largeNumber: BigInt(9007199254740991),
      };
      mockRequest.user = bigIntUser;
      const result = User('someData', mockExecutionContext);
      expect(result).toEqual(bigIntUser);
      expect(result.largeNumber).toBe(BigInt(9007199254740991));
    });

    it('should handle user object with RegExp values', () => {
      const regexUser = {
        id: '1414',
        pattern: /test/gi,
      };
      mockRequest.user = regexUser;
      const result = User('someData', mockExecutionContext);
      expect(result).toEqual(regexUser);
      expect(result.pattern).toBeInstanceOf(RegExp);
      expect(result.pattern.test('TEST')).toBe(true);
    });

    it('should handle user object with Promise values', () => {
      const promiseUser = {
        id: '1515',
        asyncData: Promise.resolve('resolved'),
      };
      mockRequest.user = promiseUser;
      const result = User('someData', mockExecutionContext);
      expect(result).toEqual(promiseUser);
      expect(result.asyncData).toBeInstanceOf(Promise);
    });

    it('should handle user object with WeakMap and WeakSet', () => {
      const weakMap = new WeakMap();
      const weakSet = new WeakSet();
      const keyObj = {};
      weakMap.set(keyObj, 'value');
      weakSet.add(keyObj);
      const weakUser = {
        id: '1616',
        weakMap,
        weakSet,
      };
      mockRequest.user = weakUser;
      const result = User('someData', mockExecutionContext);
      expect(result).toEqual(weakUser);
      expect(result.weakMap).toBeInstanceOf(WeakMap);
      expect(result.weakSet).toBeInstanceOf(WeakSet);
    });

    it('should handle user object with ArrayBuffer and TypedArray', () => {
      const buffer = new ArrayBuffer(8);
      const typedArray = new Uint8Array(buffer);
      typedArray[0] = 42;
      const bufferUser = {
        id: '1717',
        buffer,
        typedArray,
      };
      mockRequest.user = bufferUser;
      const result = User('someData', mockExecutionContext);
      expect(result).toEqual(bufferUser);
      expect(result.buffer).toBeInstanceOf(ArrayBuffer);
      expect(result.typedArray).toBeInstanceOf(Uint8Array);
      expect(result.typedArray[0]).toBe(42);
    });

    it('should handle user object with Error instances', () => {
      const errorUser = {
        id: '1818',
        error: new Error('Test error'),
      };
      mockRequest.user = errorUser;
      const result = User('someData', mockExecutionContext);
      expect(result).toEqual(errorUser);
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe('Test error');
    });

    it('should handle user object with multiple nested levels', () => {
      const deeplyNestedUser = {
        id: '1919',
        level1: {
          level2: {
            level3: {
              level4: {
                value: 'deepest',
              },
            },
          },
        },
      };
      mockRequest.user = deeplyNestedUser;
      const result = User('someData', mockExecutionContext);
      expect(result).toEqual(deeplyNestedUser);
      expect(result.level1.level2.level3.level4.value).toBe('deepest');
    });

    it('should handle user object with array of objects', () => {
      const arrayUser = {
        id: '2020',
        items: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
          { id: 3, name: 'Item 3' },
        ],
      };
      mockRequest.user = arrayUser;
      const result = User('someData', mockExecutionContext);
      expect(result).toEqual(arrayUser);
      expect(result.items).toHaveLength(3);
      expect(result.items[1].name).toBe('Item 2');
    });

    it('should handle user object with mixed data types', () => {
      const mixedUser = {
        id: '2121',
        string: 'text',
        number: 42,
        boolean: true,
        null: null,
        undefined: undefined,
        array: [1, 'two', false, null],
        object: { nested: 'value' },
        date: new Date(),
        regex: /pattern/,
        bigint: BigInt(123),
        symbol: Symbol('sym'),
      };
      mockRequest.user = mixedUser;
      const result = User('someData', mockExecutionContext);
      expect(result).toEqual(mixedUser);
      expect(result.string).toBe('text');
      expect(result.number).toBe(42);
      expect(result.boolean).toBe(true);
      expect(result.null).toBeNull();
      expect(result.undefined).toBeUndefined();
      expect(result.array).toEqual([1, 'two', false, null]);
      expect(result.object).toEqual({ nested: 'value' });
      expect(result.date).toBeInstanceOf(Date);
      expect(result.regex).toBeInstanceOf(RegExp);
      expect(result.bigint).toBe(BigInt(123));
      expect(typeof result.symbol).toBe('symbol');
    });
  });
});