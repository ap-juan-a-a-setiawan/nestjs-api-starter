typescript
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';

jest.mock('typeorm', () => {
  class MockRepository {
    create = jest.fn();
    save = jest.fn();
    find = jest.fn();
    findOne = jest.fn();
    update = jest.fn();
    delete = jest.fn();
    count = jest.fn();
  }
  return { Repository: MockRepository };
});

import { RepositoryBase } from './repository.base';

class TestEntity {
  id!: number;
  name!: string;
}

class TestRepository extends RepositoryBase<TestEntity> {}

describe('RepositoryBase', () => {
  let repository: TestRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TestRepository],
    }).compile();

    repository = moduleRef.get(TestRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should extend Repository', () => {
    expect(repository).toBeInstanceOf(Repository);
  });

  it('should expose Repository methods', () => {
    expect(typeof repository.create).toBe('function');
    expect(typeof repository.save).toBe('function');
    expect(typeof repository.find).toBe('function');
    expect(typeof repository.findOne).toBe('function');
    expect(typeof repository.update).toBe('function');
    expect(typeof repository.delete).toBe('function');
    expect(typeof repository.count).toBe('function');
  });

  describe('create', () => {
    it('should create an entity from the provided data', () => {
      const data = { name: 'Test' };
      const entity = new TestEntity();
      (repository.create as jest.Mock).mockReturnValue(entity);

      const result = repository.create(data);

      expect(repository.create).toHaveBeenCalledWith(data);
      expect(result).toBe(entity);
    });

    it('should throw an error when creation fails', () => {
      const error = new Error('create failed');
      (repository.create as jest.Mock).mockImplementation(() => {
        throw error;
      });

      expect(() => repository.create({})).toThrow('create failed');
      expect(repository.create).toHaveBeenCalledWith({});
    });
  });

  describe('save', () => {
    it('should save a single entity', async () => {
      const entity = new TestEntity();
      (repository.save as jest.Mock).mockResolvedValue(entity);

      const result = await repository.save(entity);

      expect(repository.save).toHaveBeenCalledWith(entity);
      expect(result).toBe(entity);
    });

    it('should save an array of entities', async () => {
      const entities = [new TestEntity(), new TestEntity()];
      (repository.save as jest.Mock).mockResolvedValue(entities);

      const result = await repository.save(entities);

      expect(repository.save).toHaveBeenCalledWith(entities);
      expect(result).toEqual(entities);
    });

    it('should propagate errors when save rejects', async () => {
      const entity = new TestEntity();
      const error = new Error('save failed');
      (repository.save as jest.Mock).mockRejectedValue(error);

      await expect(repository.save(entity)).rejects.toThrow('save failed');
    });
  });

  describe('find', () => {
    it('should find all entities with no arguments', async () => {
      const entities = [new TestEntity(), new TestEntity()];
      (repository.find as jest.Mock).mockResolvedValue(entities);

      const result = await repository.find();

      expect(repository.find).toHaveBeenCalledWith();
      expect(result).toEqual(entities);
    });

    it('should find entities with options', async () => {
      const options = { where: { name: 'Test' } };
      const entities = [new TestEntity()];
      (repository.find as jest.Mock).mockResolvedValue(entities);

      const result = await repository.find(options);

      expect(repository.find).toHaveBeenCalledWith(options);
      expect(result).toEqual(entities);
    });

    it('should propagate errors when find rejects', async () => {
      const error = new Error('find failed');
      (repository.find as jest.Mock).mockRejectedValue(error);

      await expect(repository.find()).rejects.toThrow('find failed');
    });
  });

  describe('findOne', () => {
    it('should find a single entity by criteria', async () => {
      const entity = new TestEntity();
      const criteria = { id: 1 };
      (repository.findOne as jest.Mock).mockResolvedValue(entity);

      const result = await repository.findOne(criteria);

      expect(repository.findOne).toHaveBeenCalledWith(criteria);
      expect(result).toBe(entity);
    });

    it('should return null when no entity matches', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await repository.findOne({ id: 999 });

      expect(result).toBeNull();
    });

    it('should propagate errors when findOne rejects', async () => {
      const error = new Error('findOne failed');
      (repository.findOne as jest.Mock).mockRejectedValue(error);

      await expect(repository.findOne({ id: 1 })).rejects.toThrow('findOne failed');
    });
  });

  describe('update', () => {
    it('should update an entity and return the update result', async () => {
      const criteria = { id: 1 };
      const partialEntity = { name: 'Updated' };
      const updateResult = { affected: 1 } as any;
      (repository.update as jest.Mock).mockResolvedValue(updateResult);

      const result = await repository.update(criteria, partialEntity);

      expect(repository.update).toHaveBeenCalledWith(criteria, partialEntity);
      expect(result).toEqual(updateResult);
    });

    it('should propagate errors when update rejects', async () => {
      const error = new Error('update failed');
      (repository.update as jest.Mock).mockRejectedValue(error);

      await expect(repository.update({ id: 1 }, { name: 'Updated' })).rejects.toThrow('update failed');
    });
  });

  describe('delete', () => {
    it('should delete an entity and return the delete result', async () => {
      const criteria = { id: 1 };
      const deleteResult = { affected: 1 } as any;
      (repository.delete as jest.Mock).mockResolvedValue(deleteResult);

      const result = await repository.delete(criteria);

      expect(repository.delete).toHaveBeenCalledWith(criteria);
      expect(result).toEqual(deleteResult);
    });

    it('should propagate errors when delete rejects', async () => {
      const error = new Error('delete failed');
      (repository.delete as jest.Mock).mockRejectedValue(error);

      await expect(repository.delete({ id: 1 })).rejects.toThrow('delete failed');
    });
  });

  describe('count', () => {
    it('should count entities', async () => {
      (repository.count as jest.Mock).mockResolvedValue(5);

      const result = await repository.count();

      expect(repository.count).toHaveBeenCalledWith();
      expect(result).toBe(5);
    });

    it('should count entities with options', async () => {
      const options = { where: { name: 'Test' } };
      (repository.count as jest.Mock).mockResolvedValue(3);

      const result = await repository.count(options);

      expect(repository.count).toHaveBeenCalledWith(options);
      expect(result).toBe(3);
    });

    it('should propagate errors when count rejects', async () => {
      const error = new Error('count failed');
      (repository.count as jest.Mock).mockRejectedValue(error);

      await expect(repository.count()).rejects.toThrow('count failed');
    });
  });
});