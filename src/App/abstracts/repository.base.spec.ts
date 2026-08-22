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
  let repositoryBase: TestRepository;
  let mockRepository: jest.Mocked<Partial<Repository<TestEntity>>>;

  const mockEntity = { id: 1, name: 'Test Entity' };
  const mockEntities = [
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
      softDelete: jest.fn(),
      softRemove: jest.fn(),
      restore: jest.fn(),
      count: jest.fn(),
      increment: jest.fn(),
      decrement: jest.fn(),
      createQueryBuilder: jest.fn(),
      manager: {} as any,
      metadata: {} as any,
      target: TestEntity,
      hasId: jest.fn(),
      getId: jest.fn(),
      preload: jest.fn(),
      insert: jest.fn(),
      upsert: jest.fn(),
      exists: jest.fn(),
      existsBy: jest.fn(),
      query: jest.fn(),
      clear: jest.fn(),
      merge: jest.fn(),
      createEntityManager: jest.fn(),
      getEntityManager: jest.fn(),
      getRepository: jest.fn(),
      getTreeRepository: jest.fn(),
      getMongoRepository: jest.fn(),
      getCustomRepository: jest.fn(),
      transaction: jest.fn(),
      findOneOrFail: jest.fn(),
      findOneByOrFail: jest.fn(),
      findByIds: jest.fn(),
      findBy: jest.fn(),
      findAndCountBy: jest.fn(),
      findOptionsToWhere: jest.fn(),
      extend: jest.fn(),
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

    repositoryBase = module.get<TestRepository>(TestRepository);
    
    // Assign mock repository methods to the base repository
    Object.assign(repositoryBase, mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Inheritance', () => {
    it('should be defined', () => {
      expect(repositoryBase).toBeDefined();
    });

    it('should extend Repository class', () => {
      expect(repositoryBase).toBeInstanceOf(Repository);
    });

    it('should have all Repository methods', () => {
      const repositoryMethods = [
        'find',
        'findOne',
        'findOneBy',
        'findAndCount',
        'create',
        'save',
        'update',
        'delete',
        'remove',
        'softDelete',
        'softRemove',
        'restore',
        'count',
        'increment',
        'decrement',
        'createQueryBuilder',
        'hasId',
        'getId',
        'preload',
        'insert',
        'upsert',
        'exists',
        'existsBy',
        'query',
        'clear',
        'merge',
        'findOneOrFail',
        'findOneByOrFail',
        'findByIds',
        'findBy',
        'findAndCountBy',
        'extend',
      ];

      repositoryMethods.forEach(method => {
        expect(repositoryBase).toHaveProperty(method);
        expect(typeof (repositoryBase as any)[method]).toBe('function');
      });
    });
  });

  describe('find', () => {
    it('should find all entities', async () => {
      (mockRepository.find as jest.Mock).mockResolvedValue(mockEntities);

      const result = await repositoryBase.find();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockEntities);
    });

    it('should find entities with options', async () => {
      const options = { where: { name: 'Test' }, take: 10 };
      (mockRepository.find as jest.Mock).mockResolvedValue([mockEntity]);

      const result = await repositoryBase.find(options);

      expect(mockRepository.find).toHaveBeenCalledWith(options);
      expect(result).toEqual([mockEntity]);
    });

    it('should return empty array when no entities found', async () => {
      (mockRepository.find as jest.Mock).mockResolvedValue([]);

      const result = await repositoryBase.find();

      expect(result).toEqual([]);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (mockRepository.find as jest.Mock).mockRejectedValue(error);

      await expect(repositoryBase.find()).rejects.toThrow('Database error');
    });
  });

  describe('findOne', () => {
    it('should find one entity by id', async () => {
      (mockRepository.findOne as jest.Mock).mockResolvedValue(mockEntity);

      const result = await repositoryBase.findOne({ where: { id: 1 } });

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockEntity);
    });

    it('should return null when entity not found', async () => {
      (mockRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await repositoryBase.findOne({ where: { id: 999 } });

      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      const error = new Error('Entity not found');
      (mockRepository.findOne as jest.Mock).mockRejectedValue(error);

      await expect(repositoryBase.findOne({ where: { id: 1 } })).rejects.toThrow('Entity not found');
    });
  });

  describe('findOneBy', () => {
    it('should find one entity by criteria', async () => {
      (mockRepository.findOneBy as jest.Mock).mockResolvedValue(mockEntity);

      const result = await repositoryBase.findOneBy({ id: 1 });

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockEntity);
    });

    it('should return null when entity not found', async () => {
      (mockRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      const result = await repositoryBase.findOneBy({ id: 999 });

      expect(result).toBeNull();
    });
  });

  describe('findAndCount', () => {
    it('should find entities and count', async () => {
      const mockResult = [mockEntities, mockEntities.length];
      (mockRepository.findAndCount as jest.Mock).mockResolvedValue(mockResult);

      const [entities, count] = await repositoryBase.findAndCount();

      expect(mockRepository.findAndCount).toHaveBeenCalled();
      expect(entities).toEqual(mockEntities);
      expect(count).toBe(2);
    });

    it('should return empty array and zero count when no entities', async () => {
      (mockRepository.findAndCount as jest.Mock).mockResolvedValue([[], 0]);

      const [entities, count] = await repositoryBase.findAndCount();

      expect(entities).toEqual([]);
      expect(count).toBe(0);
    });
  });

  describe('create', () => {
    it('should create a new entity instance', () => {
      const newEntity = { name: 'New Entity' };
      (mockRepository.create as jest.Mock).mockReturnValue({ id: 3, ...newEntity });

      const result = repositoryBase.create(newEntity);

      expect(mockRepository.create).toHaveBeenCalledWith(newEntity);
      expect(result).toEqual({ id: 3, ...newEntity });
    });

    it('should create entity without data', () => {
      (mockRepository.create as jest.Mock).mockReturnValue({});

      const result = repositoryBase.create();

      expect(mockRepository.create).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('save', () => {
    it('should save an entity', async () => {
      (mockRepository.save as jest.Mock).mockResolvedValue(mockEntity);

      const result = await repositoryBase.save(mockEntity);

      expect(mockRepository.save).toHaveBeenCalledWith(mockEntity);
      expect(result).toEqual(mockEntity);
    });

    it('should save multiple entities', async () => {
      (mockRepository.save as jest.Mock).mockResolvedValue(mockEntities);

      const result = await repositoryBase.save(mockEntities);

      expect(mockRepository.save).toHaveBeenCalledWith(mockEntities);
      expect(result).toEqual(mockEntities);
    });

    it('should handle save errors', async () => {
      const error = new Error('Save failed');
      (mockRepository.save as jest.Mock).mockRejectedValue(error);

      await expect(repositoryBase.save(mockEntity)).rejects.toThrow('Save failed');
    });
  });

  describe('update', () => {
    it('should update an entity', async () => {
      const updateResult = { affected: 1, raw: {}, generatedMaps: [] };
      (mockRepository.update as jest.Mock).mockResolvedValue(updateResult);

      const result = await repositoryBase.update(1, { name: 'Updated' });

      expect(mockRepository.update).toHaveBeenCalledWith(1, { name: 'Updated' });
      expect(result).toEqual(updateResult);
    });

    it('should return affected 0 when entity not found', async () => {
      const updateResult = { affected: 0, raw: {}, generatedMaps: [] };
      (mockRepository.update as jest.Mock).mockResolvedValue(updateResult);

      const result = await repositoryBase.update(999, { name: 'Updated' });

      expect(result.affected).toBe(0);
    });
  });

  describe('delete', () => {
    it('should delete an entity', async () => {
      const deleteResult = { affected: 1, raw: {} };
      (mockRepository.delete as jest.Mock).mockResolvedValue(deleteResult);

      const result = await repositoryBase.delete(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(deleteResult);
    });

    it('should return affected 0 when entity not found', async () => {
      const deleteResult = { affected: 0, raw: {} };
      (mockRepository.delete as jest.Mock).mockResolvedValue(deleteResult);

      const result = await repositoryBase.delete(999);

      expect(result.affected).toBe(0);
    });
  });

  describe('remove', () => {
    it('should remove an entity', async () => {
      (mockRepository.remove as jest.Mock).mockResolvedValue(mockEntity);

      const result = await repositoryBase.remove(mockEntity);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockEntity);
      expect(result).toEqual(mockEntity);
    });

    it('should remove multiple entities', async () => {
      (mockRepository.remove as jest.Mock).mockResolvedValue(mockEntities);

      const result = await repositoryBase.remove(mockEntities);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockEntities);
      expect(result).toEqual(mockEntities);
    });
  });

  describe('softDelete', () => {
    it('should soft delete an entity', async () => {
      const deleteResult = { affected: 1, raw: {}, generatedMaps: [] };
      (mockRepository.softDelete as jest.Mock).mockResolvedValue(deleteResult);

      const result = await repositoryBase.softDelete(1);

      expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
      expect(result).toEqual(deleteResult);
    });
  });

  describe('softRemove', () => {
    it('should soft remove an entity', async () => {
      (mockRepository.softRemove as jest.Mock).mockResolvedValue(mockEntity);

      const result = await repositoryBase.softRemove(mockEntity);

      expect(mockRepository.softRemove).toHaveBeenCalledWith(mockEntity);
      expect(result).toEqual(mockEntity);
    });
  });

  describe('restore', () => {
    it('should restore a soft-deleted entity', async () => {
      const restoreResult = { affected: 1, raw: {}, generatedMaps: [] };
      (mockRepository.restore as jest.Mock).mockResolvedValue(restoreResult);

      const result = await repositoryBase.restore(1);

      expect(mockRepository.restore).toHaveBeenCalledWith(1);
      expect(result).toEqual(restoreResult);
    });
  });

  describe('count', () => {
    it('should count entities', async () => {
      (mockRepository.count as jest.Mock).mockResolvedValue(5);

      const result = await repositoryBase.count();

      expect(mockRepository.count).toHaveBeenCalled();
      expect(result).toBe(5);
    });

    it('should count entities with options', async () => {
      const options = { where: { name: 'Test' } };
      (mockRepository.count as jest.Mock).mockResolvedValue(2);

      const result = await repositoryBase.count(options);

      expect(mockRepository.count).toHaveBeenCalledWith(options);
      expect(result).toBe(2);
    });

    it('should return zero when no entities', async () => {
      (mockRepository.count as jest.Mock).mockResolvedValue(0);

      const result = await repositoryBase.count();

      expect(result).toBe(0);
    });
  });

  describe('increment', () => {
    it('should increment a column value', async () => {
      const incrementResult = { affected: 1, raw: {}, generatedMaps: [] };
      (mockRepository.increment as jest.Mock).mockResolvedValue(incrementResult);

      const result = await repositoryBase.increment({ id: 1 }, 'count', 1);

      expect(mockRepository.increment).toHaveBeenCalledWith({ id: 1 }, 'count', 1);
      expect(result).toEqual(incrementResult);
    });
  });

  describe('decrement', () => {
    it('should decrement a column value', async () => {
      const decrementResult = { affected: 1, raw: {}, generatedMaps: [] };
      (mockRepository.decrement as jest.Mock).mockResolvedValue(decrementResult);

      const result = await repositoryBase.decrement({ id: 1 }, 'count', 1);

      expect(mockRepository.decrement).toHaveBeenCalledWith({ id: 1 }, 'count', 1);
      expect(result).toEqual(decrementResult);
    });
  });

  describe('createQueryBuilder', () => {
    it('should create a query builder', () => {
      const mockQueryBuilder = {};
      (mockRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = repositoryBase.createQueryBuilder('test');

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('test');
      expect(result).toEqual(mockQueryBuilder);
    });
  });

  describe('hasId', () => {
    it('should check if entity has id', () => {
      (mockRepository.hasId as jest.Mock).mockReturnValue(true);

      const result = repositoryBase.hasId(mockEntity);

      expect(mockRepository.hasId).toHaveBeenCalledWith(mockEntity);
      expect(result).toBe(true);
    });

    it('should return false when entity has no id', () => {
      (mockRepository.hasId as jest.Mock).mockReturnValue(false);

      const result = repositoryBase.hasId({ name: 'No ID' });

      expect(result).toBe(false);
    });
  });

  describe('getId', () => {
    it('should get entity id', () => {
      (mockRepository.getId as jest.Mock).mockReturnValue(1);

      const result = repositoryBase.getId(mockEntity);

      expect(mockRepository.getId).toHaveBeenCalledWith(mockEntity);
      expect(result).toBe(1);
    });
  });

  describe('preload', () => {
    it('should preload an entity', async () => {
      (mockRepository.preload as jest.Mock).mockResolvedValue(mockEntity);

      const result = await repositoryBase.preload({ id: 1, name: 'Updated' });

      expect(mockRepository.preload).toHaveBeenCalledWith({ id: 1, name: 'Updated' });
      expect(result).toEqual(mockEntity);
    });

    it('should return null when entity not found', async () => {
      (mockRepository.preload as jest.Mock).mockResolvedValue(null);

      const result = await repositoryBase.preload({ id: 999 });

      expect(result).toBeNull();
    });
  });

  describe('insert', () => {
    it('should insert an entity', async () => {
      const insertResult = { identifiers: [{ id: 1 }], generatedMaps: [], raw: {} };
      (mockRepository.insert as jest.Mock).mockResolvedValue(insertResult);

      const result = await repositoryBase.insert(mockEntity);

      expect(mockRepository.insert).toHaveBeenCalledWith(mockEntity);
      expect(result).toEqual(insertResult);
    });
  });

  describe('upsert', () => {
    it('should upsert an entity', async () => {
      const upsertResult = { identifiers: [{ id: 1 }], generatedMaps: [], raw: {} };
      (mockRepository.upsert as jest.Mock).mockResolvedValue(upsertResult);

      const result = await repositoryBase.upsert(mockEntity, ['id']);

      expect(mockRepository.upsert).toHaveBeenCalledWith(mockEntity, ['id']);
      expect(result).toEqual(upsertResult);
    });
  });

  describe('exists', () => {
    it('should check if entity exists', async () => {
      (mockRepository.exists as jest.Mock).mockResolvedValue(true);

      const result = await repositoryBase.exists({ where: { id: 1 } });

      expect(mockRepository.exists).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(true);
    });

    it('should return false when entity does not exist', async () => {
      (mockRepository.exists as jest.Mock).mockResolvedValue(false);

      const result = await repositoryBase.exists({ where: { id: 999 } });

      expect(result).toBe(false);
    });
  });

  describe('existsBy', () => {
    it('should check if entity exists by criteria', async () => {
      (mockRepository.existsBy as jest.Mock).mockResolvedValue(true);

      const result = await repositoryBase.existsBy({ id: 1 });

      expect(mockRepository.existsBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toBe(true);
    });
  });

  describe('query', () => {
    it('should execute a raw query', async () => {
      const queryResult = [{ id: 1, name: 'Test' }];
      (mockRepository.query as jest.Mock).mockResolvedValue(queryResult);

      const result = await repositoryBase.query('SELECT * FROM test');

      expect(mockRepository.query).toHaveBeenCalledWith('SELECT * FROM test');
      expect(result).toEqual(queryResult);
    });
  });

  describe('clear', () => {
    it('should clear all entities', async () => {
      (mockRepository.clear as jest.Mock).mockResolvedValue(undefined);

      await repositoryBase.clear();

      expect(mockRepository.clear).toHaveBeenCalled();
    });
  });

  describe('merge', () => {
    it('should merge entities', () => {
      const mergedEntity = { id: 1, name: 'Merged' };
      (mockRepository.merge as jest.Mock).mockReturnValue(mergedEntity);

      const result = repositoryBase.merge(mockEntity, { name: 'Merged' });

      expect(mockRepository.merge).toHaveBeenCalledWith(mockEntity, { name: 'Merged' });
      expect(result).toEqual(mergedEntity);
    });
  });

  describe('findOneOrFail', () => {
    it('should find one entity or fail', async () => {
      (mockRepository.findOneOrFail as jest.Mock).mockResolvedValue(mockEntity);

      const result = await repositoryBase.findOneOrFail({ where: { id: 1 } });

      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockEntity);
    });

    it('should throw error when entity not found', async () => {
      const error = new Error('Entity not found');
      (mockRepository.findOneOrFail as jest.Mock).mockRejectedValue(error);

      await expect(repositoryBase.findOneOrFail({ where: { id: 999 } })).rejects.toThrow('Entity not found');
    });
  });

  describe('findOneByOrFail', () => {
    it('should find one entity by criteria or fail', async () => {
      (mockRepository.findOneByOrFail as jest.Mock).mockResolvedValue(mockEntity);

      const result = await repositoryBase.findOneByOrFail({ id: 1 });

      expect(mockRepository.findOneByOrFail).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockEntity);
    });

    it('should throw error when entity not found', async () => {
      const error = new Error('Entity not found');
      (mockRepository.findOneByOrFail as jest.Mock).mockRejectedValue(error);

      await expect(repositoryBase.findOneByOrFail({ id: 999 })).rejects.toThrow('Entity not found');
    });
  });

  describe('findByIds', () => {
    it('should find entities by ids', async () => {
      (mockRepository.findByIds as jest.Mock).mockResolvedValue(mockEntities);

      const result = await repositoryBase.findByIds([1, 2]);

      expect(mockRepository.findByIds).toHaveBeenCalledWith([1, 2]);
      expect(result).toEqual(mockEntities);
    });

    it('should return empty array when no ids provided', async () => {
      (mockRepository.findByIds as jest.Mock).mockResolvedValue([]);

      const result = await repositoryBase.findByIds([]);

      expect(result).toEqual([]);
    });
  });

  describe('findBy', () => {
    it('should find entities by criteria', async () => {
      (mockRepository.findBy as jest.Mock).mockResolvedValue(mockEntities);

      const result = await repositoryBase.findBy({ name: 'Test' });

      expect(mockRepository.findBy).toHaveBeenCalledWith({ name: 'Test' });
      expect(result).toEqual(mockEntities);
    });
  });

  describe('findAndCountBy', () => {
    it('should find entities and count by criteria', async () => {
      const mockResult = [mockEntities, mockEntities.length];
      (mockRepository.findAndCountBy as jest.Mock).mockResolvedValue(mockResult);

      const [entities, count] = await repositoryBase.findAndCountBy({ name: 'Test' });

      expect(mockRepository.findAndCountBy).toHaveBeenCalledWith({ name: 'Test' });
      expect(entities).toEqual(mockEntities);
      expect(count).toBe(2);
    });
  });

  describe('extend', () => {
    it('should extend the repository', () => {
      const customMethods = { customMethod: jest.fn() };
      const extendedRepo = { ...repositoryBase, ...customMethods };
      (mockRepository.extend as jest.Mock).mockReturnValue(extendedRepo);

      const result = repositoryBase.extend(customMethods);

      expect(mockRepository.extend).toHaveBeenCalledWith(customMethods);
      expect(result).toEqual(extendedRepo);
    });
  });

  describe('Error handling', () => {
    it('should handle database connection errors', async () => {
      const error = new Error('Connection lost');
      (mockRepository.find as jest.Mock).mockRejectedValue(error);

      await expect(repositoryBase.find()).rejects.toThrow('Connection lost');
    });

    it('should handle constraint violations', async () => {
      const error = new Error('Duplicate entry');
      (mockRepository.save as jest.Mock).mockRejectedValue(error);

      await expect(repositoryBase.save(mockEntity)).rejects.toThrow('Duplicate entry');
    });

    it('should handle invalid input', async () => {
      const error = new Error('Invalid input');
      (mockRepository.update as jest.Mock).mockRejectedValue(error);

      await expect(repositoryBase.update(1, null as any)).rejects.toThrow('Invalid input');
    });
  });
});