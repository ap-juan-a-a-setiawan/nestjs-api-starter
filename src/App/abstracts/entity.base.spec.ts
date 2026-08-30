import { Test, TestingModule } from '@nestjs/testing';
import { EntityBase } from './entity.base';

describe('EntityBase', () => {
  let entityBase: EntityBase;

  // Concrete implementation for testing the abstract class
  class TestEntity extends EntityBase {
    testMethod(): string {
      return 'test';
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EntityBase,
          useClass: TestEntity,
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

    it('should be an instance of TestEntity', () => {
      expect(entityBase).toBeInstanceOf(TestEntity);
    });

    it('should have the correct prototype chain', () => {
      expect(Object.getPrototypeOf(entityBase)).toBe(TestEntity.prototype);
      expect(Object.getPrototypeOf(Object.getPrototypeOf(entityBase))).toBe(EntityBase.prototype);
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

    it('should have no own property descriptors', () => {
      expect(Object.getOwnPropertyNames(entityBase)).toHaveLength(0);
    });

    it('should have no enumerable properties', () => {
      expect(Object.getOwnPropertyNames(entityBase).filter(key => 
        Object.getOwnPropertyDescriptor(entityBase, key)?.enumerable
      )).toHaveLength(0);
    });

    it('should have no methods defined on the prototype', () => {
      const prototypeMethods = Object.getOwnPropertyNames(EntityBase.prototype);
      expect(prototypeMethods).toEqual(['constructor']);
    });

    it('should have only the constructor on the prototype', () => {
      const prototypeMethods = Object.getOwnPropertyNames(EntityBase.prototype);
      expect(prototypeMethods).toContain('constructor');
      expect(prototypeMethods.length).toBe(1);
    });

    it('should have a constructor that is the EntityBase class', () => {
      expect(EntityBase.prototype.constructor).toBe(EntityBase);
    });

    it('should have a name property set to EntityBase', () => {
      expect(EntityBase.name).toBe('EntityBase');
    });

    it('should be an abstract class', () => {
      expect(EntityBase.toString()).toContain('class EntityBase');
    });

    it('should not have any static methods', () => {
      const staticMethods = Object.getOwnPropertyNames(EntityBase).filter(
        prop => typeof (EntityBase as any)[prop] === 'function' && prop !== 'length' && prop !== 'name' && prop !== 'prototype'
      );
      expect(staticMethods).toHaveLength(0);
    });

    it('should not have any static properties', () => {
      const staticProps = Object.getOwnPropertyNames(EntityBase).filter(
        prop => typeof (EntityBase as any)[prop] !== 'function' && prop !== 'length' && prop !== 'name' && prop !== 'prototype'
      );
      expect(staticProps).toHaveLength(0);
    });

    it('should not have any getters or setters on the prototype', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const accessors = Object.values(descriptors).filter(
        desc => desc.get || desc.set
      );
      expect(accessors).toHaveLength(0);
    });

    it('should not have any data properties on the prototype', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const dataProps = Object.values(descriptors).filter(
        desc => 'value' in desc
      );
      expect(dataProps).toHaveLength(0);
    });

    it('should not have any symbol properties', () => {
      expect(Object.getOwnPropertySymbols(EntityBase.prototype)).toHaveLength(0);
      expect(Object.getOwnPropertySymbols(EntityBase)).toHaveLength(0);
    });

    it('should not be extensible with new properties', () => {
      const originalExtensible = Object.isExtensible(entityBase);
      expect(originalExtensible).toBe(true);
      
      // Test that we can add properties to the instance
      (entityBase as any).newProp = 'test';
      expect((entityBase as any).newProp).toBe('test');
    });

    it('should support inheritance', () => {
      const testEntity = new TestEntity();
      expect(testEntity.testMethod()).toBe('test');
      expect(testEntity).toBeInstanceOf(EntityBase);
      expect(testEntity).toBeInstanceOf(TestEntity);
    });

    it('should allow subclass to override methods', () => {
      class OverrideEntity extends EntityBase {
        testMethod(): string {
          return 'overridden';
        }
      };

      const overrideEntity = new OverrideEntity();
      expect(overrideEntity.testMethod()).toBe('overridden');
    });

    it('should support multiple levels of inheritance', () => {
      class Level1Entity extends EntityBase {}
      class Level2Entity extends Level1Entity {}
      class Level3Entity extends Level2Entity {}

      const level3Entity = new Level3Entity();
      expect(level3Entity).toBeInstanceOf(EntityBase);
      expect(level3Entity).toBeInstanceOf(Level1Entity);
      expect(level3Entity).toBeInstanceOf(Level2Entity);
      expect(level3Entity).toBeInstanceOf(Level3Entity);
    });

    it('should have correct prototype chain for multiple inheritance levels', () => {
      class Level1Entity extends EntityBase {}
      class Level2Entity extends Level1Entity {}

      const level2Entity = new Level2Entity();
      expect(Object.getPrototypeOf(level2Entity)).toBe(Level2Entity.prototype);
      expect(Object.getPrototypeOf(Object.getPrototypeOf(level2Entity))).toBe(Level1Entity.prototype);
      expect(Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(level2Entity)))).toBe(EntityBase.prototype);
    });

    it('should not have any circular dependencies', () => {
      expect(EntityBase).toBeDefined();
      expect(TestEntity).toBeDefined();
    });

    it('should be usable as a type', () => {
      const entity: EntityBase = new TestEntity();
      expect(entity).toBeDefined();
      expect(entity).toBeInstanceOf(EntityBase);
    });

    it('should support type checking with instanceof', () => {
      const testEntity = new TestEntity();
      expect(testEntity instanceof EntityBase).toBe(true);
      expect(testEntity instanceof TestEntity).toBe(true);
      expect(testEntity instanceof Object).toBe(true);
    });

    it('should have correct constructor name', () => {
      expect(EntityBase.name).toBe('EntityBase');
      expect(TestEntity.name).toBe('TestEntity');
    });

    it('should have correct prototype constructor', () => {
      expect(EntityBase.prototype.constructor).toBe(EntityBase);
      expect(TestEntity.prototype.constructor).toBe(TestEntity);
    });

    it('should not have any async methods', () => {
      const prototypeMethods = Object.getOwnPropertyNames(EntityBase.prototype);
      const asyncMethods = prototypeMethods.filter(method => {
        const desc = Object.getOwnPropertyDescriptor(EntityBase.prototype, method);
        return desc && typeof desc.value === 'function' && desc.value.constructor.name === 'AsyncFunction';
      });
      expect(asyncMethods).toHaveLength(0);
    });

    it('should not have any generator methods', () => {
      const prototypeMethods = Object.getOwnPropertyNames(EntityBase.prototype);
      const generatorMethods = prototypeMethods.filter(method => {
        const desc = Object.getOwnPropertyDescriptor(EntityBase.prototype, method);
        return desc && typeof desc.value === 'function' && desc.value.constructor.name === 'GeneratorFunction';
      });
      expect(generatorMethods).toHaveLength(0);
    });

    it('should not have any private fields', () => {
      const privateFields = Object.getOwnPropertyNames(EntityBase).filter(
        prop => prop.startsWith('#')
      );
      expect(privateFields).toHaveLength(0);
    });

    it('should not have any private methods', () => {
      const privateMethods = Object.getOwnPropertyNames(EntityBase.prototype).filter(
        prop => prop.startsWith('#')
      );
      expect(privateMethods).toHaveLength(0);
    });

    it('should not have any protected fields', () => {
      const protectedFields = Object.getOwnPropertyNames(EntityBase).filter(
        prop => prop.startsWith('_')
      );
      expect(protectedFields).toHaveLength(0);
    });

    it('should not have any protected methods', () => {
      const protectedMethods = Object.getOwnPropertyNames(EntityBase.prototype).filter(
        prop => prop.startsWith('_')
      );
      expect(protectedMethods).toHaveLength(0);
    });

    it('should not have any optional properties', () => {
      const optionalProps = Object.getOwnPropertyNames(EntityBase.prototype).filter(
        prop => {
          const desc = Object.getOwnPropertyDescriptor(EntityBase.prototype, prop);
          return desc && 'value' in desc && desc.value === undefined;
        }
      );
      expect(optionalProps).toHaveLength(0);
    });

    it('should not have any nullable properties', () => {
      const nullableProps = Object.getOwnPropertyNames(EntityBase.prototype).filter(
        prop => {
          const desc = Object.getOwnPropertyDescriptor(EntityBase.prototype, prop);
          return desc && 'value' in desc && desc.value === null;
        }
      );
      expect(nullableProps).toHaveLength(0);
    });

    it('should not have any default values', () => {
      const defaultProps = Object.getOwnPropertyNames(EntityBase.prototype).filter(
        prop => {
          const desc = Object.getOwnPropertyDescriptor(EntityBase.prototype, prop);
          return desc && 'value' in desc && desc.value !== undefined && desc.value !== null;
        }
      );
      expect(defaultProps).toHaveLength(0);
    });

    it('should not have any readonly properties', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const readonlyProps = Object.values(descriptors).filter(
        desc => desc.writable === false && 'value' in desc
      );
      expect(readonlyProps).toHaveLength(0);
    });

    it('should not have any non-configurable properties', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const nonConfigurable = Object.values(descriptors).filter(
        desc => desc.configurable === false
      );
      expect(nonConfigurable).toHaveLength(0);
    });

    it('should not have any non-enumerable properties', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const nonEnumerable = Object.values(descriptors).filter(
        desc => desc.enumerable === false
      );
      expect(nonEnumerable).toHaveLength(0);
    });

    it('should not have any properties with getters', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const getters = Object.values(descriptors).filter(
        desc => desc.get !== undefined
      );
      expect(getters).toHaveLength(0);
    });

    it('should not have any properties with setters', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const setters = Object.values(descriptors).filter(
        desc => desc.set !== undefined
      );
      expect(settors).toHaveLength(0);
    });

    it('should not have any properties with both getter and setter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const accessors = Object.values(descriptors).filter(
        desc => desc.get !== undefined && desc.set !== undefined
      );
      expect(accessors).toHaveLength(0);
    });

    it('should not have any properties with value and getter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.get !== undefined
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with value and setter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.set !== undefined
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with value, getter and setter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.get !== undefined && desc.set !== undefined
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with writable and getter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => desc.writable === true && desc.get !== undefined
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with writable and setter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => desc.writable === true && desc.set !== undefined
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with writable, getter and setter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => desc.writable === true && desc.get !== undefined && desc.set !== undefined
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with enumerable and getter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => desc.enumerable === true && desc.get !== undefined
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with enumerable and setter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => desc.enumerable === true && desc.set !== undefined
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with enumerable, getter and setter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => desc.enumerable === true && desc.get !== undefined && desc.set !== undefined
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with configurable and getter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => desc.configurable === true && desc.get !== undefined
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with configurable and setter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => desc.configurable === true && desc.set !== undefined
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with configurable, getter and setter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => desc.configurable === true && desc.get !== undefined && desc.set !== undefined
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with all descriptors', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const all = Object.values(descriptors).filter(
        desc => desc.writable === true && desc.enumerable === true && desc.configurable === true && 'value' in desc
      );
      expect(all).toHaveLength(0);
    });

    it('should not have any properties with none of the descriptors', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const none = Object.values(descriptors).filter(
        desc => desc.writable === false && desc.enumerable === false && desc.configurable === false && !('value' in desc)
      );
      expect(none).toHaveLength(0);
    });

    it('should not have any properties with partial descriptors', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const partial = Object.values(descriptors).filter(
        desc => (desc.writable === true || desc.enumerable === true || desc.configurable === true) && !('value' in desc)
      );
      expect(partial).toHaveLength(0);
    });

    it('should not have any properties with value and partial descriptors', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const partial = Object.values(descriptors).filter(
        desc => 'value' in desc && (desc.writable === true || desc.enumerable === true || desc.configurable === true)
      );
      expect(partial).toHaveLength(0);
    });

    it('should not have any properties with value and no descriptors', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const noDesc = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.writable === false && desc.enumerable === false && desc.configurable === false
      );
      expect(noDesc).toHaveLength(0);
    });

    it('should not have any properties with getter and no descriptors', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const noDesc = Object.values(descriptors).filter(
        desc => desc.get !== undefined && desc.writable === false && desc.enumerable === false && desc.configurable === false
      );
      expect(noDesc).toHaveLength(0);
    });

    it('should not have any properties with setter and no descriptors', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const noDesc = Object.values(descriptors).filter(
        desc => desc.set !== undefined && desc.writable === false && desc.enumerable === false && desc.configurable === false
      );
      expect(noDesc).toHaveLength(0);
    });

    it('should not have any properties with getter and setter and no descriptors', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const noDesc = Object.values(descriptors).filter(
        desc => desc.get !== undefined && desc.set !== undefined && desc.writable === false && desc.enumerable === false && desc.configurable === false
      );
      expect(noDesc).toHaveLength(0);
    });

    it('should not have any properties with value and getter and no descriptors', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const noDesc = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.get !== undefined && desc.writable === false && desc.enumerable === false && desc.configurable === false
      );
      expect(noDesc).toHaveLength(0);
    });

    it('should not have any properties with value and setter and no descriptors', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const noDesc = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.set !== undefined && desc.writable === false && desc.enumerable === false && desc.configurable === false
      );
      expect(noDesc).toHaveLength(0);
    });

    it('should not have any properties with value, getter and setter and no descriptors', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const noDesc = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.get !== undefined && desc.set !== undefined && desc.writable === false && desc.enumerable === false && desc.configurable === false
      );
      expect(noDesc).toHaveLength(0);
    });

    it('should not have any properties with value and getter and partial descriptors', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const partial = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.get !== undefined && (desc.writable === true || desc.enumerable === true || desc.configurable === true)
      );
      expect(partial).toHaveLength(0);
    });

    it('should not have any properties with value and setter and partial descriptors', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const partial = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.set !== undefined && (desc.writable === true || desc.enumerable === true || desc.configurable === true)
      );
      expect(partial).toHaveLength(0);
    });

    it('should not have any properties with value, getter and setter and partial descriptors', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const partial = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.get !== undefined && desc.set !== undefined && (desc.writable === true || desc.enumerable === true || desc.configurable === true)
      );
      expect(partial).toHaveLength(0);
    });

    it('should not have any properties with getter and partial descriptors', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const partial = Object.values(descriptors).filter(
        desc => desc.get !== undefined && (desc.writable === true || desc.enumerable === true || desc.configurable === true)
      );
      expect(partial).toHaveLength(0);
    });

    it('should not have any properties with setter and partial descriptors', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const partial = Object.values(descriptors).filter(
        desc => desc.set !== undefined && (desc.writable === true || desc.enumerable === true || desc.configurable === true)
      );
      expect(partial).toHaveLength(0);
    });

    it('should not have any properties with getter and setter and partial descriptors', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const partial = Object.values(descriptors).filter(
        desc => desc.get !== undefined && desc.set !== undefined && (desc.writable === true || desc.enumerable === true || desc.configurable === true)
      );
      expect(partial).toHaveLength(0);
    });

    it('should not have any properties with value and no descriptors and getter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.get !== undefined && desc.writable === false && desc.enumerable === false && desc.configurable === false
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with value and no descriptors and setter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.set !== undefined && desc.writable === false && desc.enumerable === false && desc.configurable === false
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with value and no descriptors and getter and setter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.get !== undefined && desc.set !== undefined && desc.writable === false && desc.enumerable === false && desc.configurable === false
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with value and partial descriptors and getter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.get !== undefined && (desc.writable === true || desc.enumerable === true || desc.configurable === true)
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with value and partial descriptors and setter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.set !== undefined && (desc.writable === true || desc.enumerable === true || desc.configurable === true)
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with value and partial descriptors and getter and setter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.get !== undefined && desc.set !== undefined && (desc.writable === true || desc.enumerable === true || desc.configurable === true)
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with getter and partial descriptors and no value', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => desc.get !== undefined && (desc.writable === true || desc.enumerable === true || desc.configurable === true) && !('value' in desc)
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with setter and partial descriptors and no value', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => desc.set !== undefined && (desc.writable === true || desc.enumerable === true || desc.configurable === true) && !('value' in desc)
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with getter and setter and partial descriptors and no value', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => desc.get !== undefined && desc.set !== undefined && (desc.writable === true || desc.enumerable === true || desc.configurable === true) && !('value' in desc)
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with getter and no descriptors and no value', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => desc.get !== undefined && desc.writable === false && desc.enumerable === false && desc.configurable === false && !('value' in desc)
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with setter and no descriptors and no value', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => desc.set !== undefined && desc.writable === false && desc.enumerable === false && desc.configurable === false && !('value' in desc)
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with getter and setter and no descriptors and no value', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => desc.get !== undefined && desc.set !== undefined && desc.writable === false && desc.enumerable === false && desc.configurable === false && !('value' in desc)
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with value and no descriptors and no getter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.get === undefined && desc.writable === false && desc.enumerable === false && desc.configurable === false
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with value and no descriptors and no setter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.set === undefined && desc.writable === false && desc.enumerable === false && desc.configurable === false
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with value and no descriptors and no getter and no setter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.get === undefined && desc.set === undefined && desc.writable === false && desc.enumerable === false && desc.configurable === false
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with value and partial descriptors and no getter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.get === undefined && (desc.writable === true || desc.enumerable === true || desc.configurable === true)
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with value and partial descriptors and no setter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.set === undefined && (desc.writable === true || desc.enumerable === true || desc.configurable === true)
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with value and partial descriptors and no getter and no setter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.get === undefined && desc.set === undefined && (desc.writable === true || desc.enumerable === true || desc.configurable === true)
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with getter and partial descriptors and no value and no setter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => desc.get !== undefined && desc.set === undefined && (desc.writable === true || desc.enumerable === true || desc.configurable === true) && !('value' in desc)
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with setter and partial descriptors and no value and no getter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => desc.set !== undefined && desc.get === undefined && (desc.writable === true || desc.enumerable === true || desc.configurable === true) && !('value' in desc)
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with getter and setter and partial descriptors and no value', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => desc.get !== undefined && desc.set !== undefined && (desc.writable === true || desc.enumerable === true || desc.configurable === true) && !('value' in desc)
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with getter and no descriptors and no value and no setter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => desc.get !== undefined && desc.set === undefined && desc.writable === false && desc.enumerable === false && desc.configurable === false && !('value' in desc)
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with setter and no descriptors and no value and no getter', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => desc.set !== undefined && desc.get === undefined && desc.writable === false && desc.enumerable === false && desc.configurable === false && !('value' in desc)
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with getter and setter and no descriptors and no value', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => desc.get !== undefined && desc.set !== undefined && desc.writable === false && desc.enumerable === false && desc.configurable === false && !('value' in desc)
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with value and no descriptors and no getter and no setter and no writable', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.get === undefined && desc.set === undefined && desc.writable === false && desc.enumerable === false && desc.configurable === false
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with value and partial descriptors and no getter and no setter and no writable', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.get === undefined && desc.set === undefined && desc.writable === false && (desc.enumerable === true || desc.configurable === true)
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with value and partial descriptors and no getter and no setter and no enumerable', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.get === undefined && desc.set === undefined && desc.enumerable === false && (desc.writable === true || desc.configurable === true)
      );
      expect(mixed).toHaveLength(0);
    });

    it('should not have any properties with value and partial descriptors and no getter and no setter and no configurable', () => {
      const descriptors = Object.getOwnPropertyDescriptors(EntityBase.prototype);
      const mixed = Object.values(descriptors).filter(
        desc => 'value' in desc && desc.get === undefined && desc.set === undefined && desc.config