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
    { id: 1, name: 'Entity 1' },
    { id: 2, name: 'Entity 2' },
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
      queryRunner: {} as any,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TestRepository,
          useFactory: () => {
            const repo = new TestRepository();
            Object.assign(repo, mockRepository);
            return repo;
          },
        },
        {
          provide: getRepositoryToken(TestEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<TestRepository>(TestRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Inheritance and structure', () => {
    it('should be defined', () => {
      expect(repository).toBeDefined();
    });

    it('should extend Repository class', () => {
      expect(repository).toBeInstanceOf(Repository);
    });

    it('should have all Repository methods available', () => {
      expect(typeof repository.find).toBe('function');
      expect(typeof repository.findOne).toBe('function');
      expect(typeof repository.findOneBy).toBe('function');
      expect(typeof repository.findAndCount).toBe('function');
      expect(typeof repository.create).toBe('function');
      expect(typeof repository.save).toBe('function');
      expect(typeof repository.update).toBe('function');
      expect(typeof repository.delete).toBe('function');
      expect(typeof repository.remove).toBe('function');
      expect(typeof repository.count).toBe('function');
      expect(typeof repository.createQueryBuilder).toBe('function');
    });
  });

  describe('find method', () => {
    it('should return all entities when no options provided', async () => {
      (mockRepository.find as jest.Mock).mockResolvedValue(mockEntities);

      const result = await repository.find();

      expect(result).toEqual(mockEntities);
      expect(mockRepository.find).toHaveBeenCalled();
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return entities with options', async () => {
      const options = { where: { name: 'Entity 1' } };
      const expectedResult = [mockEntities[0]];
      (mockRepository.find as jest.Mock).mockResolvedValue(expectedResult);

      const result = await repository.find(options);

      expect(result).toEqual(expectedResult);
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

  describe('findOne method', () => {
    it('should return a single entity', async () => {
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
      const error = new Error('FindOne error');
      (mockRepository.findOne as jest.Mock).mockRejectedValue(error);

      await expect(repository.findOne({ where: { id: 1 } })).rejects.toThrow('FindOne error');
    });
  });

  describe('findOneBy method', () => {
    it('should return a single entity by criteria', async () => {
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

    it('should handle errors', async () => {
      const error = new Error('FindOneBy error');
      (mockRepository.findOneBy as jest.Mock).mockRejectedValue(error);

      await expect(repository.findOneBy({ id: 1 })).rejects.toThrow('FindOneBy error');
    });
  });

  describe('findAndCount method', () => {
    it('should return entities and count', async () => {
      const expectedResult = [mockEntities, mockEntities.length];
      (mockRepository.findAndCount as jest.Mock).mockResolvedValue(expectedResult);

      const result = await repository.findAndCount();

      expect(result).toEqual(expectedResult);
      expect(mockRepository.findAndCount).toHaveBeenCalled();
    });

    it('should return empty array and zero count when no entities', async () => {
      const expectedResult = [[], 0];
      (mockRepository.findAndCount as jest.Mock).mockResolvedValue(expectedResult);

      const result = await repository.findAndCount();

      expect(result).toEqual(expectedResult);
    });

    it('should handle errors', async () => {
      const error = new Error('FindAndCount error');
      (mockRepository.findAndCount as jest.Mock).mockRejectedValue(error);

      await expect(repository.findAndCount()).rejects.toThrow('FindAndCount error');
    });
  });

  describe('create method', () => {
    it('should create a new entity instance', () => {
      const newEntity = { name: 'New Entity' };
      (mockRepository.create as jest.Mock).mockReturnValue({ id: 3, ...newEntity });

      const result = repository.create(newEntity);

      expect(result).toEqual({ id: 3, ...newEntity });
      expect(mockRepository.create).toHaveBeenCalledWith(newEntity);
    });

    it('should create entity without data', () => {
      (mockRepository.create as jest.Mock).mockReturnValue({});

      const result = repository.create();

      expect(result).toEqual({});
      expect(mockRepository.create).toHaveBeenCalledWith();
    });

    it('should create multiple entities with array input', () => {
      const entities = [{ name: 'Entity A' }, { name: 'Entity B' }];
      const createdEntities = [
        { id: 1, name: 'Entity A' },
        { id: 2, name: 'Entity B' },
      ];
      (mockRepository.create as jest.Mock).mockReturnValue(createdEntities);

      const result = repository.create(entities);

      expect(result).toEqual(createdEntities);
      expect(mockRepository.create).toHaveBeenCalledWith(entities);
    });
  });

  describe('save method', () => {
    it('should save a single entity', async () => {
      const savedEntity = { id: 1, name: 'Saved Entity' };
      (mockRepository.save as jest.Mock).mockResolvedValue(savedEntity);

      const result = await repository.save(savedEntity);

      expect(result).toEqual(savedEntity);
      expect(mockRepository.save).toHaveBeenCalledWith(savedEntity);
    });

    it('should save multiple entities', async () => {
      const savedEntities = [
        { id: 1, name: 'Entity 1' },
        { id: 2, name: 'Entity 2' },
      ];
      (mockRepository.save as jest.Mock).mockResolvedValue(savedEntities);

      const result = await repository.save(savedEntities);

      expect(result).toEqual(savedEntities);
      expect(mockRepository.save).toHaveBeenCalledWith(savedEntities);
    });

    it('should handle save errors', async () => {
      const error = new Error('Save error');
      (mockRepository.save as jest.Mock).mockRejectedValue(error);

      await expect(repository.save(mockEntity)).rejects.toThrow('Save error');
    });
  });

  describe('update method', () => {
    it('should update an entity', async () => {
      const updateResult = { affected: 1, raw: {}, generatedMaps: [] };
      (mockRepository.update as jest.Mock).mockResolvedValue(updateResult);

      const result = await repository.update(1, { name: 'Updated Name' });

      expect(result).toEqual(updateResult);
      expect(mockRepository.update).toHaveBeenCalledWith(1, { name: 'Updated Name' });
    });

    it('should update with criteria object', async () => {
      const updateResult = { affected: 1, raw: {}, generatedMaps: [] };
      (mockRepository.update as jest.Mock).mockResolvedValue(updateResult);

      const result = await repository.update({ id: 1 }, { name: 'Updated' });

      expect(result).toEqual(updateResult);
      expect(mockRepository.update).toHaveBeenCalledWith({ id: 1 }, { name: 'Updated' });
    });

    it('should handle update errors', async () => {
      const error = new Error('Update error');
      (mockRepository.update as jest.Mock).mockRejectedValue(error);

      await expect(repository.update(1, { name: 'Test' })).rejects.toThrow('Update error');
    });
  });

  describe('delete method', () => {
    it('should delete an entity by id', async () => {
      const deleteResult = { affected: 1, raw: {} };
      (mockRepository.delete as jest.Mock).mockResolvedValue(deleteResult);

      const result = await repository.delete(1);

      expect(result).toEqual(deleteResult);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should delete with criteria', async () => {
      const deleteResult = { affected: 2, raw: {} };
      (mockRepository.delete as jest.Mock).mockResolvedValue(deleteResult);

      const result = await repository.delete({ name: 'Test' });

      expect(result).toEqual(deleteResult);
      expect(mockRepository.delete).toHaveBeenCalledWith({ name: 'Test' });
    });

    it('should handle delete errors', async () => {
      const error = new Error('Delete error');
      (mockRepository.delete as jest.Mock).mockRejectedValue(error);

      await expect(repository.delete(1)).rejects.toThrow('Delete error');
    });
  });

  describe('remove method', () => {
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
      const error = new Error('Remove error');
      (mockRepository.remove as jest.Mock).mockRejectedValue(error);

      await expect(repository.remove(mockEntity)).rejects.toThrow('Remove error');
    });
  });

  describe('count method', () => {
    it('should return entity count', async () => {
      (mockRepository.count as jest.Mock).mockResolvedValue(5);

      const result = await repository.count();

      expect(result).toBe(5);
      expect(mockRepository.count).toHaveBeenCalled();
    });

    it('should return count with options', async () => {
      const options = { where: { name: 'Test' } };
      (mockRepository.count as jest.Mock).mockResolvedValue(2);

      const result = await repository.count(options);

      expect(result).toBe(2);
      expect(mockRepository.count).toHaveBeenCalledWith(options);
    });

    it('should return zero when no entities', async () => {
      (mockRepository.count as jest.Mock).mockResolvedValue(0);

      const result = await repository.count();

      expect(result).toBe(0);
    });

    it('should handle count errors', async () => {
      const error = new Error('Count error');
      (mockRepository.count as jest.Mock).mockRejectedValue(error);

      await expect(repository.count()).rejects.toThrow('Count error');
    });
  });

  describe('createQueryBuilder method', () => {
    it('should create a query builder', () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockEntities),
      };
      (mockRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = repository.createQueryBuilder('test');

      expect(result).toBe(mockQueryBuilder);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('test');
    });

    it('should create query builder without alias', () => {
      const mockQueryBuilder = {};
      (mockRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = repository.createQueryBuilder();

      expect(result).toBe(mockQueryBuilder);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith();
    });
  });

  describe('Edge cases', () => {
    it('should handle null/undefined inputs gracefully', async () => {
      (mockRepository.find as jest.Mock).mockResolvedValue([]);
      (mockRepository.findOne as jest.Mock).mockResolvedValue(null);
      (mockRepository.save as jest.Mock).mockResolvedValue(null);
      (mockRepository.update as jest.Mock).mockResolvedValue({ affected: 0, raw: {}, generatedMaps: [] });
      (mockRepository.delete as jest.Mock).mockResolvedValue({ affected: 0, raw: {} });

      await expect(repository.find(null as any)).resolves.toEqual([]);
      await expect(repository.findOne(null as any)).resolves.toBeNull();
      await expect(repository.save(null as any)).resolves.toBeNull();
      await expect(repository.update(null as any, null as any)).resolves.toEqual({ affected: 0, raw: {}, generatedMaps: [] });
      await expect(repository.delete(null as any)).resolves.toEqual({ affected: 0, raw: {} });
    });

    it('should handle empty arrays for bulk operations', async () => {
      (mockRepository.save as jest.Mock).mockResolvedValue([]);
      (mockRepository.remove as jest.Mock).mockResolvedValue([]);

      await expect(repository.save([])).resolves.toEqual([]);
      await expect(repository.remove([])).resolves.toEqual([]);
    });

    it('should handle special characters in queries', async () => {
      const specialName = "O'Reilly & Sons";
      (mockRepository.findOneBy as jest.Mock).mockResolvedValue({ id: 1, name: specialName });

      const result = await repository.findOneBy({ name: specialName });

      expect(result).toEqual({ id: 1, name: specialName });
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ name: specialName });
    });
  });
});