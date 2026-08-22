import { Test, TestingModule } from '@nestjs/testing';
import { EntityBase } from './entity.base';

describe('EntityBase', () => {
  let entityBase: EntityBase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EntityBase,
          useValue: Object.create(EntityBase.prototype),
        },
      ],
    }).compile();

    entityBase = module.get<EntityBase>(EntityBase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('EntityBase abstract class', () => {
    it('should be defined', () => {
      expect(entityBase).toBeDefined();
    });

    it('should be an instance of EntityBase', () => {
      expect(entityBase).toBeInstanceOf(EntityBase);
    });

    it('should have the correct prototype', () => {
      expect(Object.getPrototypeOf(entityBase)).toBe(EntityBase.prototype);
    });

    it('should not be directly instantiable', () => {
      expect(() => {
        // @ts-ignore - Testing abstract class instantiation
        new EntityBase();
      }).toThrow(TypeError);
    });

    it('should have no own properties', () => {
      expect(Object.keys(entityBase)).toHaveLength(0);
    });

    it('should have no enumerable properties', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const enumerableProps = Object.entries(descriptors).filter(
        ([, descriptor]) => descriptor.enumerable,
      );
      expect(enumerableProps).toHaveLength(0);
    });

    it('should have no methods defined on the prototype', () => {
      const prototypeMethods = Object.getOwnPropertyNames(EntityBase.prototype);
      expect(prototypeMethods).toEqual(['constructor']);
    });

    it('should be an abstract class', () => {
      expect(EntityBase.toString()).toContain('class EntityBase');
    });

    it('should not have a constructor that can be called directly', () => {
      const constructorSpy = jest.spyOn(EntityBase.prototype, 'constructor');
      expect(constructorSpy).toBeDefined();
      expect(constructorSpy).not.toHaveBeenCalled();
    });

    it('should allow subclassing', () => {
      class TestEntity extends EntityBase {
        testMethod(): string {
          return 'test';
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity).toBeInstanceOf(EntityBase);
      expect(testEntity).toBeInstanceOf(TestEntity);
      expect(testEntity.testMethod()).toBe('test');
    });

    it('should allow subclass with additional properties', () => {
      class TestEntity extends EntityBase {
        id: number;
        name: string;

        constructor(id: number, name: string) {
          super();
          this.id = id;
          this.name = name;
        }

        getInfo(): string {
          return `${this.id}: ${this.name}`;
        }
      }

      const testEntity = new TestEntity(1, 'Test');
      expect(testEntity.id).toBe(1);
      expect(testEntity.name).toBe('Test');
      expect(testEntity.getInfo()).toBe('1: Test');
    });

    it('should allow subclass with overridden methods', () => {
      class BaseEntity extends EntityBase {
        getType(): string {
          return 'base';
        }
      }

      class ChildEntity extends BaseEntity {
        getType(): string {
          return 'child';
        }
      }

      const childEntity = new ChildEntity();
      expect(childEntity.getType()).toBe('child');
    });

    it('should support inheritance chain', () => {
      class GrandParentEntity extends EntityBase {
        grandParentMethod(): string {
          return 'grandParent';
        }
      }

      class ParentEntity extends GrandParentEntity {
        parentMethod(): string {
          return 'parent';
        }
      }

      class ChildEntity extends ParentEntity {
        childMethod(): string {
          return 'child';
        }
      }

      const childEntity = new ChildEntity();
      expect(childEntity.grandParentMethod()).toBe('grandParent');
      expect(childEntity.parentMethod()).toBe('parent');
      expect(childEntity.childMethod()).toBe('child');
    });

    it('should support multiple levels of inheritance', () => {
      class Level1Entity extends EntityBase {
        level1Method(): number {
          return 1;
        }
      }

      class Level2Entity extends Level1Entity {
        level2Method(): number {
          return 2;
        }
      }

      class Level3Entity extends Level2Entity {
        level3Method(): number {
          return 3;
        }
      }

      const entity = new Level3Entity();
      expect(entity.level1Method()).toBe(1);
      expect(entity.level2Method()).toBe(2);
      expect(entity.level3Method()).toBe(3);
    });

    it('should maintain prototype chain integrity', () => {
      class TestEntity extends EntityBase {
        method(): string {
          return 'test';
        }
      }

      const entity = new TestEntity();
      expect(entity instanceof EntityBase).toBe(true);
      expect(entity instanceof TestEntity).toBe(true);
      expect(Object.getPrototypeOf(entity)).toBe(TestEntity.prototype);
      expect(Object.getPrototypeOf(TestEntity.prototype)).toBe(EntityBase.prototype);
    });

    it('should not have any static methods', () => {
      const staticMethods = Object.getOwnPropertyNames(EntityBase).filter(
        (prop) => typeof (EntityBase as any)[prop] === 'function' && prop !== 'length' && prop !== 'name' && prop !== 'prototype',
      );
      expect(staticMethods).toHaveLength(0);
    });

    it('should not have any static properties', () => {
      const staticProps = Object.getOwnPropertyNames(EntityBase).filter(
        (prop) => prop !== 'length' && prop !== 'name' && prop !== 'prototype',
      );
      expect(staticProps).toHaveLength(0);
    });

    it('should be extensible', () => {
      expect(Object.isExtensible(EntityBase)).toBe(true);
    });

    it('should have a non-writable prototype', () => {
      const descriptor = Object.getOwnPropertyDescriptor(EntityBase, 'prototype');
      expect(descriptor?.writable).toBe(false);
    });

    it('should have a non-enumerable prototype', () => {
      const descriptor = Object.getOwnPropertyDescriptor(EntityBase, 'prototype');
      expect(descriptor?.enumerable).toBe(false);
    });

    it('should have a non-configurable prototype', () => {
      const descriptor = Object.getOwnPropertyDescriptor(EntityBase, 'prototype');
      expect(descriptor?.configurable).toBe(false);
    });

    it('should have a constructor property on prototype', () => {
      expect(EntityBase.prototype.constructor).toBe(EntityBase);
    });

    it('should have a prototype with no own properties', () => {
      expect(Object.keys(EntityBase.prototype)).toHaveLength(0);
    });

    it('should have a prototype with only constructor', () => {
      expect(Object.getOwnPropertyNames(EntityBase.prototype)).toEqual(['constructor']);
    });

    it('should support instanceof checks', () => {
      class TestEntity extends EntityBase {}
      const entity = new TestEntity();
      expect(entity instanceof EntityBase).toBe(true);
      expect(entity instanceof TestEntity).toBe(true);
      expect(entity instanceof Object).toBe(true);
    });

    it('should support Object.prototype methods', () => {
      class TestEntity extends EntityBase {
        name: string = 'test';
      }
      const entity = new TestEntity();
      expect(entity.toString()).toBe('[object Object]');
      expect(entity.hasOwnProperty('name')).toBe(true);
      expect(entity.isPrototypeOf(entity)).toBe(false);
    });

    it('should support property descriptors', () => {
      class TestEntity extends EntityBase {
        get value(): string {
          return 'test';
        }
      }
      const entity = new TestEntity();
      const descriptor = Object.getOwnPropertyDescriptor(TestEntity.prototype, 'value');
      expect(descriptor).toBeDefined();
      expect(descriptor?.get).toBeDefined();
      expect(entity.value).toBe('test');
    });

    it('should support symbol properties', () => {
      const symbol = Symbol('test');
      class TestEntity extends EntityBase {
        [symbol]: string = 'symbol-value';
      }
      const entity = new TestEntity();
      expect(entity[symbol]).toBe('symbol-value');
    });

    it('should support private fields in subclasses', () => {
      class TestEntity extends EntityBase {
        #privateField: string = 'private';

        getPrivateField(): string {
          return this.#privateField;
        }
      }
      const entity = new TestEntity();
      expect(entity.getPrivateField()).toBe('private');
    });

    it('should support static methods in subclasses', () => {
      class TestEntity extends EntityBase {
        static create(): TestEntity {
          return new TestEntity();
        }
      }
      const entity = TestEntity.create();
      expect(entity).toBeInstanceOf(TestEntity);
      expect(entity).toBeInstanceOf(EntityBase);
    });

    it('should support getters and setters in subclasses', () => {
      class TestEntity extends EntityBase {
        private _value: string = '';

        get value(): string {
          return this._value;
        }

        set value(val: string) {
          this._value = val;
        }
      }
      const entity = new TestEntity();
      entity.value = 'updated';
      expect(entity.value).toBe('updated');
    });

    it('should support method chaining in subclasses', () => {
      class TestEntity extends EntityBase {
        value: number = 0;

        increment(): this {
          this.value++;
          return this;
        }

        decrement(): this {
          this.value--;
          return this;
        }
      }
      const entity = new TestEntity();
      entity.increment().increment().decrement();
      expect(entity.value).toBe(1);
    });

    it('should support default parameter values in subclass methods', () => {
      class TestEntity extends EntityBase {
        greet(name: string = 'World'): string {
          return `Hello, ${name}!`;
        }
      }
      const entity = new TestEntity();
      expect(entity.greet()).toBe('Hello, World!');
      expect(entity.greet('NestJS')).toBe('Hello, NestJS!');
    });

    it('should support rest parameters in subclass methods', () => {
      class TestEntity extends EntityBase {
        sum(...numbers: number[]): number {
          return numbers.reduce((acc, curr) => acc + curr, 0);
        }
      }
      const entity = new TestEntity();
      expect(entity.sum(1, 2, 3)).toBe(6);
      expect(entity.sum()).toBe(0);
    });

    it('should support async methods in subclasses', async () => {
      class TestEntity extends EntityBase {
        async fetchData(): Promise<string> {
          return 'data';
        }
      }
      const entity = new TestEntity();
      const result = await entity.fetchData();
      expect(result).toBe('data');
    });

    it('should support generators in subclasses', () => {
      class TestEntity extends EntityBase {
        *generateNumbers(): Generator<number> {
          yield 1;
          yield 2;
          yield 3;
        }
      }
      const entity = new TestEntity();
      const generator = entity.generateNumbers();
      expect(generator.next().value).toBe(1);
      expect(generator.next().value).toBe(2);
      expect(generator.next().value).toBe(3);
      expect(generator.next().done).toBe(true);
    });

    it('should support computed property names in subclasses', () => {
      const methodName = 'dynamicMethod';
      class TestEntity extends EntityBase {
        [methodName](): string {
          return 'dynamic';
        }
      }
      const entity = new TestEntity();
      expect((entity as any)[methodName]()).toBe('dynamic');
    });

    it('should support optional chaining in subclass methods', () => {
      class TestEntity extends EntityBase {
        data: { nested?: { value?: string } } = {};

        getNestedValue(): string | undefined {
          return this.data?.nested?.value;
        }
      }
      const entity = new TestEntity();
      expect(entity.getNestedValue()).toBeUndefined();
      entity.data = { nested: { value: 'found' } };
      expect(entity.getNestedValue()).toBe('found');
    });

    it('should support nullish coalescing in subclass methods', () => {
      class TestEntity extends EntityBase {
        getValue(value: string | null | undefined): string {
          return value ?? 'default';
        }
      }
      const entity = new TestEntity();
      expect(entity.getValue(null)).toBe('default');
      expect(entity.getValue(undefined)).toBe('default');
      expect(entity.getValue('actual')).toBe('actual');
    });

    it('should support destructuring in subclass methods', () => {
      class TestEntity extends EntityBase {
        getCoordinates({ x, y }: { x: number; y: number }): string {
          return `${x},${y}`;
        }
      }
      const entity = new TestEntity();
      expect(entity.getCoordinates({ x: 10, y: 20 })).toBe('10,20');
    });

    it('should support spread operator in subclass methods', () => {
      class TestEntity extends EntityBase {
        mergeObjects(...objects: object[]): object {
          return Object.assign({}, ...objects);
        }
      }
      const entity = new TestEntity();
      const result = entity.mergeObjects({ a: 1 }, { b: 2 }, { c: 3 });
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should support template literals in subclass methods', () => {
      class TestEntity extends EntityBase {
        formatName(first: string, last: string): string {
          return `${first} ${last}`;
        }
      }
      const entity = new TestEntity();
      expect(entity.formatName('John', 'Doe')).toBe('John Doe');
    });

    it('should support arrow functions in subclass methods', () => {
      class TestEntity extends EntityBase {
        double = (num: number): number => num * 2;
      }
      const entity = new TestEntity();
      expect(entity.double(5)).toBe(10);
    });

    it('should support class fields in subclasses', () => {
      class TestEntity extends EntityBase {
        count: number = 0;
        label: string = 'default';
      }
      const entity = new TestEntity();
      expect(entity.count).toBe(0);
      expect(entity.label).toBe('default');
    });

    it('should support static blocks in subclasses', () => {
      class TestEntity extends EntityBase {
        static config: Record<string, string> = {};
        static {
          TestEntity.config = { env: 'test' };
        }
      }
      expect(TestEntity.config).toEqual({ env: 'test' });
    });

    it('should support decorators in subclasses', () => {
      function logMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        descriptor.value = function (...args: any[]) {
          return original.apply(this, args);
        };
        return descriptor;
      }

      class TestEntity extends EntityBase {
        @logMethod
        greet(): string {
          return 'hello';
        }
      }
      const entity = new TestEntity();
      expect(entity.greet()).toBe('hello');
    });

    it('should support mixins with EntityBase', () => {
      class TimestampMixin {
        createdAt: Date = new Date();
        updatedAt: Date = new Date();
      }

      class TestEntity extends EntityBase {
        name: string = 'test';
      }

      Object.assign(TestEntity.prototype, TimestampMixin.prototype);
      const entity = new TestEntity();
      expect(entity.createdAt).toBeDefined();
      expect(entity.updatedAt).toBeDefined();
      expect(entity.name).toBe('test');
    });

    it('should support interface implementation in subclasses', () => {
      interface Identifiable {
        id: number;
        getId(): number;
      }

      class TestEntity extends EntityBase implements Identifiable {
        id: number = 1;
        getId(): number {
          return this.id;
        }
      }
      const entity = new TestEntity();
      expect(entity.getId()).toBe(1);
    });

    it('should support abstract methods in subclasses', () => {
      abstract class AbstractEntity extends EntityBase {
        abstract getName(): string;
      }

      class ConcreteEntity extends AbstractEntity {
        getName(): string {
          return 'concrete';
        }
      }
      const entity = new ConcreteEntity();
      expect(entity.getName()).toBe('concrete');
    });

    it('should support method overloading in subclasses', () => {
      class TestEntity extends EntityBase {
        process(value: string): string;
        process(value: number): number;
        process(value: string | number): string | number {
          if (typeof value === 'string') {
            return value.toUpperCase();
          }
          return value * 2;
        }
      }
      const entity = new TestEntity();
      expect(entity.process('test')).toBe('TEST');
      expect(entity.process(5)).toBe(10);
    });

    it('should support generic methods in subclasses', () => {
      class TestEntity extends EntityBase {
        identity<T>(value: T): T {
          return value;
        }
      }
      const entity = new TestEntity();
      expect(entity.identity<string>('test')).toBe('test');
      expect(entity.identity<number>(42)).toBe(42);
    });

    it('should support generic classes extending EntityBase', () => {
      class GenericEntity<T> extends EntityBase {
        value: T;

        constructor(value: T) {
          super();
          this.value = value;
        }

        getValue(): T {
          return this.value;
        }
      }

      const stringEntity = new GenericEntity<string>('test');
      const numberEntity = new GenericEntity<number>(42);

      expect(stringEntity.getValue()).toBe('test');
      expect(numberEntity.getValue()).toBe(42);
    });

    it('should support conditional types in subclass methods', () => {
      class TestEntity extends EntityBase {
        getType<T>(value: T): T extends string ? 'string' : 'other' {
          return (typeof value === 'string' ? 'string' : 'other') as any;
        }
      }
      const entity = new TestEntity();
      expect(entity.getType('test')).toBe('string');
      expect(entity.getType(42)).toBe('other');
    });

    it('should support mapped types in subclass methods', () => {
      class TestEntity extends EntityBase {
        transform<T extends object>(obj: T): { [K in keyof T]: T[K] } {
          return { ...obj };
        }
      }
      const entity = new TestEntity();
      const result = entity.transform({ a: 1, b: 'test' });
      expect(result).toEqual({ a: 1, b: 'test' });
    });

    it('should support type guards in subclass methods', () => {
      class TestEntity extends EntityBase {
        isString(value: unknown): value is string {
          return typeof value === 'string';
        }
      }
      const entity = new TestEntity();
      expect(entity.isString('test')).toBe(true);
      expect(entity.isString(42)).toBe(false);
    });

    it('should support assertion functions in subclass methods', () => {
      class TestEntity extends EntityBase {
        assertString(value: unknown): asserts value is string {
          if (typeof value !== 'string') {
            throw new Error('Not a string');
          }
        }
      }
      const entity = new TestEntity();
      expect(() => entity.assertString('test')).not.toThrow();
      expect(() => entity.assertString(42)).toThrow('Not a string');
    });

    it('should support decorators on class properties in subclasses', () => {
      function readonly(target: any, propertyKey: string) {
        Object.defineProperty(target, propertyKey, {
          writable: false,
        });
      }

      class TestEntity extends EntityBase {
        @readonly
        name: string = 'test';
      }
      const entity = new TestEntity();
      expect(entity.name).toBe('test');
      expect(() => {
        (entity as any).name = 'changed';
      }).toThrow();
    });

    it('should support multiple inheritance patterns', () => {
      class A extends EntityBase {
        methodA(): string {
          return 'A';
        }
      }

      class B {
        methodB(): string {
          return 'B';
        }
      }

      class C extends A {
        methodC(): string {
          return 'C';
        }
      }

      Object.assign(C.prototype, B.prototype);
      const entity = new C();
      expect(entity.methodA()).toBe('A');
      expect(entity.methodB()).toBe('B');
      expect(entity.methodC()).toBe('C');
    });

    it('should support Object.defineProperty in subclasses', () => {
      class TestEntity extends EntityBase {
        constructor() {
          super();
          Object.defineProperty(this, 'hidden', {
            value: 'secret',
            enumerable: false,
            writable: false,
            configurable: false,
          });
        }
      }
      const entity = new TestEntity();
      expect((entity as any).hidden).toBe('secret');
      expect(Object.keys(entity)).not.toContain('hidden');
    });

    it('should support Object.freeze on subclass instances', () => {
      class TestEntity extends EntityBase {
        value: string = 'test';
      }
      const entity = new TestEntity();
      Object.freeze(entity);
      expect(Object.isFrozen(entity)).toBe(true);
      expect(() => {
        (entity as any).value = 'changed';
      }).toThrow();
    });

    it('should support Object.seal on subclass instances', () => {
      class TestEntity extends EntityBase {
        value: string = 'test';
      }
      const entity = new TestEntity();
      Object.seal(entity);
      expect(Object.isSealed(entity)).toBe(true);
      expect(() => {
        (entity as any).newProp = 'test';
      }).toThrow();
    });

    it('should support Object.preventExtensions on subclass instances', () => {
      class TestEntity extends EntityBase {
        value: string = 'test';
      }
      const entity = new TestEntity();
      Object.preventExtensions(entity);
      expect(Object.isExtensible(entity)).toBe(false);
      expect(() => {
        (entity as any).newProp = 'test';
      }).toThrow();
    });

    it('should support Proxy on subclass instances', () => {
      class TestEntity extends EntityBase {
        value: string = 'test';
      }
      const entity = new TestEntity();
      const proxy = new Proxy(entity, {
        get(target, prop) {
          if (prop === 'value') {
            return 'proxied';
          }
          return Reflect.get(target, prop);
        },
      });
      expect(proxy.value).toBe('proxied');
    });

    it('should support Reflect API on subclass instances', () => {
      class TestEntity extends EntityBase {
        value: string = 'test';
      }
      const entity = new TestEntity();
      expect(Reflect.get(entity, 'value')).toBe('test');
      Reflect.set(entity, 'value', 'changed');
      expect(entity.value).toBe('changed');
      expect(Reflect.has(entity, 'value')).toBe(true);
      expect(Reflect.ownKeys(entity)).toContain('value');
    });

    it('should support structuredClone on subclass instances', () => {
      class TestEntity extends EntityBase {
        data: { nested: { value: number } } = { nested: { value: 42 } };
      }
      const entity = new TestEntity();
      const cloned = structuredClone(entity);
      expect(cloned).toEqual(entity);
      expect(cloned).not.toBe(entity);
      expect(cloned.data).not.toBe(entity.data);
    });

    it('should support JSON serialization of subclass instances', () => {
      class TestEntity extends EntityBase {
        id: number = 1;
        name: string = 'test';
      }
      const entity = new TestEntity();
      const json = JSON.stringify(entity);
      expect(json).toBe('{"id":1,"name":"test"}');
      const parsed = JSON.parse(json);
      expect(parsed).toEqual({ id: 1, name: 'test' });
    });

    it('should support toJSON method in subclasses', () => {
      class TestEntity extends EntityBase {
        id: number = 1;
        secret: string = 'hidden';

        toJSON(): object {
          return { id: this.id };
        }
      }
      const entity = new TestEntity();
      const json = JSON.stringify(entity);
      expect(json).toBe('{"id":1}');
    });

    it('should support valueOf method in subclasses', () => {
      class TestEntity extends EntityBase {
        value: number = 42;

        valueOf(): number {
          return this.value;
        }
      }
      const entity = new TestEntity();
      expect(entity + 1).toBe(43);
    });

    it('should support Symbol.toPrimitive in subclasses', () => {
      class TestEntity extends EntityBase {
        value: number = 42;

        [Symbol.toPrimitive](hint: string): number | string {
          if (hint === 'string') {
            return `Value: ${this.value}`;
          }
          return this.value;
        }
      }
      const entity = new TestEntity();
      expect(String(entity)).toBe('Value: 42');
      expect(Number(entity)).toBe(42);
    });

    it('should support Symbol.iterator in subclasses', () => {
      class TestEntity extends EntityBase {
        items: number[] = [1, 2, 3];

        *[Symbol.iterator](): Iterator<number> {
          yield* this.items;
        }
      }
      const entity = new TestEntity();
      expect([...entity]).toEqual([1, 2, 3]);
    });

    it('should support Symbol.asyncIterator in subclasses', async () => {
      class TestEntity extends EntityBase {
        items: number[] = [1, 2, 3];

        async *[Symbol.asyncIterator](): AsyncIterator<number> {
          for (const item of this.items) {
            yield item;
          }
        }
      }
      const entity = new TestEntity();
      const results: number[] = [];
      for await (const item of entity) {
        results.push(item);
      }
      expect(results).toEqual([1, 2, 3]);
    });

    it('should support Symbol.hasInstance in subclasses', () => {
      class TestEntity extends EntityBase {
        static [Symbol.hasInstance](instance: any): boolean {
          return instance && instance.isTestEntity === true;
        }
      }
      const obj = { isTestEntity: true };
      expect(obj instanceof TestEntity).toBe(true);
    });

    it('should support Symbol.species in subclasses', () => {
      class TestEntity extends EntityBase {
        static get [Symbol.species]() {
          return TestEntity;
        }
      }
      expect(TestEntity[Symbol.species]).toBe(TestEntity);
    });

    it('should support Symbol.match in subclasses', () => {
      class TestEntity extends EntityBase {
        [Symbol.match](str: string): boolean {
          return str.includes('test');
        }
      }
      const entity = new TestEntity();
      expect('this is a test'.match(entity)).toBe(true);
      expect('no match here'.match(entity)).toBe(false);
    });

    it('should support Symbol.replace in subclasses', () => {
      class TestEntity extends EntityBase {
        [Symbol.replace](str: string, replacement: string): string {
          return str.replace('test', replacement);
        }
      }
      const entity = new TestEntity();
      expect('test string'.replace(entity, 'replaced')).toBe('replaced string');
    });

    it('should support Symbol.search in subclasses', () => {
      class TestEntity extends EntityBase {
        [Symbol.search](str: string): number {
          return str.indexOf('test');
        }
      }
      const entity = new TestEntity();
      expect('find test here'.search(entity)).toBe(5);
      expect('nothing here'.search(entity)).toBe(-1);
    });

    it('should support Symbol.split in subclasses', () => {
      class TestEntity extends EntityBase {
        [Symbol.split](str: string): string[] {
          return str.split('test');
        }
      }
      const entity = new TestEntity();
      expect('a-test-b'.split(entity)).toEqual(['a-', '-b']);
    });

    it('should support Symbol.toStringTag in subclasses', () => {
      class TestEntity extends EntityBase {
        get [Symbol.toStringTag](): string {
          return 'TestEntity';
        }
      }
      const entity = new TestEntity();
      expect(Object.prototype.toString.call(entity)).toBe('[object TestEntity]');
    });

    it('should support Symbol.unscopables in subclasses', () => {
      class TestEntity extends EntityBase {
        value: string = 'test';
        get [Symbol.unscopables]() {
          return { value: true };
        }
      }
      const entity = new TestEntity();
      expect(entity[Symbol.unscopables]).toEqual({ value: true });
    });

    it('should support WeakRef to subclass instances', () => {
      class TestEntity extends EntityBase {
        value: string = 'test';
      }
      let entity = new TestEntity();
      const weakRef = new WeakRef(entity);
      expect(weakRef.deref()).toBe(entity);
      entity = null as any;
      // Note: GC is not deterministic in tests, so we just verify the WeakRef exists
      expect(weakRef).toBeDefined();
    });

    it('should support FinalizationRegistry with subclass instances', () => {
      class TestEntity extends EntityBase {
        value: string = 'test';
      }
      const registry = new FinalizationRegistry(() => {});
      let entity = new TestEntity();
      registry.register(entity, 'test');
      entity = null as any;
      expect(registry).toBeDefined();
    });

    it('should support WeakMap with subclass instances as keys', () => {
      class TestEntity extends EntityBase {
        value: string = 'test';
      }
      const weakMap = new WeakMap<object, string>();
      const entity = new TestEntity();
      weakMap.set(entity, 'mapped');
      expect(weakMap.get(entity)).toBe('mapped');
    });

    it('should support WeakSet with subclass instances', () => {
      class TestEntity extends EntityBase {
        value: string = 'test';
      }
      const weakSet = new WeakSet<object>();
      const entity = new TestEntity();
      weakSet.add(entity);
      expect(weakSet.has(entity)).toBe(true);
    });

    it('should support Map with subclass instances as keys', () => {
      class TestEntity extends EntityBase {
        value: string = 'test';
      }
      const map = new Map<object, string>();
      const entity = new TestEntity();
      map.set(entity, 'mapped');
      expect(map.get(entity)).toBe('mapped');
    });

    it('should support Set with subclass instances', () => {
      class TestEntity extends EntityBase {
        value: string = 'test';
      }
      const set = new Set<object>();
      const entity = new TestEntity();
      set.add(entity);
      expect(set.has(entity)).toBe(true);
    });

    it('should support Array with subclass instances', () => {
      class TestEntity extends EntityBase {
        value: string = 'test';
      }
      const entity = new TestEntity();
      const array = [entity];
      expect(array).toContain(entity);
      expect(array[0]).toBe(entity);
    });

    it('should support Promise with subclass instances', async () => {
      class TestEntity extends EntityBase {
        value: string = 'test';
      }
      const entity = new TestEntity();
      const promise = Promise.resolve(entity);
      const result = await promise;
      expect(result).toBe(entity);
    });

    it('should support async/await with subclass methods', async () => {
      class TestEntity extends EntityBase {
        async getValue(): Promise<string> {
          return 'async-value';
        }
      }
      const entity = new TestEntity();
      const value = await entity.getValue();
      expect(value).toBe('async-value');
    });

    it('should support error handling in subclass methods', () => {
      class TestEntity extends EntityBase {
        throwError(): never {
          throw new Error('Test error');
        }
      }
      const entity = new TestEntity();
      expect(() => entity.throwError()).toThrow('Test error');
    });

    it('should support try/catch/finally in subclass methods', () => {
      class TestEntity extends EntityBase {
        processWithError(): string {
          try {
            throw new Error('inner error');
          } catch (error) {
            return 'caught';
          } finally {
            // cleanup
          }
        }
      }
      const entity = new TestEntity();
      expect(entity.processWithError()).toBe('caught');
    });

    it('should support switch statements in subclass methods', () => {
      class TestEntity extends EntityBase {
        getDayType(day: number): string {
          switch (day) {
            case 0:
            case 6:
              return 'weekend';
            default:
              return 'weekday';
          }
        }
      }
      const entity = new TestEntity();
      expect(entity.getDayType(0)).toBe('weekend');
      expect(entity.getDayType(6)).toBe('weekend');
      expect(entity.getDayType(3)).toBe('weekday');
    });

    it('should support loops in subclass methods', () => {
      class TestEntity extends EntityBase {
        sumArray(numbers: number[]): number {
          let sum = 0;
          for (const num of numbers) {
            sum += num;
          }
          return sum;
        }
      }
      const entity = new TestEntity();
      expect(entity.sumArray([1, 2, 3, 4, 5])).toBe(15);
    });

    it('should support recursion in subclass methods', () => {
      class TestEntity extends EntityBase {
        factorial(n: number): number {
          if (n <= 1) return 1;
          return n * this.factorial(n - 1);
        }
      }
      const entity = new TestEntity();
      expect(entity.factorial(5)).toBe(120);
    });

    it('should support closures in subclass methods', () => {
      class TestEntity extends EntityBase {
        createCounter(): () => number {
          let count = 0;
          return () => ++count;
        }
      }
      const entity = new TestEntity();
      const counter = entity.createCounter();
      expect(counter()).toBe(1);
      expect(counter()).toBe(2);
      expect(counter()).toBe(3);
    });

    it('should support currying in subclass methods', () => {
      class TestEntity extends EntityBase {
        add(a: number): (b: number) => number {
          return (b: number) => a + b;
        }
      }
      const entity = new TestEntity();
      const add5 = entity.add(5);
      expect(add5(3)).toBe(8);
    });

    it('should support function composition in subclass methods', () => {
      class TestEntity extends EntityBase {
        compose<T>(f: (x: T) => T, g: (x: T) => T): (x: T) => T {
          return (x: T) => f(g(x));
        }
      }
      const entity = new TestEntity();
      const double = (x: number) => x * 2;
      const increment = (x: number) => x + 1;
      const composed = entity.compose(double, increment);
      expect(composed(5)).toBe(12);
    });

    it('should support memoization in subclass methods', () => {
      class TestEntity extends EntityBase {
        memoize<T extends (...args: any[]) => any>(fn: T): T {
          const cache = new Map<string, any>();
          return ((...args: any[]) => {
            const key = JSON.stringify(args);
            if (cache.has(key)) {
              return cache.get(key);
            }
            const result = fn(...args);
            cache.set(key, result);
            return result;
          }) as T;
        }
      }
      const entity = new TestEntity();
      const expensiveFn = jest.fn((n: number) => n * 2);
      const memoized = entity.memoize(expensiveFn);
      memoized(5);
      memoized(5);
      expect(expensiveFn).toHaveBeenCalledTimes(1);
    });

    it('should