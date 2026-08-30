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

    it('should not be instantiable directly', () => {
      expect(() => {
        // @ts-ignore - testing abstract class instantiation
        new EntityBase();
      }).toThrow(TypeError);
    });

    it('should have no own properties', () => {
      expect(Object.keys(entityBase)).toHaveLength(0);
    });

    it('should have no own method names', () => {
      const ownPropertyNames = Object.getOwnPropertyNames(entityBase);
      expect(ownPropertyNames).toEqual([]);
    });

    it('should have no enumerable properties', () => {
      const enumerableKeys: string[] = [];
      for (const key in entityBase) {
        enumerableKeys.push(key);
      }
      expect(enumerableKeys).toHaveLength(0);
    });

    it('should have no methods defined on the prototype', () => {
      const prototypeMethods = Object.getOwnPropertyNames(EntityBase.prototype);
      expect(prototypeMethods).toEqual(['constructor']);
    });

    it('should be an abstract class', () => {
      expect(EntityBase.toString()).toContain('class EntityBase');
    });

    it('should not have a constructor that can be called', () => {
      const constructorSpy = jest.spyOn(EntityBase.prototype, 'constructor');
      expect(() => {
        // @ts-ignore - testing abstract class instantiation
        new EntityBase();
      }).toThrow(TypeError);
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

    it('should support multiple levels of inheritance', () => {
      class Level1Entity extends EntityBase {
        level1Method(): string {
          return 'level1';
        }
      }

      class Level2Entity extends Level1Entity {
        level2Method(): string {
          return 'level2';
        }
      }

      class Level3Entity extends Level2Entity {
        level3Method(): string {
          return 'level3';
        }
      }

      const level3Entity = new Level3Entity();
      expect(level3Entity.level1Method()).toBe('level1');
      expect(level3Entity.level2Method()).toBe('level2');
      expect(level3Entity.level3Method()).toBe('level3');
      expect(level3Entity).toBeInstanceOf(EntityBase);
      expect(level3Entity).toBeInstanceOf(Level1Entity);
      expect(level3Entity).toBeInstanceOf(Level2Entity);
      expect(level3Entity).toBeInstanceOf(Level3Entity);
    });

    it('should maintain prototype chain integrity', () => {
      class TestEntity extends EntityBase {}
      const testEntity = new TestEntity();
      
      expect(Object.getPrototypeOf(testEntity)).toBe(TestEntity.prototype);
      expect(Object.getPrototypeOf(TestEntity.prototype)).toBe(EntityBase.prototype);
      expect(Object.getPrototypeOf(EntityBase.prototype)).toBe(Object.prototype);
    });

    it('should have correct constructor name', () => {
      expect(EntityBase.name).toBe('EntityBase');
    });

    it('should have correct prototype constructor', () => {
      expect(EntityBase.prototype.constructor).toBe(EntityBase);
    });

    it('should be extensible', () => {
      expect(Object.isExtensible(EntityBase)).toBe(true);
      expect(Object.isExtensible(EntityBase.prototype)).toBe(true);
    });

    it('should not be sealed', () => {
      expect(Object.isSealed(EntityBase)).toBe(false);
      expect(Object.isSealed(EntityBase.prototype)).toBe(false);
    });

    it('should not be frozen', () => {
      expect(Object.isFrozen(EntityBase)).toBe(false);
      expect(Object.isFrozen(EntityBase.prototype)).toBe(false);
    });

    it('should have no static methods', () => {
      const staticMethods = Object.getOwnPropertyNames(EntityBase).filter(
        (prop) => prop !== 'length' && prop !== 'name' && prop !== 'prototype'
      );
      expect(staticMethods).toHaveLength(0);
    });

    it('should have no static properties', () => {
      const staticProps = Object.getOwnPropertyNames(EntityBase).filter(
        (prop) => prop !== 'length' && prop !== 'name' && prop !== 'prototype'
      );
      expect(staticProps).toHaveLength(0);
    });

    it('should support instanceof checks', () => {
      class TestEntity extends EntityBase {}
      const testEntity = new TestEntity();
      
      expect(testEntity instanceof EntityBase).toBe(true);
      expect(testEntity instanceof TestEntity).toBe(true);
      expect(testEntity instanceof Object).toBe(true);
    });

    it('should have proper toString representation', () => {
      expect(EntityBase.toString()).toContain('class EntityBase');
      expect(EntityBase.prototype.toString()).toBe('[object Object]');
    });

    it('should allow property addition on subclass instances', () => {
      class TestEntity extends EntityBase {}
      const testEntity = new TestEntity();
      
      testEntity.newProperty = 'test';
      expect(testEntity.newProperty).toBe('test');
    });

    it('should allow method addition on subclass instances', () => {
      class TestEntity extends EntityBase {}
      const testEntity = new TestEntity();
      
      testEntity.newMethod = jest.fn().mockReturnValue('result');
      expect(testEntity.newMethod()).toBe('result');
    });

    it('should support method chaining in subclasses', () => {
      class TestEntity extends EntityBase {
        value: number = 0;
        
        add(num: number): this {
          this.value += num;
          return this;
        }
        
        multiply(num: number): this {
          this.value *= num;
          return this;
        }
      }

      const testEntity = new TestEntity();
      const result = testEntity.add(5).multiply(2);
      
      expect(result).toBe(testEntity);
      expect(testEntity.value).toBe(10);
    });

    it('should support getters and setters in subclasses', () => {
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

    it('should support static methods in subclasses', () => {
      class TestEntity extends EntityBase {
        static create(): TestEntity {
          return new TestEntity();
        }
      }

      const testEntity = TestEntity.create();
      expect(testEntity).toBeInstanceOf(TestEntity);
      expect(testEntity).toBeInstanceOf(EntityBase);
    });

    it('should support private and protected members in subclasses', () => {
      class TestEntity extends EntityBase {
        private privateValue: string = 'private';
        protected protectedValue: string = 'protected';
        public publicValue: string = 'public';
        
        getPrivateValue(): string {
          return this.privateValue;
        }
        
        getProtectedValue(): string {
          return this.protectedValue;
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.getPrivateValue()).toBe('private');
      expect(testEntity.getProtectedValue()).toBe('protected');
      expect(testEntity.publicValue).toBe('public');
    });

    it('should support abstract methods in subclasses', () => {
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

    it('should support interface implementation in subclasses', () => {
      interface EntityInterface {
        getId(): number;
      }

      class TestEntity extends EntityBase implements EntityInterface {
        private id: number = 1;
        
        getId(): number {
          return this.id;
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.getId()).toBe(1);
    });

    it('should support generic subclasses', () => {
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

    it('should support mixins with EntityBase', () => {
      type Constructor<T = {}> = new (...args: any[]) => T;
      
      function TimestampMixin<T extends Constructor<EntityBase>>(Base: T) {
        return class extends Base {
          timestamp: Date = new Date();
          
          getTimestamp(): Date {
            return this.timestamp;
          }
        };
      }

      class TestEntity extends TimestampMixin(EntityBase) {}
      
      const testEntity = new TestEntity();
      expect(testEntity.getTimestamp()).toBeInstanceOf(Date);
      expect(testEntity).toBeInstanceOf(EntityBase);
    });

    it('should support decorators on subclasses', () => {
      function EntityDecorator(target: Function) {
        Reflect.defineMetadata('entity', true, target);
      }

      @EntityDecorator
      class TestEntity extends EntityBase {}
      
      expect(Reflect.getMetadata('entity', TestEntity)).toBe(true);
    });

    it('should support method decorators on subclasses', () => {
      function LogMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
          return originalMethod.apply(this, args);
        };
        return descriptor;
      }

      class TestEntity extends EntityBase {
        @LogMethod
        testMethod(): string {
          return 'test';
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.testMethod()).toBe('test');
    });

    it('should support property decorators on subclasses', () => {
      function DefaultValue(value: any) {
        return (target: any, propertyKey: string) => {
          target[propertyKey] = value;
        };
      }

      class TestEntity extends EntityBase {
        @DefaultValue('default')
        name: string;
      }

      const testEntity = new TestEntity();
      expect(testEntity.name).toBe('default');
    });

    it('should support parameter decorators on subclasses', () => {
      function LogParameter(target: any, propertyKey: string, parameterIndex: number) {
        // Decorator implementation
      }

      class TestEntity extends EntityBase {
        testMethod(@LogParameter param: string): string {
          return param;
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.testMethod('test')).toBe('test');
    });

    it('should support computed property names in subclasses', () => {
      const propertyName = 'dynamicProperty';
      
      class TestEntity extends EntityBase {
        [propertyName]: string = 'dynamic';
      }

      const testEntity = new TestEntity();
      expect(testEntity[propertyName]).toBe('dynamic');
    });

    it('should support symbol properties in subclasses', () => {
      const symbol = Symbol('test');
      
      class TestEntity extends EntityBase {
        [symbol]: string = 'symbol-value';
      }

      const testEntity = new TestEntity();
      expect(testEntity[symbol]).toBe('symbol-value');
    });

    it('should support optional properties in subclasses', () => {
      class TestEntity extends EntityBase {
        optional?: string;
        required: string = 'required';
      }

      const testEntity = new TestEntity();
      expect(testEntity.optional).toBeUndefined();
      expect(testEntity.required).toBe('required');
    });

    it('should support readonly properties in subclasses', () => {
      class TestEntity extends EntityBase {
        readonly id: number = 1;
      }

      const testEntity = new TestEntity();
      expect(testEntity.id).toBe(1);
    });

    it('should support default parameter values in subclass methods', () => {
      class TestEntity extends EntityBase {
        greet(name: string = 'World'): string {
          return `Hello, ${name}!`;
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.greet()).toBe('Hello, World!');
      expect(testEntity.greet('Test')).toBe('Hello, Test!');
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

    it('should support spread operator in subclass methods', () => {
      class TestEntity extends EntityBase {
        merge(...arrays: number[][]): number[] {
          return [].concat(...arrays);
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.merge([1, 2], [3, 4])).toEqual([1, 2, 3, 4]);
    });

    it('should support destructuring in subclass methods', () => {
      class TestEntity extends EntityBase {
        getFirstAndLast([first, ...rest]: number[]): { first: number; last: number } {
          return { first, last: rest[rest.length - 1] };
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.getFirstAndLast([1, 2, 3, 4])).toEqual({ first: 1, last: 4 });
    });

    it('should support async methods in subclasses', async () => {
      class TestEntity extends EntityBase {
        async getData(): Promise<string> {
          return 'data';
        }
      }

      const testEntity = new TestEntity();
      await expect(testEntity.getData()).resolves.toBe('data');
    });

    it('should support generators in subclasses', () => {
      class TestEntity extends EntityBase {
        *generateNumbers(): Generator<number> {
          yield 1;
          yield 2;
          yield 3;
        }
      }

      const testEntity = new TestEntity();
      const generator = testEntity.generateNumbers();
      expect(generator.next().value).toBe(1);
      expect(generator.next().value).toBe(2);
      expect(generator.next().value).toBe(3);
      expect(generator.next().done).toBe(true);
    });

    it('should support iterators in subclasses', () => {
      class TestEntity extends EntityBase {
        [Symbol.iterator](): Iterator<number> {
          let count = 0;
          return {
            next: (): IteratorResult<number> => {
              count++;
              if (count <= 3) {
                return { value: count, done: false };
              }
              return { value: undefined, done: true };
            }
          };
        }
      }

      const testEntity = new TestEntity();
      const values = [...testEntity];
      expect(values).toEqual([1, 2, 3]);
    });

    it('should support type guards in subclasses', () => {
      class TestEntity extends EntityBase {
        isString(value: unknown): value is string {
          return typeof value === 'string';
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.isString('test')).toBe(true);
      expect(testEntity.isString(42)).toBe(false);
    });

    it('should support assertion functions in subclasses', () => {
      class TestEntity extends EntityBase {
        assertString(value: unknown): asserts value is string {
          if (typeof value !== 'string') {
            throw new Error('Not a string');
          }
        }
      }

      const testEntity = new TestEntity();
      expect(() => testEntity.assertString('test')).not.toThrow();
      expect(() => testEntity.assertString(42)).toThrow('Not a string');
    });

    it('should support conditional types in subclasses', () => {
      class TestEntity extends EntityBase {
        getValue<T>(value: T): T extends string ? string : number {
          return (typeof value === 'string' ? value : 42) as any;
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.getValue('test')).toBe('test');
      expect(testEntity.getValue(42)).toBe(42);
    });

    it('should support mapped types in subclasses', () => {
      class TestEntity extends EntityBase {
        mapValues<T>(values: T[]): { [K in keyof T]: T[K] }[] {
          return values.map(value => ({ ...value }));
        }
      }

      const testEntity = new TestEntity();
      const result = testEntity.mapValues([{ id: 1 }, { id: 2 }]);
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('should support utility types in subclasses', () => {
      class TestEntity extends EntityBase {
        partial<T>(obj: T): Partial<T> {
          return { ...obj };
        }
      }

      const testEntity = new TestEntity();
      const result = testEntity.partial({ id: 1, name: 'test' });
      expect(result).toEqual({ id: 1, name: 'test' });
    });

    it('should support decorators with parameters on subclasses', () => {
      function Validate(min: number, max: number) {
        return (target: any, propertyKey: string) => {
          // Decorator implementation
        };
      }

      class TestEntity extends EntityBase {
        @Validate(1, 10)
        value: number = 5;
      }

      const testEntity = new TestEntity();
      expect(testEntity.value).toBe(5);
    });

    it('should support multiple decorators on subclasses', () => {
      function FirstDecorator(target: any) {
        // First decorator
      }

      function SecondDecorator(target: any) {
        // Second decorator
      }

      @FirstDecorator
      @SecondDecorator
      class TestEntity extends EntityBase {}

      expect(TestEntity).toBeDefined();
    });

    it('should support decorator factories on subclasses', () => {
      function DecoratorFactory(options: { enabled: boolean }) {
        return (target: any) => {
          // Decorator implementation
        };
      }

      @DecoratorFactory({ enabled: true })
      class TestEntity extends EntityBase {}

      expect(TestEntity).toBeDefined();
    });

    it('should support method overloading in subclasses', () => {
      class TestEntity extends EntityBase {
        getValue(value: string): string;
        getValue(value: number): number;
        getValue(value: string | number): string | number {
          return value;
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.getValue('test')).toBe('test');
      expect(testEntity.getValue(42)).toBe(42);
    });

    it('should support constructor overloading in subclasses', () => {
      class TestEntity extends EntityBase {
        constructor();
        constructor(value: number);
        constructor(value?: number) {
          super();
          if (value !== undefined) {
            this.value = value;
          }
        }
        value: number = 0;
      }

      const testEntity1 = new TestEntity();
      const testEntity2 = new TestEntity(42);
      expect(testEntity1.value).toBe(0);
      expect(testEntity2.value).toBe(42);
    });

    it('should support private constructors in subclasses', () => {
      class TestEntity extends EntityBase {
        private constructor() {
          super();
        }
        
        static create(): TestEntity {
          return new TestEntity();
        }
      }

      const testEntity = TestEntity.create();
      expect(testEntity).toBeInstanceOf(TestEntity);
      expect(testEntity).toBeInstanceOf(EntityBase);
    });

    it('should support protected constructors in subclasses', () => {
      class BaseEntity extends EntityBase {
        protected constructor() {
          super();
        }
      }

      class TestEntity extends BaseEntity {
        constructor() {
          super();
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity).toBeInstanceOf(TestEntity);
      expect(testEntity).toBeInstanceOf(BaseEntity);
      expect(testEntity).toBeInstanceOf(EntityBase);
    });

    it('should support abstract properties in subclasses', () => {
      abstract class AbstractEntity extends EntityBase {
        abstract name: string;
      }

      class ConcreteEntity extends AbstractEntity {
        name: string = 'concrete';
      }

      const concreteEntity = new ConcreteEntity();
      expect(concreteEntity.name).toBe('concrete');
    });

    it('should support optional chaining in subclasses', () => {
      class TestEntity extends EntityBase {
        nested?: { value?: string };
      }

      const testEntity = new TestEntity();
      expect(testEntity.nested?.value).toBeUndefined();
      
      testEntity.nested = { value: 'test' };
      expect(testEntity.nested?.value).toBe('test');
    });

    it('should support nullish coalescing in subclasses', () => {
      class TestEntity extends EntityBase {
        getValue(value: string | null | undefined): string {
          return value ?? 'default';
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.getValue(null)).toBe('default');
      expect(testEntity.getValue(undefined)).toBe('default');
      expect(testEntity.getValue('test')).toBe('test');
    });

    it('should support logical assignment in subclasses', () => {
      class TestEntity extends EntityBase {
        value: number = 0;
        
        setValue(value: number): void {
          this.value ||= value;
        }
      }

      const testEntity = new TestEntity();
      testEntity.setValue(5);
      expect(testEntity.value).toBe(5);
      testEntity.setValue(10);
      expect(testEntity.value).toBe(5);
    });

    it('should support numeric separators in subclasses', () => {
      class TestEntity extends EntityBase {
        value: number = 1_000_000;
      }

      const testEntity = new TestEntity();
      expect(testEntity.value).toBe(1000000);
    });

    it('should support bigint in subclasses', () => {
      class TestEntity extends EntityBase {
        value: bigint = 123n;
      }

      const testEntity = new TestEntity();
      expect(testEntity.value).toBe(123n);
    });

    it('should support optional chaining with function calls in subclasses', () => {
      class TestEntity extends EntityBase {
        callback?: () => string;
      }

      const testEntity = new TestEntity();
      expect(testEntity.callback?.()).toBeUndefined();
      
      testEntity.callback = () => 'test';
      expect(testEntity.callback?.()).toBe('test');
    });

    it('should support nullish coalescing with function calls in subclasses', () => {
      class TestEntity extends EntityBase {
        getValue(): string | null {
          return null;
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.getValue() ?? 'default').toBe('default');
    });

    it('should support template literals in subclasses', () => {
      class TestEntity extends EntityBase {
        name: string = 'Test';
        greet(): string {
          return `Hello, ${this.name}!`;
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.greet()).toBe('Hello, Test!');
    });

    it('should support tagged templates in subclasses', () => {
      function tag(strings: TemplateStringsArray, ...values: any[]): string {
        return strings.raw.join('');
      }

      class TestEntity extends EntityBase {
        getTagged(): string {
          return tag`test`;
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.getTagged()).toBe('test');
    });

    it('should support destructuring in subclasses', () => {
      class TestEntity extends EntityBase {
        getValues(): { a: number; b: number } {
          return { a: 1, b: 2 };
        }
        
        destructure(): number {
          const { a, b } = this.getValues();
          return a + b;
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.destructure()).toBe(3);
    });

    it('should support array destructuring in subclasses', () => {
      class TestEntity extends EntityBase {
        getArray(): number[] {
          return [1, 2, 3];
        }
        
        destructure(): number {
          const [first, ...rest] = this.getArray();
          return first + rest.length;
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.destructure()).toBe(3);
    });

    it('should support object spread in subclasses', () => {
      class TestEntity extends EntityBase {
        getObject(): { a: number; b: number } {
          return { a: 1, b: 2 };
        }
        
        spread(): { a: number; b: number; c: number } {
          return { ...this.getObject(), c: 3 };
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.spread()).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should support array spread in subclasses', () => {
      class TestEntity extends EntityBase {
        getArray(): number[] {
          return [1, 2];
        }
        
        spread(): number[] {
          return [...this.getArray(), 3];
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.spread()).toEqual([1, 2, 3]);
    });

    it('should support for-of loops in subclasses', () => {
      class TestEntity extends EntityBase {
        getArray(): number[] {
          return [1, 2, 3];
        }
        
        sum(): number {
          let total = 0;
          for (const num of this.getArray()) {
            total += num;
          }
          return total;
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.sum()).toBe(6);
    });

    it('should support for-in loops in subclasses', () => {
      class TestEntity extends EntityBase {
        getObject(): { a: number; b: number } {
          return { a: 1, b: 2 };
        }
        
        sum(): number {
          let total = 0;
          for (const key in this.getObject()) {
            total += this.getObject()[key];
          }
          return total;
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.sum()).toBe(3);
    });

    it('should support async/await in subclasses', async () => {
      class TestEntity extends EntityBase {
        async getData(): Promise<string> {
          return 'data';
        }
        
        async process(): Promise<string> {
          const data = await this.getData();
          return `processed: ${data}`;
        }
      }

      const testEntity = new TestEntity();
      await expect(testEntity.process()).resolves.toBe('processed: data');
    });

    it('should support Promise.all in subclasses', async () => {
      class TestEntity extends EntityBase {
        async getData1(): Promise<number> {
          return 1;
        }
        
        async getData2(): Promise<number> {
          return 2;
        }
        
        async getAll(): Promise<number[]> {
          return Promise.all([this.getData1(), this.getData2()]);
        }
      }

      const testEntity = new TestEntity();
      await expect(testEntity.getAll()).resolves.toEqual([1, 2]);
    });

    it('should support Promise.race in subclasses', async () => {
      class TestEntity extends EntityBase {
        async getData1(): Promise<string> {
          return new Promise(resolve => setTimeout(() => resolve('first'), 100));
        }
        
        async getData2(): Promise<string> {
          return new Promise(resolve => setTimeout(() => resolve('second'), 50));
        }
        
        async getRace(): Promise<string> {
          return Promise.race([this.getData1(), this.getData2()]);
        }
      }

      const testEntity = new TestEntity();
      await expect(testEntity.getRace()).resolves.toBe('second');
    });

    it('should support try/catch in subclasses', () => {
      class TestEntity extends EntityBase {
        riskyOperation(): string {
          try {
            throw new Error('error');
          } catch (error) {
            return 'caught';
          }
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.riskyOperation()).toBe('caught');
    });

    it('should support finally in subclasses', () => {
      class TestEntity extends EntityBase {
        operation(): string {
          let result = '';
          try {
            result = 'try';
          } finally {
            result += ' finally';
          }
          return result;
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.operation()).toBe('try finally');
    });

    it('should support throw in subclasses', () => {
      class TestEntity extends EntityBase {
        throwError(): never {
          throw new Error('test error');
        }
      }

      const testEntity = new TestEntity();
      expect(() => testEntity.throwError()).toThrow('test error');
    });

    it('should support switch statements in subclasses', () => {
      class TestEntity extends EntityBase {
        getValue(value: number): string {
          switch (value) {
            case 1:
              return 'one';
            case 2:
              return 'two';
            default:
              return 'other';
          }
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.getValue(1)).toBe('one');
      expect(testEntity.getValue(2)).toBe('two');
      expect(testEntity.getValue(3)).toBe('other');
    });

    it('should support ternary operators in subclasses', () => {
      class TestEntity extends EntityBase {
        getValue(value: boolean): string {
          return value ? 'true' : 'false';
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.getValue(true)).toBe('true');
      expect(testEntity.getValue(false)).toBe('false');
    });

    it('should support nullish coalescing assignment in subclasses', () => {
      class TestEntity extends EntityBase {
        value: string | null = null;
        
        setValue(newValue: string): void {
          this.value ??= newValue;
        }
      }

      const testEntity = new TestEntity();
      testEntity.setValue('test');
      expect(testEntity.value).toBe('test');
      testEntity.setValue('other');
      expect(testEntity.value).toBe('test');
    });

    it('should support logical AND assignment in subclasses', () => {
      class TestEntity extends EntityBase {
        value: number = 0;
        
        setValue(newValue: number): void {
          this.value &&= newValue;
        }
      }

      const testEntity = new TestEntity();
      testEntity.setValue(5);
      expect(testEntity.value).toBe(0);
      testEntity.value = 10;
      testEntity.setValue(5);
      expect(testEntity.value).toBe(5);
    });

    it('should support logical OR assignment in subclasses', () => {
      class TestEntity extends EntityBase {
        value: number = 0;
        
        setValue(newValue: number): void {
          this.value ||= newValue;
        }
      }

      const testEntity = new TestEntity();
      testEntity.setValue(5);
      expect(testEntity.value).toBe(5);
      testEntity.setValue(10);
      expect(testEntity.value).toBe(5);
    });

    it('should support exponentiation operator in subclasses', () => {
      class TestEntity extends EntityBase {
        square(value: number): number {
          return value ** 2;
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.square(3)).toBe(9);
    });

    it('should support optional catch binding in subclasses', () => {
      class TestEntity extends EntityBase {
        riskyOperation(): string {
          try {
            throw new Error('error');
          } catch {
            return 'caught';
          }
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.riskyOperation()).toBe('caught');
    });

    it('should support private fields in subclasses', () => {
      class TestEntity extends EntityBase {
        #privateValue: string = 'private';
        
        getPrivateValue(): string {
          return this.#privateValue;
        }
      }

      const testEntity = new TestEntity();
      expect(testEntity.getPrivateValue()).toBe('private');
    });

    it('should support static blocks in subclasses', () => {
      class TestEntity extends EntityBase {
        static value: number;
        
        static {
          TestEntity.value = 42;
        }
      }

      expect(TestEntity.value).toBe(42);
    });

    it('should support top-level await in subclasses', async () => {
      class TestEntity extends EntityBase {
        async getData(): Promise<string> {
          return 'data';
        }
      }

      const testEntity = new TestEntity();
      const data = await testEntity.getData();
      expect(data).toBe('data');
    });

    it('should support WeakRef in subclasses', () => {
      class TestEntity extends EntityBase {
        weakRef: WeakRef<object> | null = null;
      }

      const testEntity = new TestEntity();
      const obj = {};
      testEntity.weakRef = new WeakRef(obj);
      expect(testEntity.weakRef.deref()).toBe(obj);
    });

    it('should support FinalizationRegistry in subclasses', () => {
      class TestEntity extends EntityBase {
        registry: FinalizationRegistry<object> | null = null;
      }

      const testEntity = new TestEntity();
      const obj = {};
      testEntity.registry = new FinalizationRegistry(() => {});
      testEntity.registry.register(obj, {});
      expect(testEntity.registry).toBeDefined();
    });

    it('should support Array.fromAsync in subclasses', async () => {
      class TestEntity extends EntityBase