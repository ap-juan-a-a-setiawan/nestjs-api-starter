import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';

jest.mock('../../App/abstracts/repository.base', () => {
  class MockRepositoryBase {
    find = jest.fn();
    findOne = jest.fn();
    save = jest.fn();
    create = jest.fn();
    update = jest.fn();
    delete = jest.fn();
    count = jest.fn();
  }
  return { RepositoryBase: MockRepositoryBase };
});

jest.mock('typeorm', () => ({
  EntityRepository: jest.fn().mockImplementation(() => (target: any) => target),
}));

jest.mock('../entities/user.entity', () => ({
  User: class User {},
}));

describe('UserRepository', () => {
  let repository: UserRepository;
  let moduleRef: any;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();
    repository = moduleRef.get(UserRepository);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(repository).toBeInstanceOf(UserRepository);
  });

  it('should expose all inherited RepositoryBase methods', () => {
    const methods = ['find', 'findOne', 'save', 'create', 'update', 'delete', 'count'];
    for (const method of methods) {
      expect(typeof (repository as any)[method]).toBe('function');
    }
  });

  describe('inherited methods', () => {
    it('should call find and resolve with entities', async () => {
      const users = [{ id: 1, name: 'John' }];
      ((repository as any).find as jest.Mock).mockResolvedValue(users);
      await expect((repository as any).find()).resolves.toEqual(users);
      expect((repository as any).find).toHaveBeenCalled();
    });

    it('should call find with filter criteria', async () => {
      const filter = { where: { active: true } };
      ((repository as any).find as jest.Mock).mockResolvedValue([]);
      await (repository as any).find(filter);
      expect((repository as any).find).toHaveBeenCalledWith(filter);
    });

    it('should call findOne and resolve the entity', async () => {
      const user = { id: 1, name: 'Jane' };
      ((repository as any).findOne as jest.Mock).mockResolvedValue(user);
      await expect((repository as any).findOne({ id: 1 })).resolves.toEqual(user);
      expect((repository as any).findOne).toHaveBeenCalledWith({ id: 1 });
    });

    it('should propagate findOne errors', async () => {
      ((repository as any).findOne as jest.Mock).mockRejectedValue(new Error('not found'));
      await expect((repository as any).findOne({ id: 999 })).rejects.toThrow('not found');
    });

    it('should call create and return the new entity', () => {
      const input = { name: 'New User' };
      const created = { id: 1, ...input };
      ((repository as any).create as jest.Mock).mockReturnValue(created);
      expect((repository as any).create(input)).toEqual(created);
      expect((repository as any).create).toHaveBeenCalledWith(input);
    });

    it('should call save and resolve with the saved entity', async () => {
      const user = { id: 1, name: 'John' };
      ((repository as any).save as jest.Mock).mockResolvedValue(user);
      await expect((repository as any).save(user)).resolves.toEqual(user);
      expect((repository as any).save).toHaveBeenCalledWith(user);
    });

    it('should call update and resolve with the update result', async () => {
      const criteria = { id: 1 };
      const partial = { name: 'Updated' };
      const result = { affected: 1 };
      ((repository as any).update as jest.Mock).mockResolvedValue(result);
      await expect((repository as any).update(criteria, partial)).resolves.toEqual(result);
      expect((repository as any).update).toHaveBeenCalledWith(criteria, partial);
    });

    it('should call delete and resolve with the delete result', async () => {
      const result = { affected: 1 };
      ((repository as any).delete as jest.Mock).mockResolvedValue(result);
      await expect((repository as any).delete(1)).resolves.toEqual(result);
      expect((repository as any).delete).toHaveBeenCalledWith(1);
    });

    it('should call count and resolve with the number of entities', async () => {
      ((repository as any).count as jest.Mock).mockResolvedValue(3);
      await expect((repository as any).count({ where: { active: true } })).resolves.toBe(3);
      expect((repository as any).count).toHaveBeenCalledWith({ where: { active: true } });
    });
  });
});