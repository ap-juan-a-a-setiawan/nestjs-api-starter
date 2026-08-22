typescript
import { Test } from '@nestjs/testing';
import { EntityBase } from './entity.base';

const DEPENDENCY_TOKEN = 'DEPENDENCY_TOKEN';

class TestEntity extends EntityBase {
  constructor(private readonly dependency: { getValue: () => string }) {
    super();
  }

  getValue(): string {
    return this.dependency.getValue();
  }
}

describe('EntityBase', () => {
  let entity: TestEntity;
  const mockDependency = {
    getValue: jest.fn().mockReturnValue('mocked-value'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: DEPENDENCY_TOKEN,
          useValue: mockDependency,
        },
        {
          provide: TestEntity,
          useFactory: (dependency: { getValue: () => string }) =>
            new TestEntity(dependency),
          inject: [DEPENDENCY_TOKEN],
        },
      ],
    }).compile();

    entity = moduleRef.get<TestEntity>(TestEntity);
  });

  it('should be defined', () => {
    expect(entity).toBeDefined();
  });

  it('should be an instance of EntityBase', () => {
    expect(entity).toBeInstanceOf(EntityBase);
  });

  it('should allow extending the abstract class', () => {
    const instance = new TestEntity(mockDependency);
    expect(instance).toBeInstanceOf(EntityBase);
  });

  it('should call the mocked dependency method', () => {
    const result = entity.getValue();
    expect(result).toBe('mocked-value');
    expect(mockDependency.getValue).toHaveBeenCalled();
  });
});