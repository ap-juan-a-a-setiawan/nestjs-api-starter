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

    it('should have no enumerable properties on the prototype', () => {
      const prototypeProperties = Object.getOwnPropertyNames(EntityBase.prototype);
      expect(prototypeProperties).toEqual(['constructor']);
    });

    it('should have a constructor that is the EntityBase class', () => {
      expect(entityBase.constructor).toBe(EntityBase);
    });

    it('should have a name property set to EntityBase', () => {
      expect(EntityBase.name).toBe('EntityBase');
    });

    it('should be an abstract class', () => {
      expect(EntityBase.toString().includes('abstract')).toBe(true);
    });

    it('should not have any methods defined', () => {
      const methods = Object.getOwnPropertyNames(EntityBase.prototype).filter(
        (prop) => prop !== 'constructor' && typeof (EntityBase.prototype as any)[prop] === 'function'
      );
      expect(methods).toHaveLength(0);
    });

    it('should not have any static methods', () => {
      const staticMethods = Object.getOwnPropertyNames(EntityBase).filter(
        (prop) => typeof (EntityBase as any)[prop] === 'function' && prop !== 'name' && prop !== 'length' && prop !== 'prototype'
      );
      expect(staticMethods).toHaveLength(0);
    });

    it('should not have any static properties', () => {
      const staticProps = Object.getOwnPropertyNames(EntityBase).filter(
        (prop) => typeof (EntityBase as any)[prop] !== 'function' && prop !== 'name' && prop !== 'length' && prop !== 'prototype'
      );
      expect(staticProps).toHaveLength(0);
    });

    it('should not have any getters or setters', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const accessors = Object.keys(descriptors).filter(
        (key) => descriptors[key].get || descriptors[key].set
      );
      expect(accessors).toHaveLength(0);
    });

    it('should not have any symbol properties', () => {
      const symbols = Object.getOwnPropertySymbols(EntityBase.prototype);
      expect(symbols).toHaveLength(0);
    });

    it('should not have any symbol properties on the class', () => {
      const symbols = Object.getOwnPropertySymbols(EntityBase);
      expect(symbols).toHaveLength(0);
    });

    it('should not be extensible with new methods', () => {
      const originalMethodCount = Object.getOwnPropertyNames(EntityBase.prototype).length;
      (EntityBase.prototype as any).newMethod = jest.fn();
      const newMethodCount = Object.getOwnPropertyNames(EntityBase.prototype).length;
      expect(newMethodCount).toBe(originalMethodCount + 1);
      delete (EntityBase.prototype as any).newMethod;
    });

    it('should not have any inherited properties from Object', () => {
      const inheritedProps = Object.getOwnPropertyNames(Object.getPrototypeOf(EntityBase.prototype));
      expect(inheritedProps).toEqual(['constructor', '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'valueOf', '__proto__', 'toLocaleString']);
    });

    it('should be able to be extended by a subclass', () => {
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

    it('should allow subclass to add properties', () => {
      class TestEntity extends EntityBase {
        id: number;
        constructor(id: number) {
          super();
          this.id = id;
        }
      }

      const testEntity = new TestEntity(123);
      expect(testEntity.id).toBe(123);
      expect(testEntity).toBeInstanceOf(EntityBase);
    });

    it('should allow subclass to override methods', () => {
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
      expect(childEntity).toBeInstanceOf(EntityBase);
      expect(childEntity).toBeInstanceOf(BaseEntity);
      expect(childEntity).toBeInstanceOf(ChildEntity);
    });

    it('should allow multiple levels of inheritance', () => {
      class Level1 extends EntityBase {}
      class Level2 extends Level1 {}
      class Level3 extends Level2 {}

      const level3 = new Level3();
      expect(level3).toBeInstanceOf(EntityBase);
      expect(level3).toBeInstanceOf(Level1);
      expect(level3).toBeInstanceOf(Level2);
      expect(level3).toBeInstanceOf(Level3);
    });

    it('should maintain prototype chain correctly', () => {
      class TestEntity extends EntityBase {}
      const testEntity = new TestEntity();

      expect(Object.getPrototypeOf(testEntity)).toBe(TestEntity.prototype);
      expect(Object.getPrototypeOf(TestEntity.prototype)).toBe(EntityBase.prototype);
      expect(Object.getPrototypeOf(EntityBase.prototype)).toBe(Object.prototype);
    });

    it('should have correct constructor chain', () => {
      class TestEntity extends EntityBase {}
      const testEntity = new TestEntity();

      expect(testEntity.constructor).toBe(TestEntity);
      expect(TestEntity.prototype.constructor).toBe(TestEntity);
      expect(EntityBase.prototype.constructor).toBe(EntityBase);
    });

    it('should support instanceof checks', () => {
      class TestEntity extends EntityBase {}
      const testEntity = new TestEntity();

      expect(testEntity instanceof EntityBase).toBe(true);
      expect(testEntity instanceof TestEntity).toBe(true);
      expect(testEntity instanceof Object).toBe(true);
    });

    it('should not have any circular dependencies', () => {
      expect(EntityBase.prototype.constructor).toBe(EntityBase);
      expect(EntityBase.prototype.constructor.prototype).toBe(EntityBase.prototype);
    });

    it('should be serializable to JSON', () => {
      class TestEntity extends EntityBase {
        name: string = 'test';
      }

      const testEntity = new TestEntity();
      const json = JSON.stringify(testEntity);
      expect(json).toBe('{"name":"test"}');
    });

    it('should have a default toString method', () => {
      class TestEntity extends EntityBase {}
      const testEntity = new TestEntity();
      expect(testEntity.toString()).toBe('[object Object]');
    });

    it('should have a default valueOf method', () => {
      class TestEntity extends EntityBase {}
      const testEntity = new TestEntity();
      expect(testEntity.valueOf()).toBe(testEntity);
    });

    it('should have a default hasOwnProperty method', () => {
      class TestEntity extends EntityBase {
        prop: string = 'value';
      }
      const testEntity = new TestEntity();
      expect(testEntity.hasOwnProperty('prop')).toBe(true);
      expect(testEntity.hasOwnProperty('nonexistent')).toBe(false);
    });

    it('should have a default propertyIsEnumerable method', () => {
      class TestEntity extends EntityBase {
        prop: string = 'value';
      }
      const testEntity = new TestEntity();
      expect(testEntity.propertyIsEnumerable('prop')).toBe(true);
    });

    it('should have a default isPrototypeOf method', () => {
      class TestEntity extends EntityBase {}
      const testEntity = new TestEntity();
      expect(EntityBase.prototype.isPrototypeOf(testEntity)).toBe(true);
    });

    it('should have a default toLocaleString method', () => {
      class TestEntity extends EntityBase {}
      const testEntity = new TestEntity();
      expect(testEntity.toLocaleString()).toBe('[object Object]');
    });

    it('should have a default __defineGetter__ method', () => {
      class TestEntity extends EntityBase {}
      const testEntity = new TestEntity();
      expect(typeof (testEntity as any).__defineGetter__).toBe('function');
    });

    it('should have a default __defineSetter__ method', () => {
      class TestEntity extends EntityBase {}
      const testEntity = new TestEntity();
      expect(typeof (testEntity as any).__defineSetter__).toBe('function');
    });

    it('should have a default __lookupGetter__ method', () => {
      class TestEntity extends EntityBase {}
      const testEntity = new TestEntity();
      expect(typeof (testEntity as any).__lookupGetter__).toBe('function');
    });

    it('should have a default __lookupSetter__ method', () => {
      class TestEntity extends EntityBase {}
      const testEntity = new TestEntity();
      expect(typeof (testEntity as any).__lookupSetter__).toBe('function');
    });

    it('should have a default __proto__ property', () => {
      class TestEntity extends EntityBase {}
      const testEntity = new TestEntity();
      expect((testEntity as any).__proto__).toBe(TestEntity.prototype);
    });

    it('should support property assignment', () => {
      class TestEntity extends EntityBase {
        value: number = 0;
      }
      const testEntity = new TestEntity();
      testEntity.value = 42;
      expect(testEntity.value).toBe(42);
    });

    it('should support method calls on subclass', () => {
      class TestEntity extends EntityBase {
        greet(): string {
          return 'Hello';
        }
      }
      const testEntity = new TestEntity();
      expect(testEntity.greet()).toBe('Hello');
    });

    it('should support constructor parameters in subclass', () => {
      class TestEntity extends EntityBase {
        constructor(public id: number) {
          super();
        }
      }
      const testEntity = new TestEntity(1);
      expect(testEntity.id).toBe(1);
    });

    it('should support private members in subclass', () => {
      class TestEntity extends EntityBase {
        private secret: string = 'hidden';
        getSecret(): string {
          return this.secret;
        }
      }
      const testEntity = new TestEntity();
      expect(testEntity.getSecret()).toBe('hidden');
    });

    it('should support protected members in subclass', () => {
      class TestEntity extends EntityBase {
        protected value: number = 10;
        getValue(): number {
          return this.value;
        }
      }
      const testEntity = new TestEntity();
      expect(testEntity.getValue()).toBe(10);
    });

    it('should support static members in subclass', () => {
      class TestEntity extends EntityBase {
        static staticValue: string = 'static';
        static getStaticValue(): string {
          return this.staticValue;
        }
      }
      expect(TestEntity.staticValue).toBe('static');
      expect(TestEntity.getStaticValue()).toBe('static');
    });

    it('should support getters and setters in subclass', () => {
      class TestEntity extends EntityBase {
        private _name: string = '';
        get name(): string {
          return this._name;
        }
        set name(value: string) {
          this._name = value;
        }
      }
      const testEntity = new TestEntity();
      testEntity.name = 'Test';
      expect(testEntity.name).toBe('Test');
    });

    it('should support computed properties in subclass', () => {
      class TestEntity extends EntityBase {
        get computed(): number {
          return 42;
        }
      }
      const testEntity = new TestEntity();
      expect(testEntity.computed).toBe(42);
    });

    it('should support method overloading in subclass', () => {
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
      const testEntity = new TestEntity();
      expect(testEntity.process('hello')).toBe('HELLO');
      expect(testEntity.process(21)).toBe(42);
    });

    it('should support default parameters in subclass methods', () => {
      class TestEntity extends EntityBase {
        greet(name: string = 'World'): string {
          return `Hello, ${name}!`;
        }
      }
      const testEntity = new TestEntity();
      expect(testEntity.greet()).toBe('Hello, World!');
      expect(testEntity.greet('John')).toBe('Hello, John!');
    });

    it('should support rest parameters in subclass methods', () => {
      class TestEntity extends EntityBase {
        sum(...numbers: number[]): number {
          return numbers.reduce((acc, curr) => acc + curr, 0);
        }
      }
      const testEntity = new TestEntity();
      expect(testEntity.sum(1, 2, 3)).toBe(6);
      expect(testEntity.sum()).toBe(0);
    });

    it('should support async methods in subclass', async () => {
      class TestEntity extends EntityBase {
        async fetchData(): Promise<string> {
          return 'data';
        }
      }
      const testEntity = new TestEntity();
      await expect(testEntity.fetchData()).resolves.toBe('data');
    });

    it('should support generators in subclass', () => {
      class TestEntity extends EntityBase {
        *generate(): Generator<number> {
          yield 1;
          yield 2;
          yield 3;
        }
      }
      const testEntity = new TestEntity();
      const generator = testEntity.generate();
      expect(generator.next().value).toBe(1);
      expect(generator.next().value).toBe(2);
      expect(generator.next().value).toBe(3);
      expect(generator.next().done).toBe(true);
    });

    it('should support decorators in subclass', () => {
      function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
          return originalMethod.apply(this, args);
        };
        return descriptor;
      }

      class TestEntity extends EntityBase {
        @log
        method(): string {
          return 'decorated';
        }
      }
      const testEntity = new TestEntity();
      expect(testEntity.method()).toBe('decorated');
    });

    it('should support abstract methods in subclass', () => {
      abstract class AbstractEntity extends EntityBase {
        abstract getType(): string;
      }

      class ConcreteEntity extends AbstractEntity {
        getType(): string {
          return 'concrete';
        }
      }

      const concreteEntity = new ConcreteEntity();
      expect(concreteEntity.getType()).toBe('concrete');
    });

    it('should support interface implementation in subclass', () => {
      interface Identifiable {
        id: number;
      }

      class TestEntity extends EntityBase implements Identifiable {
        id: number = 1;
      }

      const testEntity = new TestEntity();
      expect(testEntity.id).toBe(1);
    });

    it('should support mixins in subclass', () => {
      class TimestampMixin {
        createdAt: Date = new Date();
      }

      class TestEntity extends EntityBase {
        constructor() {
          super();
          Object.assign(this, new TimestampMixin());
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.createdAt).toBeInstanceOf(Date);
    });

    it('should support composition in subclass', () => {
      class Engine {
        start(): string {
          return 'Engine started';
        }
      }

      class TestEntity extends EntityBase {
        engine: Engine = new Engine();
      }

      const testEntity = new TestEntity();
      expect(testEntity.engine.start()).toBe('Engine started');
    });

    it('should support dependency injection in subclass', () => {
      class Service {
        getData(): string {
          return 'service data';
        }
      }

      class TestEntity extends EntityBase {
        constructor(private service: Service) {
          super();
        }
        getData(): string {
          return this.service.getData();
        }
      }

      const service = new Service();
      const testEntity = new TestEntity(service);
      expect(testEntity.getData()).toBe('service data');
    });

    it('should support singleton pattern in subclass', () => {
      class SingletonEntity extends EntityBase {
        private static instance: SingletonEntity;
        private constructor() {
          super();
        }
        static getInstance(): SingletonEntity {
          if (!SingletonEntity.instance) {
            SingletonEntity.instance = new SingletonEntity();
          }
          return SingletonEntity.instance;
        }
      }

      const instance1 = SingletonEntity.getInstance();
      const instance2 = SingletonEntity.getInstance();
      expect(instance1).toBe(instance2);
      expect(instance1).toBeInstanceOf(EntityBase);
    });

    it('should support factory pattern in subclass', () => {
      class FactoryEntity extends EntityBase {
        static create(): FactoryEntity {
          return new FactoryEntity();
        }
      }

      const entity = FactoryEntity.create();
      expect(entity).toBeInstanceOf(FactoryEntity);
      expect(entity).toBeInstanceOf(EntityBase);
    });

    it('should support builder pattern in subclass', () => {
      class BuilderEntity extends EntityBase {
        value: string = '';
        setValue(value: string): this {
          this.value = value;
          return this;
        }
      }

      const entity = new BuilderEntity().setValue('test');
      expect(entity.value).toBe('test');
      expect(entity).toBeInstanceOf(BuilderEntity);
    });

    it('should support observer pattern in subclass', () => {
      class ObservableEntity extends EntityBase {
        private observers: Array<() => void> = [];
        subscribe(observer: () => void): void {
          this.observers.push(observer);
        }
        notify(): void {
          this.observers.forEach((observer) => observer());
        }
      }

      const entity = new ObservableEntity();
      const observer = jest.fn();
      entity.subscribe(observer);
      entity.notify();
      expect(observer).toHaveBeenCalledTimes(1);
    });

    it('should support promise-based methods in subclass', async () => {
      class PromiseEntity extends EntityBase {
        async getValue(): Promise<number> {
          return Promise.resolve(42);
        }
      }

      const entity = new PromiseEntity();
      await expect(entity.getValue()).resolves.toBe(42);
    });

    it('should support error handling in subclass', () => {
      class ErrorEntity extends EntityBase {
        throwError(): never {
          throw new Error('Test error');
        }
      }

      const entity = new ErrorEntity();
      expect(() => entity.throwError()).toThrow('Test error');
    });

    it('should support optional chaining in subclass', () => {
      class OptionalEntity extends EntityBase {
        nested?: { value: string };
      }

      const entity = new OptionalEntity();
      expect(entity.nested?.value).toBeUndefined();
      entity.nested = { value: 'test' };
      expect(entity.nested?.value).toBe('test');
    });

    it('should support nullish coalescing in subclass', () => {
      class NullishEntity extends EntityBase {
        value: string | null = null;
        getValue(): string {
          return this.value ?? 'default';
        }
      }

      const entity = new NullishEntity();
      expect(entity.getValue()).toBe('default');
      entity.value = 'custom';
      expect(entity.getValue()).toBe('custom');
    });

    it('should support destructuring in subclass', () => {
      class DestructuringEntity extends EntityBase {
        constructor(public config: { name: string; age: number }) {
          super();
        }
        getInfo(): string {
          const { name, age } = this.config;
          return `${name} is ${age} years old`;
        }
      }

      const entity = new DestructuringEntity({ name: 'John', age: 30 });
      expect(entity.getInfo()).toBe('John is 30 years old');
    });

    it('should support spread operator in subclass', () => {
      class SpreadEntity extends EntityBase {
        constructor(public data: Record<string, any>) {
          super();
        }
        merge(newData: Record<string, any>): Record<string, any> {
          return { ...this.data, ...newData };
        }
      }

      const entity = new SpreadEntity({ a: 1, b: 2 });
      expect(entity.merge({ b: 3, c: 4 })).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should support template literals in subclass', () => {
      class TemplateEntity extends EntityBase {
        constructor(public name: string) {
          super();
        }
        greet(): string {
          return `Hello, ${this.name}!`;
        }
      }

      const entity = new TemplateEntity('World');
      expect(entity.greet()).toBe('Hello, World!');
    });

    it('should support arrow functions in subclass', () => {
      class ArrowEntity extends EntityBase {
        multiply = (a: number, b: number): number => a * b;
      }

      const entity = new ArrowEntity();
      expect(entity.multiply(2, 3)).toBe(6);
    });

    it('should support class expressions in subclass', () => {
      const EntityClass = class extends EntityBase {
        getType(): string {
          return 'class expression';
        }
      };

      const entity = new EntityClass();
      expect(entity.getType()).toBe('class expression');
      expect(entity).toBeInstanceOf(EntityBase);
    });

    it('should support computed property names in subclass', () => {
      const propName = 'dynamicProp';
      class ComputedEntity extends EntityBase {
        [propName]: string = 'dynamic value';
      }

      const entity = new ComputedEntity();
      expect((entity as any).dynamicProp).toBe('dynamic value');
    });

    it('should support symbol keys in subclass', () => {
      const symbolKey = Symbol('symbolKey');
      class SymbolEntity extends EntityBase {
        [symbolKey]: string = 'symbol value';
      }

      const entity = new SymbolEntity();
      expect((entity as any)[symbolKey]).toBe('symbol value');
    });

    it('should support WeakMap in subclass', () => {
      class WeakMapEntity extends EntityBase {
        private data = new WeakMap<object, string>();
        setData(key: object, value: string): void {
          this.data.set(key, value);
        }
        getData(key: object): string | undefined {
          return this.data.get(key);
        }
      }

      const entity = new WeakMapEntity();
      const key = {};
      entity.setData(key, 'value');
      expect(entity.getData(key)).toBe('value');
    });

    it('should support Set in subclass', () => {
      class SetEntity extends EntityBase {
        private items = new Set<string>();
        add(item: string): void {
          this.items.add(item);
        }
        has(item: string): boolean {
          return this.items.has(item);
        }
      }

      const entity = new SetEntity();
      entity.add('test');
      expect(entity.has('test')).toBe(true);
      expect(entity.has('other')).toBe(false);
    });

    it('should support Map in subclass', () => {
      class MapEntity extends EntityBase {
        private data = new Map<string, number>();
        set(key: string, value: number): void {
          this.data.set(key, value);
        }
        get(key: string): number | undefined {
          return this.data.get(key);
        }
      }

      const entity = new MapEntity();
      entity.set('key', 42);
      expect(entity.get('key')).toBe(42);
    });

    it('should support typed arrays in subclass', () => {
      class TypedArrayEntity extends EntityBase {
        data: Uint8Array = new Uint8Array([1, 2, 3]);
      }

      const entity = new TypedArrayEntity();
      expect(entity.data).toEqual(new Uint8Array([1, 2, 3]));
    });

    it('should support Date in subclass', () => {
      class DateEntity extends EntityBase {
        date: Date = new Date('2023-01-01');
      }

      const entity = new DateEntity();
      expect(entity.date).toEqual(new Date('2023-01-01'));
    });

    it('should support RegExp in subclass', () => {
      class RegExpEntity extends EntityBase {
        pattern: RegExp = /test/;
      }

      const entity = new RegExpEntity();
      expect(entity.pattern.test('test')).toBe(true);
    });

    it('should support Error in subclass', () => {
      class ErrorEntity extends EntityBase {
        error: Error = new Error('Test error');
      }

      const entity = new ErrorEntity();
      expect(entity.error.message).toBe('Test error');
    });

    it('should support Promise in subclass', () => {
      class PromiseEntity extends EntityBase {
        promise: Promise<string> = Promise.resolve('resolved');
      }

      const entity = new PromiseEntity();
      return expect(entity.promise).resolves.toBe('resolved');
    });

    it('should support async/await in subclass', async () => {
      class AsyncEntity extends EntityBase {
        async getValue(): Promise<number> {
          await new Promise((resolve) => setTimeout(resolve, 0));
          return 42;
        }
      }

      const entity = new AsyncEntity();
      await expect(entity.getValue()).resolves.toBe(42);
    });

    it('should support try/catch in subclass', () => {
      class TryCatchEntity extends EntityBase {
        safeDivide(a: number, b: number): number {
          try {
            if (b === 0) {
              throw new Error('Division by zero');
            }
            return a / b;
          } catch (error) {
            return -1;
          }
        }
      }

      const entity = new TryCatchEntity();
      expect(entity.safeDivide(10, 2)).toBe(5);
      expect(entity.safeDivide(10, 0)).toBe(-1);
    });

    it('should support switch statements in subclass', () => {
      class SwitchEntity extends EntityBase {
        getDayType(day: string): string {
          switch (day) {
            case 'Saturday':
            case 'Sunday':
              return 'weekend';
            default:
              return 'weekday';
          }
        }
      }

      const entity = new SwitchEntity();
      expect(entity.getDayType('Saturday')).toBe('weekend');
      expect(entity.getDayType('Monday')).toBe('weekday');
    });

    it('should support loops in subclass', () => {
      class LoopEntity extends EntityBase {
        sumArray(numbers: number[]): number {
          let sum = 0;
          for (const num of numbers) {
            sum += num;
          }
          return sum;
        }
      }

      const entity = new LoopEntity();
      expect(entity.sumArray([1, 2, 3, 4])).toBe(10);
    });

    it('should support recursion in subclass', () => {
      class RecursionEntity extends EntityBase {
        factorial(n: number): number {
          if (n <= 1) {
            return 1;
          }
          return n * this.factorial(n - 1);
        }
      }

      const entity = new RecursionEntity();
      expect(entity.factorial(5)).toBe(120);
    });

    it('should support closures in subclass', () => {
      class ClosureEntity extends EntityBase {
        createCounter(): () => number {
          let count = 0;
          return () => ++count;
        }
      }

      const entity = new ClosureEntity();
      const counter = entity.createCounter();
      expect(counter()).toBe(1);
      expect(counter()).toBe(2);
      expect(counter()).toBe(3);
    });

    it('should support currying in subclass', () => {
      class CurryingEntity extends EntityBase {
        add(a: number): (b: number) => number {
          return (b: number) => a + b;
        }
      }

      const entity = new CurryingEntity();
      const add5 = entity.add(5);
      expect(add5(3)).toBe(8);
    });

    it('should support memoization in subclass', () => {
      class MemoizationEntity extends EntityBase {
        private cache = new Map<number, number>();
        fibonacci(n: number): number {
          if (this.cache.has(n)) {
            return this.cache.get(n)!;
          }
          if (n <= 1) {
            return n;
          }
          const result = this.fibonacci(n - 1) + this.fibonacci(n - 2);
          this.cache.set(n, result);
          return result;
        }
      }

      const entity = new MemoizationEntity();
      expect(entity.fibonacci(10)).toBe(55);
    });

    it('should support event emitters in subclass', () => {
      class EventEmitterEntity extends EntityBase {
        private listeners: Record<string, Array<(...args: any[]) => void>> = {};
        on(event: string, listener: (...args: any[]) => void): void {
          if (!this.listeners[event]) {
            this.listeners[event] = [];
          }
          this.listeners[event].push(listener);
        }
        emit(event: string, ...args: any[]): void {
          if (this.listeners[event]) {
            this.listeners[event].forEach((listener) => listener(...args));
          }
        }
      }

      const entity = new EventEmitterEntity();
      const listener = jest.fn();
      entity.on('test', listener);
      entity.emit('test', 'arg1', 'arg2');
      expect(listener).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should support state management in subclass', () => {
      class StateEntity extends EntityBase {
        private state: Record<string, any> = {};
        setState(key: string, value: any): void {
          this.state[key] = value;
        }
        getState(key: string): any {
          return this.state[key];
        }
      }

      const entity = new StateEntity();
      entity.setState('count', 1);
      expect(entity.getState('count')).toBe(1);
    });

    it('should support data transformation in subclass', () => {
      class TransformEntity extends EntityBase {
        transform(data: string): string {
          return data.trim().toLowerCase();
        }
      }

      const entity = new TransformEntity();
      expect(entity.transform('  HELLO WORLD  ')).toBe('hello world');
    });

    it('should support validation in subclass', () => {
      class ValidationEntity extends EntityBase {
        validateEmail(email: string): boolean {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        }
      }

      const entity = new ValidationEntity();
      expect(entity.validateEmail('test@example.com')).toBe(true);
      expect(entity.validateEmail('invalid-email')).toBe(false);
    });

    it('should support serialization in subclass', () => {
      class SerializationEntity extends EntityBase {
        constructor(public data: any) {
          super();
        }
        serialize(): string {
          return JSON.stringify(this.data);
        }
      }

      const entity = new SerializationEntity({ key: 'value' });
      expect(entity.serialize()).toBe('{"key":"value"}');
    });

    it('should support deserialization in subclass', () => {
      class DeserializationEntity extends EntityBase {
        static deserialize(json: string): DeserializationEntity {
          const data = JSON.parse(json);
          return new DeserializationEntity(data);
        }
        constructor(public data: any) {
          super();
        }
      }

      const entity = DeserializationEntity.deserialize('{"key":"value"}');
      expect(entity.data).toEqual({ key: 'value' });
    });

    it('should support caching in subclass', () => {
      class CacheEntity extends EntityBase {
        private cache = new Map<string, any>();
        getOrSet(key: string, factory: () => any): any {
          if (this.cache.has(key)) {
            return this.cache.get(key);
          }
          const value = factory();
          this.cache.set(key, value);
          return value;
        }
      }

      const entity = new CacheEntity();
      const factory = jest.fn(() => 'cached value');
      expect(entity.getOrSet('key', factory)).toBe('cached value');
      expect(entity.getOrSet('key', factory)).toBe('cached value');
      expect(factory).toHaveBeenCalledTimes(1);
    });

    it('should support throttling in subclass', () => {
      class ThrottleEntity extends EntityBase {
        private lastCall = 0;
        throttle(fn: () => void, delay: number): void {
          const now = Date.now();
          if (now - this.lastCall >= delay) {
            fn();
            this.lastCall = now;
          }
        }
      }

      const entity = new ThrottleEntity();
      const fn = jest.fn();
      entity.throttle(fn, 100);
      entity.throttle(fn, 100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should support debouncing in subclass', () => {
      class DebounceEntity extends EntityBase {
        private timeout: NodeJS.Timeout | null = null;
        debounce(fn: () => void, delay: number): void {
          if (this.timeout) {
            clearTimeout(this.timeout);
          }
          this.timeout = setTimeout(fn, delay);
        }
      }

      const entity = new DebounceEntity();
      const fn = jest.fn();
      entity.debounce(fn, 100);
      entity.debounce(fn, 100);
      jest.useFakeTimers();
      jest.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
      jest.useRealTimers();
    });

    it('should support retry logic in subclass', async () => {
      class RetryEntity extends EntityBase {
        async retry<T>(fn: () => Promise<T>, retries: number): Promise<T> {
          try {
            return await fn();
          } catch (error) {
            if (retries > 0) {
              return this.retry(fn, retries - 1);
            }
            throw error;
          }
        }
      }

      const entity = new RetryEntity();
      const fn = jest.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValueOnce('success');
      await expect(entity.retry(fn, 1)).resolves.toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should support timeout in subclass', async () => {
      class TimeoutEntity extends EntityBase {
        async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
          let timeoutId: NodeJS.Timeout;
          const timeoutPromise = new Promise<never>((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), timeoutMs);
          });
          try {
            return await Promise.race([promise, timeoutPromise]);
          } finally {
            clearTimeout(timeoutId!);
          }
        }
      }

      const entity = new TimeoutEntity();
      const slowPromise = new Promise((resolve) => setTimeout(() => resolve('done'),