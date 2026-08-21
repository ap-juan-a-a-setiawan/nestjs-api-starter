import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { RepositoryBase } from './repository.base';

jest.mock('typeorm', () => {
  class MockRepository {
    manager: any;
    queryRunner: any;
    metadata: any;

    constructor(manager: any = {}, queryRunner: any = {}) {
      this.manager = manager;
      this.queryRunner = queryRunner;
      this.metadata = {};
    }

    create = jest.fn();
    createMany = jest.fn();
    save = jest.fn();
    remove = jest.fn();
    softRemove = jest.fn();
    insert = jest.fn();
    update = jest.fn();
    delete = jest.fn();
    softDelete = jest.fn();
    restore = jest.fn();
    count = jest.fn();
    countBy = jest.fn();
    find = jest.fn();
    findBy = jest.fn();
    findAndCount = jest.fn();
    findAndCountBy = jest.fn();
    findOne = jest.fn();
    findOneBy = jest.fn();
    findOneOrFail = jest.fn();
    findOneByOrFail = jest.fn();
    query = jest.fn();
    createQueryBuilder = jest.fn();
    getTargetEntity = jest.fn();
    hasId = jest.fn();
    getId = jest.fn();
    merge = jest.fn();
    preload = jest.fn();
    increment = jest.fn();
    decrement = jest.fn();
    exists = jest.fn();
    existsBy = jest.fn();
  }

  return { Repository: MockRepository };
});

class TestRepository<T> extends RepositoryBase<T> {}

describe('RepositoryBase', () => {
  let repository: TestRepository<any>;
  let moduleRef: TestingModule;

  const repositoryMethods = [
    'create',
    'createMany',
    'save',
    'remove',
    'softRemove',
    'insert',
    'update',
    'delete',
    'softDelete',
    'restore',
    'count',
    'countBy',
    'find',
    'findBy',
    'findAndCount',
    'findAndCountBy',
    'findOne',
    'findOneBy',
    'findOneOrFail',
    'findOneByOrFail',
    'query',
    'createQueryBuilder',
    'getTargetEntity',
    'hasId',
    'getId',
    'merge',
    'preload',
    'increment',
    'decrement',
    'exists',
    'existsBy',
  ];

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: TestRepository,
          useValue: new TestRepository(),
        },
      ],
    }).compile();

    repository = moduleRef.get(TestRepository);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should export RepositoryBase as a class', () => {
    expect(RepositoryBase).toBeDefined();
    expect(typeof RepositoryBase).toBe('function');
  });

  it('should allow extending RepositoryBase', () => {
    class SubRepository<T> extends RepositoryBase<T> {}
    const subRepo = new SubRepository();
    expect(subRepo).toBeInstanceOf(RepositoryBase);
  });

  it('should inherit from Repository and RepositoryBase', () => {
    expect(repository).toBeInstanceOf(TestRepository);
    expect(repository).toBeInstanceOf(RepositoryBase);
    expect(repository).toBeInstanceOf(Repository);
  });

  it('should expose all repository public methods', () => {
    repositoryMethods.forEach((method) => {
      expect(typeof (repository as any)[method]).toBe('function');
    });
  });

  it('should delegate all method calls to the mocked repository methods', () => {
    repositoryMethods.forEach((method) => {
      const mockMethod = (repository as any)[method] as jest.Mock;
      (repository as any)[method]();
      expect(mockMethod).toHaveBeenCalledTimes(1);
    });
  });

  it('should pass provided arguments to the underlying repository methods', () => {
    const entity = { id: 1, name: 'Test' };
    const options = { where: { id: 1 } };

    repository.create(entity);
    expect(repository.create).toHaveBeenCalledWith(entity);

    repository.save(entity);
    expect(repository.save).toHaveBeenCalledWith(entity);

    repository.find(options);
    expect(repository.find).toHaveBeenCalledWith(options);

    repository.findOne(options);
    expect(repository.findOne).toHaveBeenCalledWith(options);
  });

  it('should allow mocking return values for repository methods', async () => {
    const mockFindOne = repository.findOne as jest.Mock;
    mockFindOne.mockResolvedValueOnce(null);
    const result = await repository.findOne({ where: { id: 999 } });
    expect(result).toBeNull();
    expect(mockFindOne).toHaveBeenCalledWith({ where: { id: 999 } });
  });

  it('should store manager and queryRunner from constructor arguments', () => {
    const manager = { query: jest.fn() };
    const queryRunner = { query: jest.fn() };
    const repo = new TestRepository(manager, queryRunner);
    expect(repo.manager).toBe(manager);
    expect(repo.queryRunner).toBe(queryRunner);
  });

  it('should be constructible with no arguments using default mocks', () => {
    const repo = new TestRepository();
    expect(repo.manager).toEqual({});
    expect(repo.queryRunner).toEqual({});
    expect(repo.metadata).toEqual({});
  });
});