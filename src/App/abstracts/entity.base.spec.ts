import { Test } from '@nestjs/testing';
import { EntityBase } from './entity.base';

describe('EntityBase', () => {
  const mockDependency = jest.fn();

  class SimpleEntity extends EntityBase {}

  class EntityWithDependency extends EntityBase {
    constructor(private readonly dep: jest.Mock) {
      super();
    }

    getDependency(): jest.Mock {
      return this.dep;
    }
  }

  it('should be defined', () => {
    expect(EntityBase).toBeDefined();
  });

  it('should be extendable and instantiable via subclass', () => {
    const instance = new SimpleEntity();
    expect(instance).toBeInstanceOf(SimpleEntity);
    expect(instance).toBeInstanceOf(EntityBase);
  });

  it('should not have any own public methods or properties', () => {
    const prototype = EntityBase.prototype as unknown as Record<string, unknown>;
    expect(Object.getOwnPropertyNames(prototype)).toEqual(['constructor']);
  });

  it('should support dependency injection via NestJS Test.createTestingModule', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: 'MOCK_DEPENDENCY', useValue: mockDependency },
        {
          provide: EntityWithDependency,
          useFactory: (dep: jest.Mock) => new EntityWithDependency(dep),
          inject: ['MOCK_DEPENDENCY'],
        },
      ],
    }).compile();

    const app = moduleRef.createNestApplication();
    await app.init();

    const entity = app.get(EntityWithDependency);
    expect(entity).toBeInstanceOf(EntityBase);
    expect(entity).toBeInstanceOf(EntityWithDependency);
    expect(entity.getDependency()).toBe(mockDependency);

    await app.close();
  });

  it('should allow constructing subclass with mocked dependency directly', () => {
    const entity = new EntityWithDependency(mockDependency);
    expect(entity).toBeInstanceOf(EntityBase);
    expect(entity.getDependency()).toBe(mockDependency);
  });
});