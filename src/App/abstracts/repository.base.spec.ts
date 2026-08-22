import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { RepositoryBase } from './repository.base';

jest.mock('typeorm', () => {
  class Repository {
    save = jest.fn();
    find = jest.fn();
    findOne = jest.fn();
    findOneBy = jest.fn();
    findAndCount = jest.fn();
    delete = jest.fn();
    update = jest.fn();
    insert = jest.fn();
    remove = jest.fn();
    count = jest.fn();
    create = jest.fn();
  }
  return { Repository };
});

class TestEntity {
  id!: number;
  name!: string;
}

class TestRepository extends RepositoryBase<TestEntity> {}

describe('RepositoryBase', () => {
  let repository: TestRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: TestRepository,
          useFactory: () => new TestRepository(),
        },
      ],
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
    expect(repository).toBeInstanceOf(RepositoryBase);
  });

  it('should have inherited Repository methods', () => {
    expect(repository.save).toBeDefined();
    expect(repository.find).toBeDefined();
    expect(repository.findOne).toBeDefined();
    expect(repository.findOneBy).toBeDefined();
    expect(repository.findAndCount).toBeDefined();
    expect(repository.delete).toBeDefined();
    expect(repository.update).toBeDefined();
    expect(repository.insert).toBeDefined();
    expect(repository.remove).toBeDefined();
    expect(repository.count).toBeDefined();
    expect(repository.create).toBeDefined();
  });

  it('should have jest.fn() methods', () => {
    expect(jest.isMockFunction(repository.save)).toBe(true);
    expect(jest.isMockFunction(repository.find)).toBe(true);
    expect(jest.isMockFunction(repository.findOne)).toBe(true);
    expect(jest.isMockFunction(repository.findOneBy)).toBe(true);
    expect(jest.isMockFunction(repository.findAndCount)).toBe(true);
    expect(jest.isMockFunction(repository.delete)).toBe(true);
    expect(jest.isMockFunction(repository.update)).toBe(true);
    expect(jest.isMockFunction(repository.insert)).toBe(true);
    expect(jest.isMockFunction(repository.remove)).toBe(true);
    expect(jest.isMockFunction(repository.count)).toBe(true);
    expect(jest.isMockFunction(repository.create)).toBe(true);
  });

  it('should call save method with entity', async () => {
    const entity = new TestEntity();
    entity.id = 1;
    entity.name = 'Test';
    (repository.save as jest.Mock).mockResolvedValue(entity);

    const result = await repository.save(entity);

    expect(repository.save).toHaveBeenCalledWith(entity);
    expect(result).toBe(entity);
  });

  it('should call find method with options', async () => {
    const options = { where: { name: 'Test' } };
    const entities = [new TestEntity()];
    (repository.find as jest.Mock).mockResolvedValue(entities);

    const result = await repository.find(options);

    expect(repository.find).toHaveBeenCalledWith(options);
    expect(result).toEqual(entities);
  });

  it('should call findOne method with criteria', async () => {
    const criteria = { where: { id: 1 } };
    const entity = new TestEntity();
    entity.id = 1;
    (repository.findOne as jest.Mock).mockResolvedValue(entity);

    const result = await repository.findOne(criteria);

    expect(repository.findOne).toHaveBeenCalledWith(criteria);
    expect(result).toBe(entity);
  });

  it('should call findOneBy method with criteria', async () => {
    const criteria = { id: 1 };
    const entity = new TestEntity();
    entity.id = 1;
    (repository.findOneBy as jest.Mock).mockResolvedValue(entity);

    const result = await repository.findOneBy(criteria);

    expect(repository.findOneBy).toHaveBeenCalledWith(criteria);
    expect(result).toBe(entity);
  });

  it('should call findAndCount method with options', async () => {
    const options = { where: { name: 'Test' } };
    const entities = [new TestEntity()];
    const count = 1;
    (repository.findAndCount as jest.Mock).mockResolvedValue([entities, count]);

    const result = await repository.findAndCount(options);

    expect(repository.findAndCount).toHaveBeenCalledWith(options);
    expect(result).toEqual([entities, count]);
  });

  it('should call delete method with id', async () => {
    const id = 1;
    const deleteResult = { affected: 1 } as any;
    (repository.delete as jest.Mock).mockResolvedValue(deleteResult);

    const result = await repository.delete(id);

    expect(repository.delete).toHaveBeenCalledWith(id);
    expect(result).toBe(deleteResult);
  });

  it('should call update method with criteria and partial entity', async () => {
    const criteria = 1;
    const partialEntity = { name: 'Updated' };
    const updateResult = { affected: 1 } as any;
    (repository.update as jest.Mock).mockResolvedValue(updateResult);

    const result = await repository.update(criteria, partialEntity);

    expect(repository.update).toHaveBeenCalledWith(criteria, partialEntity);
    expect(result).toBe(updateResult);
  });

  it('should call insert method with entity', async () => {
    const entity = new TestEntity();
    entity.name = 'New';
    const insertResult = { identifiers: [{ id: 1 }] } as any;
    (repository.insert as jest.Mock).mockResolvedValue(insertResult);

    const result = await repository.insert(entity);

    expect(repository.insert).toHaveBeenCalledWith(entity);
    expect(result).toBe(insertResult);
  });

  it('should call remove method with entity', async () => {
    const entity = new TestEntity();
    entity.id = 1;
    (repository.remove as jest.Mock).mockResolvedValue(entity);

    const result = await repository.remove(entity);

    expect(repository.remove).toHaveBeenCalledWith(entity);
    expect(result).toBe(entity);
  });

  it('should call count method with options', async () => {
    const options = { where: { name: 'Test' } };
    (repository.count as jest.Mock).mockResolvedValue(2);

    const result = await repository.count(options);

    expect(repository.count).toHaveBeenCalledWith(options);
    expect(result).toBe(2);
  });

  it('should call create method with partial entity', () => {
    const partial = { name: 'Test' };
    const entity = new TestEntity();
    entity.name = 'Test';
    (repository.create as jest.Mock).mockReturnValue(entity);

    const result = repository.create(partial);

    expect(repository.create).toHaveBeenCalledWith(partial);
    expect(result).toBe(entity);
  });

  it('should handle save method rejection', async () => {
    const entity = new TestEntity();
    const error = new Error('Save failed');
    (repository.save as jest.Mock).mockRejectedValue(error);

    await expect(repository.save(entity)).rejects.toThrow('Save failed');
    expect(repository.save).toHaveBeenCalledWith(entity);
  });

  it('should handle find method rejection', async () => {
    const error = new Error('Find failed');
    (repository.find as jest.Mock).mockRejectedValue(error);

    await expect(repository.find()).rejects.toThrow('Find failed');
    expect(repository.find).toHaveBeenCalled();
  });

  it('should handle delete method rejection', async () => {
    const id = 1;
    const error = new Error('Delete failed');
    (repository.delete as jest.Mock).mockRejectedValue(error);

    await expect(repository.delete(id)).rejects.toThrow('Delete failed');
    expect(repository.delete).toHaveBeenCalledWith(id);
  });
});