typescript
import { Test } from '@nestjs/testing';
import { EntityBase } from './entity.base';

interface TestDependency {
  getValue: jest.Mock<string>;
}

class TestEntity extends EntityBase {
  constructor(private readonly dependency: TestDependency) {
    super();
  }

  public getDependencyValue(): string {
    return this.dependency.getValue();
  }
}

describe('EntityBase', () => {
  it('should be defined', () => {
    expect(EntityBase).toBeDefined();
  });

  it('should be abstract and cannot be instantiated directly', () => {
    expect(() => {
      // @ts-ignore - intentionally instantiate abstract class
      new EntityBase();
    }).toThrow(TypeError);
  });

  it('should create an instance of a concrete subclass', () => {
    const getValue = jest.fn().mockReturnValue('mock-value');
    const dependency: TestDependency = { getValue };

    const entity = new TestEntity(dependency);

    expect(entity).toBeInstanceOf(EntityBase);
    expect(entity).toBeInstanceOf(TestEntity);
    expect(entity.getDependencyValue()).toBe('mock-value');
    expect(getValue).toHaveBeenCalledTimes(1);
  });

  it('should support subclass inheritance and methods', () => {
    const getValue = jest.fn().mockReturnValue('value');
    const dependency: TestDependency = { getValue };

    const entity = new TestEntity(dependency);

    expect(entity.getDependencyValue()).toBe('value');
    expect(dependency.getValue).toHaveBeenCalled();
  });

  it('should work with NestJS testing module and mocked providers', async () => {
    const getValueMock = jest.fn().mockReturnValue('from-module');

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: 'TEST_DEPENDENCY',
          useValue: {
            getValue: getValueMock,
          },
        },
        {
          provide: TestEntity,
          useFactory: (dependency: TestDependency) => new TestEntity(dependency),
          inject: ['TEST_DEPENDENCY'],
        },
      ],
    }).compile();

    const entity = moduleRef.get<TestEntity>(TestEntity);

    expect(entity).toBeInstanceOf(EntityBase);
    expect(entity.getDependencyValue()).toBe('from-module');
    expect(getValueMock).toHaveBeenCalled();
  });

  it('should handle edge cases when extending with additional properties', () => {
    const getValue = jest.fn().mockReturnValue('edge');
    const dependency: TestDependency = { getValue };

    const entity = new TestEntity(dependency);

    expect(entity).toBeDefined();
    expect(entity.getDependencyValue()).toBe('edge');
    expect(getValue).toHaveBeenCalledTimes(1);
  });
});