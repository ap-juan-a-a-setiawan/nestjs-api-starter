typescript
import { Test } from '@nestjs/testing';
import { EntityRepository } from 'typeorm';
import { RepositoryBase } from '../../App/abstracts/repository.base';
import { UserRepository } from './user.repository';
import { User } from '../entities/user.entity';

jest.mock('typeorm', () => ({
  EntityRepository: jest.fn().mockImplementation(() => (target: any) => target),
}));

jest.mock('../../App/abstracts/repository.base', () => {
  class MockRepositoryBase {
    findAll = jest.fn();
    findById = jest.fn();
    findOne = jest.fn();
    create = jest.fn();
    save = jest.fn();
    update = jest.fn();
    delete = jest.fn();
    count = jest.fn();
  }
  return { RepositoryBase: MockRepositoryBase };
});

jest.mock('../entities/user.entity', () => ({
  User: class User {},
}));

type MockedRepository = UserRepository & {
  findAll: jest.Mock;
  findById: jest.Mock;
  findOne: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
  count: jest.Mock;
};

describe('UserRepository', () => {
  let repository: MockedRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository) as MockedRepository;
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should be an instance of RepositoryBase', () => {
    expect(repository).toBeInstanceOf(RepositoryBase);
  });

  it('should be decorated with @EntityRepository(User)', () => {
    expect(EntityRepository as jest.Mock).toHaveBeenCalledWith(User);
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const users = [{ id: 1, firstName: 'John' }] as User[];
      repository.findAll.mockResolvedValue(users);

      await expect(repository.findAll()).resolves.toEqual(users);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no users exist', async () => {
      repository.findAll.mockResolvedValue([]);

      await expect(repository.findAll()).resolves.toEqual([]);
    });

    it('should propagate an error', async () => {
      const error = new Error('DB error');
      repository.findAll.mockRejectedValue(error);

      await expect(repository.findAll()).rejects.toThrow('DB error');
    });
  });

  describe('findById', () => {
    it('should call the repository with the given id and return the user', async () => {
      const user = { id: 1, firstName: 'John' } as User;
      repository.findById.mockResolvedValue(user);

      await expect(repository.findById(1)).resolves.toEqual(user);
      expect(repository.findById).toHaveBeenCalledWith(1);
    });

    it('should return undefined when the user does not exist', async () => {
      repository.findById.mockResolvedValue(undefined);

      await expect(repository.findById(999)).resolves.toBeUndefined();
      expect(repository.findById).toHaveBeenCalledWith(999);
    });

    it('should propagate an error', async () => {
      repository.findById.mockRejectedValue(new Error('Not found'));

      await expect(repository.findById(1)).rejects.toThrow('Not found');
    });
  });

  describe('findOne', () => {
    it('should call the repository with a criteria object', async () => {
      const user = { id: 1, firstName: 'John' } as User;
      const criteria = { where: { id: 1 } };
      repository.findOne.mockResolvedValue(user);

      await expect(repository.findOne(criteria)).resolves.toEqual(user);
      expect(repository.findOne).toHaveBeenCalledWith(criteria);
    });

    it('should return null when no matching user', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(repository.findOne({ where: { id: 999 } })).resolves.toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });

    it('should propagate an error', async () => {
      repository.findOne.mockRejectedValue(new Error('DB error'));

      await expect(repository.findOne({ where: { id: 1 } })).rejects.toThrow('DB error');
    });
  });

  describe('create', () => {
    it('should call the repository with data and return the created user', async () => {
      const data = { firstName: 'Jane' };
      const user = { id: 2, ...data } as User;
      repository.create.mockResolvedValue(user);

      await expect(repository.create(data)).resolves.toEqual(user);
      expect(repository.create).toHaveBeenCalledWith(data);
    });

    it('should propagate an error', async () => {
      repository.create.mockRejectedValue(new Error('Creation failed'));

      await expect(repository.create({})).rejects.toThrow('Creation failed');
    });
  });

  describe('save', () => {
    it('should call the repository with an entity and return the saved user', async () => {
      const user = { id: 1, firstName: 'John' } as User;
      repository.save.mockResolvedValue(user);

      await expect(repository.save(user)).resolves.toEqual(user);
      expect(repository.save).toHaveBeenCalledWith(user);
    });

    it('should propagate an error', async () => {
      repository.save.mockRejectedValue(new Error('Save failed'));

      await expect(repository.save({} as User)).rejects.toThrow('Save failed');
    });
  });

  describe('update', () => {
    it('should call the repository with id and data', async () => {
      const data = { firstName: 'Jane' };
      const updated = { id: 1, firstName: 'Jane' } as User;
      repository.update.mockResolvedValue(updated);

      await expect(repository.update(1, data)).resolves.toEqual(updated);
      expect(repository.update).toHaveBeenCalledWith(1, data);
    });

    it('should return undefined if entity not found', async () => {
      repository.update.mockResolvedValue(undefined);

      await expect(repository.update(999, {})).resolves.toBeUndefined();
      expect(repository.update).toHaveBeenCalledWith(999, {});
    });

    it('should propagate an error', async () => {
      repository.update.mockRejectedValue(new Error('Update failed'));

      await expect(repository.update(1, {})).rejects.toThrow('Update failed');
    });
  });

  describe('delete', () => {
    it('should call the repository with the id', async () => {
      repository.delete.mockResolvedValue(undefined);

      await expect(repository.delete(1)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should propagate an error', async () => {
      repository.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(repository.delete(1)).rejects.toThrow('Delete failed');
    });
  });

  describe('count', () => {
    it('should call the repository and return the count', async () => {
      repository.count.mockResolvedValue(5);

      await expect(repository.count()).resolves.toBe(5);
      expect(repository.count).toHaveBeenCalledTimes(1);
    });

    it('should return zero when no records', async () => {
      repository.count.mockResolvedValue(0);

      await expect(repository.count()).resolves.toBe(0);
    });

    it('should pass filters to count', async () => {
      const filters = { where: { active: true } };
      repository.count.mockResolvedValue(2);

      await expect(repository.count(filters)).resolves.toBe(2);
      expect(repository.count).toHaveBeenCalledWith(filters);
    });

    it('should propagate an error', async () => {
      repository.count.mockRejectedValue(new Error('Count failed'));

      await expect(repository.count()).rejects.toThrow('Count failed');
    });
  });
});