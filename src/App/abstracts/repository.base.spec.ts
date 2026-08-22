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
      exists: jest.fn(),
      createQueryBuilder: jest.fn(),
      manager: {
        transaction: jest.fn(),
      } as any,
      metadata: {
        target: TestEntity,
        name: 'TestEntity',
        tableName: 'test_entity',
        columns: [],
        relations: [],
        indices: [],
        uniques: [],
        checks: [],
        exclusions: [],
        foreignKeys: [],
        generatedColumns: [],
        primaryColumns: [],
        connection: {},
      } as any,
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
    // Inject mock repository into the base class
    Object.assign(repository, mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Inheritance from Repository', () => {
    it('should be defined', () => {
      expect(repository).toBeDefined();
    });

    it('should extend Repository class', () => {
      expect(repository).toBeInstanceOf(Repository);
    });

    it('should have access to repository methods', () => {
      expect(repository.find).toBeDefined();
      expect(repository.findOne).toBeDefined();
      expect(repository.save).toBeDefined();
      expect(repository.delete).toBeDefined();
      expect(repository.create).toBeDefined();
      expect(repository.update).toBeDefined();
      expect(repository.count).toBeDefined();
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
      const options = { where: { name: 'Entity 1' } };
      (mockRepository.find as jest.Mock).mockResolvedValue([mockEntities[0]]);

      const result = await repository.find(options);

      expect(result).toEqual([mockEntities[0]]);
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
      const error = new Error('Find one error');
      (mockRepository.findOne as jest.Mock).mockRejectedValue(error);

      await expect(repository.findOne({ where: { id: 1 } })).rejects.toThrow('Find one error');
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

    it('should handle errors', async () => {
      const error = new Error('Find one by error');
      (mockRepository.findOneBy as jest.Mock).mockRejectedValue(error);

      await expect(repository.findOneBy({ id: 1 })).rejects.toThrow('Find one by error');
    });
  });

  describe('findAndCount', () => {
    it('should find entities and count', async () => {
      const result = [mockEntities, mockEntities.length];
      (mockRepository.findAndCount as jest.Mock).mockResolvedValue(result);

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

    it('should handle errors', async () => {
      const error = new Error('Find and count error');
      (mockRepository.findAndCount as jest.Mock).mockRejectedValue(error);

      await expect(repository.findAndCount()).rejects.toThrow('Find and count error');
    });
  });

  describe('create', () => {
    it('should create a new entity instance', () => {
      const newEntity = { name: 'New Entity' };
      (mockRepository.create as jest.Mock).mockReturnValue({ ...newEntity, id: undefined });

      const result = repository.create(newEntity);

      expect(result).toEqual({ ...newEntity, id: undefined });
      expect(mockRepository.create).toHaveBeenCalledWith(newEntity);
    });

    it('should create entity with no arguments', () => {
      (mockRepository.create as jest.Mock).mockReturnValue({});

      const result = repository.create();

      expect(result).toEqual({});
      expect(mockRepository.create).toHaveBeenCalledWith();
    });

    it('should create multiple entities', () => {
      const entities = [{ name: 'Entity 1' }, { name: 'Entity 2' }];
      (mockRepository.create as jest.Mock).mockReturnValue(entities);

      const result = repository.create(entities);

      expect(result).toEqual(entities);
      expect(mockRepository.create).toHaveBeenCalledWith(entities);
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
      const error = new Error('Save error');
      (mockRepository.save as jest.Mock).mockRejectedValue(error);

      await expect(repository.save(mockEntity)).rejects.toThrow('Save error');
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
      const error = new Error('Update error');
      (mockRepository.update as jest.Mock).mockRejectedValue(error);

      await expect(repository.update(1, { name: 'Updated' })).rejects.toThrow('Update error');
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

    it('should delete an entity by criteria', async () => {
      const deleteResult = { affected: 1, raw: {} };
      (mockRepository.delete as jest.Mock).mockResolvedValue(deleteResult);

      const result = await repository.delete({ id: 1 });

      expect(result).toEqual(deleteResult);
      expect(mockRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should handle delete errors', async () => {
      const error = new Error('Delete error');
      (mockRepository.delete as jest.Mock).mockRejectedValue(error);

      await expect(repository.delete(1)).rejects.toThrow('Delete error');
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
      const error = new Error('Remove error');
      (mockRepository.remove as jest.Mock).mockRejectedValue(error);

      await expect(repository.remove(mockEntity)).rejects.toThrow('Remove error');
    });
  });

  describe('count', () => {
    it('should count all entities', async () => {
      (mockRepository.count as jest.Mock).mockResolvedValue(5);

      const result = await repository.count();

      expect(result).toBe(5);
      expect(mockRepository.count).toHaveBeenCalled();
    });

    it('should count entities with options', async () => {
      const options = { where: { name: 'Entity 1' } };
      (mockRepository.count as jest.Mock).mockResolvedValue(1);

      const result = await repository.count(options);

      expect(result).toBe(1);
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

  describe('exists', () => {
    it('should check if entity exists', async () => {
      (mockRepository.exists as jest.Mock).mockResolvedValue(true);

      const result = await repository.exists({ where: { id: 1 } });

      expect(result).toBe(true);
      expect(mockRepository.exists).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return false when entity does not exist', async () => {
      (mockRepository.exists as jest.Mock).mockResolvedValue(false);

      const result = await repository.exists({ where: { id: 999 } });

      expect(result).toBe(false);
    });

    it('should handle exists errors', async () => {
      const error = new Error('Exists error');
      (mockRepository.exists as jest.Mock).mockRejectedValue(error);

      await expect(repository.exists({ where: { id: 1 } })).rejects.toThrow('Exists error');
    });
  });

  describe('createQueryBuilder', () => {
    it('should create a query builder', () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
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

  describe('manager', () => {
    it('should have access to manager', () => {
      expect(repository.manager).toBeDefined();
    });

    it('should support transactions', async () => {
      const mockTransactionalEntityManager = {};
      (mockRepository.manager.transaction as jest.Mock).mockImplementation(
        async (cb: any) => cb(mockTransactionalEntityManager),
      );

      const result = await repository.manager.transaction(async (manager) => {
        return 'transaction result';
      });

      expect(result).toBe('transaction result');
      expect(mockRepository.manager.transaction).toHaveBeenCalled();
    });
  });

  describe('metadata', () => {
    it('should have metadata', () => {
      expect(repository.metadata).toBeDefined();
      expect(repository.metadata.target).toBe(TestEntity);
      expect(repository.metadata.tableName).toBe('test_entity');
    });
  });

  describe('Edge cases', () => {
    it('should handle null entity in save', async () => {
      (mockRepository.save as jest.Mock).mockResolvedValue(null);

      const result = await repository.save(null as any);

      expect(result).toBeNull();
    });

    it('should handle undefined options in find', async () => {
      (mockRepository.find as jest.Mock).mockResolvedValue(mockEntities);

      const result = await repository.find(undefined);

      expect(result).toEqual(mockEntities);
      expect(mockRepository.find).toHaveBeenCalledWith(undefined);
    });

    it('should handle empty array in save', async () => {
      (mockRepository.save as jest.Mock).mockResolvedValue([]);

      const result = await repository.save([]);

      expect(result).toEqual([]);
    });

    it('should handle delete with non-existent id', async () => {
      const deleteResult = { affected: 0, raw: {} };
      (mockRepository.delete as jest.Mock).mockResolvedValue(deleteResult);

      const result = await repository.delete(999);

      expect(result.affected).toBe(0);
    });

    it('should handle update with non-existent id', async () => {
      const updateResult = { affected: 0, raw: {}, generatedMaps: [] };
      (mockRepository.update as jest.Mock).mockResolvedValue(updateResult);

      const result = await repository.update(999, { name: 'Updated' });

      expect(result.affected).toBe(0);
    });
  });
});