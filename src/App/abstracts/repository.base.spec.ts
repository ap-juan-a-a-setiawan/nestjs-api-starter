import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepositoryBase } from './repository.base';

// Concrete implementation for testing
class TestEntity {
  id: number;
  name: string;
}

class TestRepository extends RepositoryBase<TestEntity> {}

describe('RepositoryBase', () => {
  let repository: TestRepository;
  let mockRepository: jest.Mocked<Partial<Repository<TestEntity>>>;

  const mockEntity: TestEntity = { id: 1, name: 'Test Entity' };
  const mockEntities: TestEntity[] = [
    { id: 1, name: 'Test Entity 1' },
    { id: 2, name: 'Test Entity 2' },
  ];

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      findAndCount: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      remove: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
      manager: {
        transaction: jest.fn(),
      } as any,
      metadata: {
        target: TestEntity,
        columns: [],
        relations: [],
      } as any,
      target: TestEntity,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TestRepository,
          useClass: TestRepository,
        },
        {
          provide: getRepositoryToken(TestEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<TestRepository>(TestRepository);
    
    // Inject the mock repository into the base class
    Object.assign(repository, mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('inheritance', () => {
    it('should extend Repository class', () => {
      expect(repository).toBeInstanceOf(Repository);
      expect(repository).toBeInstanceOf(RepositoryBase);
    });

    it('should have access to Repository methods', () => {
      expect(typeof repository.find).toBe('function');
      expect(typeof repository.findOne).toBe('function');
      expect(typeof repository.save).toBe('function');
      expect(typeof repository.delete).toBe('function');
    });
  });

  describe('find', () => {
    it('should find all entities', async () => {
      (mockRepository.find as jest.Mock).mockResolvedValue(mockEntities);

      const result = await repository.find();

      expect(result).toEqual(mockEntities);
      expect(mockRepository.find).toHaveBeenCalled();
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should find entities with options', async () => {
      const options = { where: { name: 'Test' }, take: 10 };
      (mockRepository.find as jest.Mock).mockResolvedValue([mockEntity]);

      const result = await repository.find(options);

      expect(result).toEqual([mockEntity]);
      expect(mockRepository.find).toHaveBeenCalledWith(options);
    });

    it('should return empty array when no entities found', async () => {
      (mockRepository.find as jest.Mock).mockResolvedValue([]);

      const result = await repository.find();

      expect(result).toEqual([]);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (mockRepository.find as jest.Mock).mockRejectedValue(error);

      await expect(repository.find()).rejects.toThrow('Database error');
    });
  });

  describe('findOne', () => {
    it('should find one entity by id', async () => {
      (mockRepository.findOne as jest.Mock).mockResolvedValue(mockEntity);

      const result = await repository.findOne({ where: { id: 1 } });

      expect(result).toEqual(mockEntity);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null when entity not found', async () => {
      (mockRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await repository.findOne({ where: { id: 999 } });

      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      const error = new Error('Entity not found');
      (mockRepository.findOne as jest.Mock).mockRejectedValue(error);

      await expect(repository.findOne({ where: { id: 1 } })).rejects.toThrow('Entity not found');
    });
  });

  describe('findOneBy', () => {
    it('should find one entity by criteria', async () => {
      (mockRepository.findOneBy as jest.Mock).mockResolvedValue(mockEntity);

      const result = await repository.findOneBy({ id: 1 });

      expect(result).toEqual(mockEntity);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null when entity not found', async () => {
      (mockRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      const result = await repository.findOneBy({ id: 999 });

      expect(result).toBeNull();
    });
  });

  describe('findAndCount', () => {
    it('should find entities and count', async () => {
      (mockRepository.findAndCount as jest.Mock).mockResolvedValue([mockEntities, 2]);

      const [entities, count] = await repository.findAndCount();

      expect(entities).toEqual(mockEntities);
      expect(count).toBe(2);
      expect(mockRepository.findAndCount).toHaveBeenCalled();
    });

    it('should return empty array and zero count when no entities', async () => {
      (mockRepository.findAndCount as jest.Mock).mockResolvedValue([[], 0]);

      const [entities, count] = await repository.findAndCount();

      expect(entities).toEqual([]);
      expect(count).toBe(0);
    });
  });

  describe('create', () => {
    it('should create a new entity instance', () => {
      (mockRepository.create as jest.Mock).mockReturnValue(mockEntity);

      const result = repository.create({ name: 'Test Entity' });

      expect(result).toEqual(mockEntity);
      expect(mockRepository.create).toHaveBeenCalledWith({ name: 'Test Entity' });
    });

    it('should create entity without data', () => {
      (mockRepository.create as jest.Mock).mockReturnValue({});

      const result = repository.create();

      expect(result).toEqual({});
      expect(mockRepository.create).toHaveBeenCalledWith();
    });
  });

  describe('save', () => {
    it('should save an entity', async () => {
      (mockRepository.save as jest.Mock).mockResolvedValue(mockEntity);

      const result = await repository.save(mockEntity);

      expect(result).toEqual(mockEntity);
      expect(mockRepository.save).toHaveBeenCalledWith(mockEntity);
    });

    it('should save multiple entities', async () => {
      (mockRepository.save as jest.Mock).mockResolvedValue(mockEntities);

      const result = await repository.save(mockEntities);

      expect(result).toEqual(mockEntities);
      expect(mockRepository.save).toHaveBeenCalledWith(mockEntities);
    });

    it('should handle save errors', async () => {
      const error = new Error('Save failed');
      (mockRepository.save as jest.Mock).mockRejectedValue(error);

      await expect(repository.save(mockEntity)).rejects.toThrow('Save failed');
    });
  });

  describe('update', () => {
    it('should update an entity', async () => {
      const updateResult = { affected: 1, raw: {}, generatedMaps: [] };
      (mockRepository.update as jest.Mock).mockResolvedValue(updateResult);

      const result = await repository.update(1, { name: 'Updated' });

      expect(result).toEqual(updateResult);
      expect(mockRepository.update).toHaveBeenCalledWith(1, { name: 'Updated' });
    });

    it('should handle update with criteria object', async () => {
      const updateResult = { affected: 1, raw: {}, generatedMaps: [] };
      (mockRepository.update as jest.Mock).mockResolvedValue(updateResult);

      const result = await repository.update({ id: 1 }, { name: 'Updated' });

      expect(result).toEqual(updateResult);
      expect(mockRepository.update).toHaveBeenCalledWith({ id: 1 }, { name: 'Updated' });
    });

    it('should handle update errors', async () => {
      const error = new Error('Update failed');
      (mockRepository.update as jest.Mock).mockRejectedValue(error);

      await expect(repository.update(1, { name: 'Updated' })).rejects.toThrow('Update failed');
    });
  });

  describe('delete', () => {
    it('should delete an entity by id', async () => {
      const deleteResult = { affected: 1, raw: {} };
      (mockRepository.delete as jest.Mock).mockResolvedValue(deleteResult);

      const result = await repository.delete(1);

      expect(result).toEqual(deleteResult);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should delete multiple entities', async () => {
      const deleteResult = { affected: 2, raw: {} };
      (mockRepository.delete as jest.Mock).mockResolvedValue(deleteResult);

      const result = await repository.delete([1, 2]);

      expect(result).toEqual(deleteResult);
      expect(mockRepository.delete).toHaveBeenCalledWith([1, 2]);
    });

    it('should handle delete errors', async () => {
      const error = new Error('Delete failed');
      (mockRepository.delete as jest.Mock).mockRejectedValue(error);

      await expect(repository.delete(1)).rejects.toThrow('Delete failed');
    });
  });

  describe('remove', () => {
    it('should remove an entity', async () => {
      (mockRepository.remove as jest.Mock).mockResolvedValue(mockEntity);

      const result = await repository.remove(mockEntity);

      expect(result).toEqual(mockEntity);
      expect(mockRepository.remove).toHaveBeenCalledWith(mockEntity);
    });

    it('should remove multiple entities', async () => {
      (mockRepository.remove as jest.Mock).mockResolvedValue(mockEntities);

      const result = await repository.remove(mockEntities);

      expect(result).toEqual(mockEntities);
      expect(mockRepository.remove).toHaveBeenCalledWith(mockEntities);
    });

    it('should handle remove errors', async () => {
      const error = new Error('Remove failed');
      (mockRepository.remove as jest.Mock).mockRejectedValue(error);

      await expect(repository.remove(mockEntity)).rejects.toThrow('Remove failed');
    });
  });

  describe('count', () => {
    it('should count entities', async () => {
      (mockRepository.count as jest.Mock).mockResolvedValue(5);

      const result = await repository.count();

      expect(result).toBe(5);
      expect(mockRepository.count).toHaveBeenCalled();
    });

    it('should count entities with options', async () => {
      (mockRepository.count as jest.Mock).mockResolvedValue(3);

      const result = await repository.count({ where: { name: 'Test' } });

      expect(result).toBe(3);
      expect(mockRepository.count).toHaveBeenCalledWith({ where: { name: 'Test' });
    });

    it('should return zero when no entities', async () => {
      (mockRepository.count as jest.Mock).mockResolvedValue(0);

      const result = await repository.count();

      expect(result).toBe(0);
    });
  });

  describe('createQueryBuilder', () => {
    it('should create query builder', () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
      };
      (mockRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = repository.createQueryBuilder('test');

      expect(result).toEqual(mockQueryBuilder);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('test');
    });
  });

  describe('manager', () => {
    it('should have manager property', () => {
      expect(repository.manager).toBeDefined();
      expect(typeof repository.manager.transaction).toBe('function');
    });
  });

 idescribe('metadata', () => {
    it('should have metadata property', () => {
      expect(repository.metadata).toBeDefined();
      expect(repository.metadata.target).toBe(TestEntity);
    });
  });

  describe('target', () => {
    it('should have target property', () => {
      expect(repository.target).toBe(TestEntity);
    });
  });
});