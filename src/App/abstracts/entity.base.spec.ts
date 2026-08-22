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

  describe('EntityBase instantiation', () => {
    it('should be defined', () => {
      expect(entityBase).toBeDefined();
    });

    it('should be an instance of EntityBase', () => {
      expect(entityBase).toBeInstanceOf(EntityBase);
    });

    it('should have the correct prototype', () => {
      expect(Object.getPrototypeOf(entityBase)).toBe(EntityBase.prototype);
    });
  });

  describe('EntityBase abstract class', () => {
    it('should not be instantiable directly', () => {
      expect(() => {
        // @ts-ignore - Testing abstract class instantiation
        new EntityBase();
      }).toThrow(TypeError);
    });

    it('should have no own properties', () => {
      expect(Object.keys(entityBase)).toHaveLength(0);
    });

    it('should have no enumerable properties on prototype', () => {
      const prototypeProperties = Object.getOwnPropertyNames(EntityBase.prototype);
      expect(prototypeProperties).toEqual(['constructor']);
    });

    it('should have a constructor', () => {
      expect(EntityBase.prototype.constructor).toBe(EntityBase);
    });
  });

  describe('EntityBase inheritance', () => {
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

    it('should allow multiple levels of inheritance', () => {
      class BaseEntity extends EntityBase {
        baseMethod(): string {
          return 'base';
        }
      }

      class ChildEntity extends BaseEntity {
        childMethod(): string {
          return 'child';
        }
      }

      const childEntity = new ChildEntity();
      expect(childEntity).toBeInstanceOf(EntityBase);
      expect(childEntity).toBeInstanceOf(BaseEntity);
      expect(childEntity).toBeInstanceOf(ChildEntity);
      expect(childEntity.baseMethod()).toBe('base');
      expect(childEntity.childMethod()).toBe('child');
    });
  });

  describe('EntityBase methods', () => {
    it('should not have any public methods defined', () => {
      const methods = Object.getOwnPropertyNames(EntityBase.prototype);
      expect(methods).toEqual(['constructor']);
    });

    it('should not have any static methods', () => {
      const staticMethods = Object.getOwnPropertyNames(EntityBase);
      expect(staticMethods).toEqual(['length', 'name', 'prototype']);
    });
  });

  describe('EntityBase with mock providers', () => {
    it('should work with mocked dependencies', async () => {
      const mockService = {
        getData: jest.fn().mockReturnValue('mock data'),
        save: jest.fn().mockResolvedValue(true),
      };

      class TestEntity extends EntityBase {
        constructor(private service: typeof mockService) {
          super();
        }

        getData(): string {
          return this.service.getData();
        }

        async save(): Promise<boolean> {
          return this.service.save();
        }
      }

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {
            provide: 'MOCK_SERVICE',
            useValue: mockService,
          },
          {
            provide: TestEntity,
            useFactory: (service: typeof mockService) => new TestEntity(service),
            inject: ['MOCK_SERVICE'],
          },
        ],
      }).compile();

      const testEntity = module.get<TestEntity>(TestEntity);

      expect(testEntity.getData()).toBe('mock data');
      expect(mockService.getData).toHaveBeenCalled();

      await expect(testEntity.save()).resolves.toBe(true);
      expect(mockService.save).toHaveBeenCalled();
    });

    it('should handle mocked service errors', async () => {
      const mockService = {
        getData: jest.fn().mockImplementation(() => {
          throw new Error('Service error');
        }),
        save: jest.fn().mockRejectedValue(new Error('Save failed')),
      };

      class TestEntity extends EntityBase {
        constructor(private service: typeof mockService) {
          super();
        }

        getData(): string {
          return this.service.getData();
        }

        async save(): Promise<boolean> {
          return this.service.save();
        }
      }

      const testEntity = new TestEntity(mockService);

      expect(() => testEntity.getData()).toThrow('Service error');
      await expect(testEntity.save()).rejects.toThrow('Save failed');
    });
  });

  describe('EntityBase edge cases', () => {
    it('should handle subclass with no constructor', () => {
      class EmptyEntity extends EntityBase {}

      const emptyEntity = new EmptyEntity();
      expect(emptyEntity).toBeInstanceOf(EntityBase);
      expect(emptyEntity).toBeInstanceOf(EmptyEntity);
    });

    it('should handle subclass with private constructor', () => {
      class PrivateEntity extends EntityBase {
        private constructor() {
          super();
        }

        static create(): PrivateEntity {
          return new PrivateEntity();
        }
      }

      const privateEntity = PrivateEntity.create();
      expect(privateEntity).toBeInstanceOf(EntityBase);
      expect(privateEntity).toBeInstanceOf(PrivateEntity);
    });

    it('should handle subclass with protected constructor', () => {
      class ProtectedEntity extends EntityBase {
        protected constructor() {
          super();
        }

        static create(): ProtectedEntity {
          return new ProtectedEntity();
        }
      }

      const protectedEntity = ProtectedEntity.create();
      expect(protectedEntity).toBeInstanceOf(EntityBase);
      expect(protectedEntity).toBeInstanceOf(ProtectedEntity);
    });

    it('should handle subclass with parameterized constructor', () => {
      class ParameterizedEntity extends EntityBase {
        constructor(public value: number) {
          super();
        }
      }

      const parameterizedEntity = new ParameterizedEntity(42);
      expect(parameterizedEntity.value).toBe(42);
      expect(parameterizedEntity).toBeInstanceOf(EntityBase);
    });

    it('should handle subclass with getters and setters', () => {
      class PropertyEntity extends EntityBase {
        private _name: string = '';

        get name(): string {
          return this._name;
        }

        set name(value: string) {
          this._name = value;
        }
      }

      const propertyEntity = new PropertyEntity();
      propertyEntity.name = 'Test';
      expect(propertyEntity.name).toBe('Test');
      expect(propertyEntity).toBeInstanceOf(EntityBase);
    });
  });
});