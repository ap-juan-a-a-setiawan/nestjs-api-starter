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

    it('should be an abstract class and cannot be instantiated directly', () => {
      expect(() => {
        // @ts-ignore - Testing abstract class instantiation
        new EntityBase();
      }).toThrow(TypeError);
    });

    it('should have no own properties', () => {
      expect(Object.keys(entityBase)).toHaveLength(0);
    });

    it('should have no own property descriptors', () => {
      expect(Object.getOwnPropertyDescriptors(entityBase)).toEqual({});
    });

    it('should have no methods defined on the prototype', () => {
      const prototypeMethods = Object.getOwnPropertyNames(EntityBase.prototype);
      expect(prototypeMethods).toEqual(['constructor']);
    });

    it('should not have any static methods', () => {
      const staticMethods = Object.getOwnPropertyNames(EntityBase);
      expect(staticMethods).toEqual(['length', 'name', 'prototype']);
    });

    it('should be extensible', () => {
      expect(Object.isExtensible(entityBase)).toBe(true);
    });

    it('should not be frozen', () => {
      expect(Object.isFrozen(entityBase)).toBe(false);
    });

    it('should not be sealed', () => {
      expect(Object.isSealed(entityBase)).toBe(false);
    });

    it('should have a constructor that is the EntityBase class', () => {
      expect(entityBase.constructor).toBe(EntityBase);
    });

    it('should have the correct name property', () => {
      expect(EntityBase.name).toBe('EntityBase');
    });

    it('should have a prototype that is an object', () => {
      expect(typeof EntityBase.prototype).toBe('object');
    });

    it('should have a prototype with a constructor property', () => {
      expect(EntityBase.prototype.constructor).toBe(EntityBase);
    });

    it('should support inheritance', () => {
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

    it('should allow subclasses to add properties', () => {
      class TestEntity extends EntityBase {
        id: number;
        constructor(id: number) {
          super();
          this.id = id;
        }
      }

      const testEntity = new TestEntity(1);
      expect(testEntity.id).toBe(1);
      expect(testEntity).toBeInstanceOf(EntityBase);
    });

    it('should allow subclasses to override methods', () => {
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

    it('should have a prototype chain that includes Object.prototype', () => {
      expect(entityBase instanceof Object).toBe(true);
      expect(Object.getPrototypeOf(Object.getPrototypeOf(entityBase))).toBe(Object.prototype);
    });

    it('should have a toString method inherited from Object', () => {
      expect(typeof entityBase.toString).toBe('function');
      expect(entityBase.toString()).toBe('[object Object]');
    });

    it('should have a valueOf method inherited from Object', () => {
      expect(typeof entityBase.valueOf).toBe('function');
      expect(entityBase.valueOf()).toBe(entityBase);
    });

    it('should have a hasOwnProperty method inherited from Object', () => {
      expect(typeof entityBase.hasOwnProperty).toBe('function');
      expect(entityBase.hasOwnProperty('test')).toBe(false);
    });

    it('should have an isPrototypeOf method inherited from Object', () => {
      expect(typeof entityBase.isPrototypeOf).toBe('function');
      expect(entityBase.isPrototypeOf({})).toBe(false);
    });

    it('should have a propertyIsEnumerable method inherited from Object', () => {
      expect(typeof entityBase.propertyIsEnumerable).toBe('function');
      expect(entityBase.propertyIsEnumerable('test')).toBe(false);
    });

    it('should have a toLocaleString method inherited from Object', () => {
      expect(typeof entityBase.toLocaleString).toBe('function');
      expect(entityBase.toLocaleString()).toBe('[object Object]');
    });

    it('should have a getOwnPropertyDescriptor method available', () => {
      expect(typeof Object.getOwnPropertyDescriptor).toBe('function');
      expect(Object.getOwnPropertyDescriptor(EntityBase.prototype, 'constructor')).toBeDefined();
    });

    it('should have a getPrototypeOf method available', () => {
      expect(typeof Object.getPrototypeOf).toBe('function');
      expect(Object.getPrototypeOf(entityBase)).toBe(EntityBase.prototype);
    });

    it('should have a setPrototypeOf method available', () => {
      expect(typeof Object.setPrototypeOf).toBe('function');
      const newProto = {};
      Object.setPrototypeOf(entityBase, newProto);
      expect(Object.getPrototypeOf(entityBase)).toBe(newProto);
    });

    it('should have a create method available', () => {
      expect(typeof Object.create).toBe('function');
      const created = Object.create(EntityBase.prototype);
      expect(created).toBeInstanceOf(EntityBase);
    });

    it('should have an assign method available', () => {
      expect(typeof Object.assign).toBe('function');
      const target = {};
      const source = { test: 'value' };
      Object.assign(target, source);
      expect(target).toEqual({ test: 'value' });
    });

    it('should have a defineProperty method available', () => {
      expect(typeof Object.defineProperty).toBe('function');
      const obj = {};
      Object.defineProperty(obj, 'test', { value: 'value', enumerable: true });
      expect(obj).toHaveProperty('test', 'value');
    });

    it('should have a defineProperties method available', () => {
      expect(typeof Object.defineProperties).toBe('function');
      const obj = {};
      Object.defineProperties(obj, {
        test1: { value: 'value1', enumerable: true },
        test2: { value: 'value2', enumerable: true },
      });
      expect(obj).toEqual({ test1: 'value1', test2: 'value2' });
    });

    it('should have a freeze method available', () => {
      expect(typeof Object.freeze).toBe('function');
      const obj = { test: 'value' };
      Object.freeze(obj);
      expect(Object.isFrozen(obj)).toBe(true);
    });

    it('should have a seal method available', () => {
      expect(typeof Object.seal).toBe('function');
      const obj = { test: 'value' };
      Object.seal(obj);
      expect(Object.isSealed(obj)).toBe(true);
    });

    it('should have a preventExtensions method available', () => {
      expect(typeof Object.preventExtensions).toBe('function');
      const obj = {};
      Object.preventExtensions(obj);
      expect(Object.isExtensible(obj)).toBe(false);
    });

    it('should have an is method available', () => {
      expect(typeof Object.is).toBe('function');
      expect(Object.is(NaN, NaN)).toBe(true);
      expect(Object.is(0, -0)).toBe(false);
    });

    it('should have a keys method available', () => {
      expect(typeof Object.keys).toBe('function');
      const obj = { test: 'value' };
      expect(Object.keys(obj)).toEqual(['test']);
    });

    it('should have a values method available', () => {
      expect(typeof Object.values).toBe('function');
      const obj = { test: 'value' };
      expect(Object.values(obj)).toEqual(['value']);
    });

    it('should have an entries method available', () => {
      expect(typeof Object.entries).toBe('function');
      const obj = { test: 'value' };
      expect(Object.entries(obj)).toEqual([['test', 'value']]);
    });

    it('should have a fromEntries method available', () => {
      expect(typeof Object.fromEntries).toBe('function');
      const entries = [['test', 'value']];
      expect(Object.fromEntries(entries)).toEqual({ test: 'value' });
    });

    it('should have a getOwnPropertySymbols method available', () => {
      expect(typeof Object.getOwnPropertySymbols).toBe('function');
      const symbol = Symbol('test');
      const obj = { [symbol]: 'value' };
      expect(Object.getOwnPropertySymbols(obj)).toEqual([symbol]);
    });

    it('should have a getOwnPropertyDescriptors method available', () => {
      expect(typeof Object.getOwnPropertyDescriptors).toBe('function');
      const obj = { test: 'value' };
      const descriptors = Object.getOwnPropertyDescriptors(obj);
      expect(descriptors.test).toBeDefined();
      expect(descriptors.test.value).toBe('value');
    });
  });
});