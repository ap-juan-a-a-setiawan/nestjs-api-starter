import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from '../entities/user.entity';
import { RepositoryBase } from '../../App/abstracts/repository.base';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockRepositoryBase: jest.Mocked<RepositoryBase<User>>;

  const mockUser: User = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'hashedPassword',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsers: User[] = [
    mockUser,
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      password: 'hashedPassword2',
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    mockRepositoryBase = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      findAndCount: jest.fn(),
      createQueryBuilder: jest.fn(),
      manager: jest.fn() as any,
      metadata: jest.fn() as any,
      target: jest.fn() as any,
      hasId: jest.fn(),
      getId: jest.fn(),
      preload: jest.fn(),
      merge: jest.fn(),
      remove: jest.fn(),
      softDelete: jest.fn(),
      softRemove: jest.fn(),
      restore: jest.fn(),
      recover: jest.fn(),
      increment: jest.fn(),
      decrement: jest.fn(),
      query: jest.fn(),
      clear: jest.fn(),
      insert: jest.fn(),
      upsert: jest.fn(),
      exists: jest.fn(),
      existsBy: jest.fn(),
      findOneBy: jest.fn(),
      findOneById: jest.fn(),
      findBy: jest.fn(),
      findAndCountBy: jest.fn(),
      countBy: jest.fn(),
      sum: jest.fn(),
      average: jest.fn(),
      minimum: jest.fn(),
      maximum: jest.fn(),
      extend: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepositoryBase,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    // Override the internal repository with the mock
    (userRepository as any).repository = mockRepositoryBase;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('find', () => {
    it('should return all users when no options provided', async () => {
      mockRepositoryBase.find.mockResolvedValue(mockUsers);

      const result = await userRepository.find();

      expect(result).toEqual(mockUsers);
      expect(mockRepositoryBase.find).toHaveBeenCalledWith(undefined);
    });

    it('should return users with provided options', async () => {
      const options = { where: { isActive: true } };
      const filteredUsers = [mockUser];
      mockRepositoryBase.find.mockResolvedValue(filteredUsers);

      const result = await userRepository.find(options);

      expect(result).toEqual(filteredUsers);
      expect(mockRepositoryBase.find).toHaveBeenCalledWith(options);
    });

    it('should return empty array when no users exist', async () => {
      mockRepositoryBase.find.mockResolvedValue([]);

      const result = await userRepository.find();

      expect(result).toEqual([]);
      expect(mockRepositoryBase.find).toHaveBeenCalled();
    });

    it('should throw error when database query fails', async () => {
      const error = new Error('Database connection failed');
      mockRepositoryBase.find.mockRejectedValue(error);

      await expect(userRepository.find()).rejects.toThrow('Database connection failed');
    });
  });

  describe('findOne', () => {
    it('should return a single user when found', async () => {
      mockRepositoryBase.findOne.mockResolvedValue(mockUser);

      const result = await userRepository.findOne({ where: { id: 1 } });

      expect(result).toEqual(mockUser);
      expect(mockRepositoryBase.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null when user not found', async () => {
      mockRepositoryBase.findOne.mockResolvedValue(null);

      const result = await userRepository.findOne({ where: { id: 999 } });

      expect(result).toBeNull();
      expect(mockRepositoryBase.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });

    it('should throw error when database query fails', async () => {
      const error = new Error('Invalid query');
      mockRepositoryBase.findOne.mockRejectedValue(error);

      await expect(userRepository.findOne({ where: { id: 1 } })).rejects.toThrow('Invalid query');
    });
  });

  describe('create', () => {
    it('should create a new user entity', async () => {
      const newUserData = {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@example.com',
        password: 'password123',
      };
      const createdUser = { ...newUserData, id: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() };
      mockRepositoryBase.create.mockReturnValue(createdUser);

      const result = userRepository.create(newUserData);

      expect(result).toEqual(createdUser);
      expect(mockRepositoryBase.create).toHaveBeenCalledWith(newUserData);
    });

    it('should create multiple users when array provided', async () => {
      const newUsersData = [
        { firstName: 'Alice', email: 'alice@example.com' },
        { firstName: 'Bob', email: 'bob@example.com' },
      ];
      const createdUsers = newUsersData.map((data, index) => ({ ...data, id: index + 3 }));
      mockRepositoryBase.create.mockReturnValue(createdUsers);

      const result = userRepository.create(newUsersData);

      expect(result).toEqual(createdUsers);
      expect(mockRepositoryBase.create).toHaveBeenCalledWith(newUsersData);
    });

    it('should create empty user when no data provided', async () => {
      mockRepositoryBase.create.mockReturnValue({});

      const result = userRepository.create();

      expect(result).toEqual({});
      expect(mockRepositoryBase.create).toHaveBeenCalledWith();
    });
  });

  describe('save', () => {
    it('should save a user entity', async () => {
      const savedUser = { ...mockUser, firstName: 'Updated' };
      mockRepositoryBase.save.mockResolvedValue(savedUser);

      const result = await userRepository.save(savedUser);

      expect(result).toEqual(savedUser);
      expect(mockRepositoryBase.save).toHaveBeenCalledWith(savedUser);
    });

    it('should save multiple user entities', async () => {
      const usersToSave = [mockUser, mockUsers[1]];
      mockRepositoryBase.save.mockResolvedValue(usersToSave);

      const result = await userRepository.save(usersToSave);

      expect(result).toEqual(usersToSave);
      expect(mockRepositoryBase.save).toHaveBeenCalledWith(usersToSave);
    });

    it('should throw error when save fails', async () => {
      const error = new Error('Save failed');
      mockRepositoryBase.save.mockRejectedValue(error);

      await expect(userRepository.save(mockUser)).rejects.toThrow('Save failed');
    });
  });

  describe('update', () => {
    it('should update a user by criteria', async () => {
      const criteria = { id: 1 };
      const partialEntity = { firstName: 'Updated Name' };
      const updateResult = { affected: 1, raw: {}, generatedMaps: [] };
      mockRepositoryBase.update.mockResolvedValue(updateResult);

      const result = await userRepository.update(criteria, partialEntity);

      expect(result).toEqual(updateResult);
      expect(mockRepositoryBase.update).toHaveBeenCalledWith(criteria, partialEntity);
    });

    it('should return affected 0 when user not found', async () => {
      const criteria = { id: 999 };
      const partialEntity = { firstName: 'Updated' };
      const updateResult = { affected: 0, raw: {}, generatedMaps: [] };
      mockRepositoryBase.update.mockResolvedValue(updateResult);

      const result = await userRepository.update(criteria, partialEntity);

      expect(result).toEqual(updateResult);
      expect(result.affected).toBe(0);
    });

    it('should throw error when update fails', async () => {
      const error = new Error('Update failed');
      mockRepositoryBase.update.mockRejectedValue(error);

      await expect(userRepository.update({ id: 1 }, { firstName: 'Test' })).rejects.toThrow('Update failed');
    });
  });

  describe('delete', () => {
    it('should delete a user by criteria', async () => {
      const criteria = { id: 1 };
      const deleteResult = { affected: 1, raw: {} };
      mockRepositoryBase.delete.mockResolvedValue(deleteResult);

      const result = await userRepository.delete(criteria);

      expect(result).toEqual(deleteResult);
      expect(mockRepositoryBase.delete).toHaveBeenCalledWith(criteria);
    });

    it('should return affected 0 when user not found', async () => {
      const criteria = { id: 999 };
      const deleteResult = { affected: 0, raw: {} };
      mockRepositoryBase.delete.mockResolvedValue(deleteResult);

      const result = await userRepository.delete(criteria);

      expect(result).toEqual(deleteResult);
      expect(result.affected).toBe(0);
    });

    it('should throw error when delete fails', async () => {
      const error = new Error('Delete failed');
      mockRepositoryBase.delete.mockRejectedValue(error);

      await expect(userRepository.delete({ id: 1 })).rejects.toThrow('Delete failed');
    });
  });

  describe('count', () => {
    it('should return count of users', async () => {
      mockRepositoryBase.count.mockResolvedValue(2);

      const result = await userRepository.count();

      expect(result).toBe(2);
      expect(mockRepositoryBase.count).toHaveBeenCalledWith(undefined);
    });

    it('should return count with options', async () => {
      const options = { where: { isActive: true } };
      mockRepositoryBase.count.mockResolvedValue(1);

      const result = await userRepository.count(options);

      expect(result).toBe(1);
      expect(mockRepositoryBase.count).toHaveBeenCalledWith(options);
    });

    it('should return 0 when no users exist', async () => {
      mockRepositoryBase.count.mockResolvedValue(0);

      const result = await userRepository.count();

      expect(result).toBe(0);
    });

    it('should throw error when count fails', async () => {
      const error = new Error('Count failed');
      mockRepositoryBase.count.mockRejectedValue(error);

      await expect(userRepository.count()).rejects.toThrow('Count failed');
    });
  });

  describe('findAndCount', () => {
    it('should return users and count', async () => {
      const result = [mockUsers, 2];
      mockRepositoryBase.findAndCount.mockResolvedValue(result);

      const [users, count] = await userRepository.findAndCount();

      expect(users).toEqual(mockUsers);
      expect(count).toBe(2);
      expect(mockRepositoryBase.findAndCount).toHaveBeenCalledWith(undefined);
    });

    it('should return empty array and 0 count when no users', async () => {
      mockRepositoryBase.findAndCount.mockResolvedValue([[], 0]);

      const [users, count] = await userRepository.findAndCount();

      expect(users).toEqual([]);
      expect(count).toBe(0);
    });

    it('should throw error when findAndCount fails', async () => {
      const error = new Error('FindAndCount failed');
      mockRepositoryBase.findAndCount.mockRejectedValue(error);

      await expect(userRepository.findAndCount()).rejects.toThrow('FindAndCount failed');
    });
  });

  describe('createQueryBuilder', () => {
    it('should return query builder', () => {
      const mockQueryBuilder = { where: jest.fn(), getMany: jest.fn() };
      mockRepositoryBase.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = userRepository.createQueryBuilder('user');

      expect(result).toEqual(mockQueryBuilder);
      expect(mockRepositoryBase.createQueryBuilder).toHaveBeenCalledWith('user');
    });

    it('should return query builder without alias', () => {
      const mockQueryBuilder = { getOne: jest.fn() };
      mockRepositoryBase.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = userRepository.createQueryBuilder();

      expect(result).toEqual(mockQueryBuilder);
      expect(mockRepositoryBase.createQueryBuilder).toHaveBeenCalledWith();
    });
  });

  describe('hasId', () => {
    it('should return true when entity has id', () => {
      mockRepositoryBase.hasId.mockReturnValue(true);

      const result = userRepository.hasId(mockUser);

      expect(result).toBe(true);
      expect(mockRepositoryBase.hasId).toHaveBeenCalledWith(mockUser);
    });

    it('should return false when entity has no id', () => {
      const userWithoutId = { ...mockUser, id: undefined };
      mockRepositoryBase.hasId.mockReturnValue(false);

      const result = userRepository.hasId(userWithoutId);

      expect(result).toBe(false);
      expect(mockRepositoryBase.hasId).toHaveBeenCalledWith(userWithoutId);
    });
  });

  describe('getId', () => {
    it('should return entity id', () => {
      mockRepositoryBase.getId.mockReturnValue(1);

      const result = userRepository.getId(mockUser);

      expect(result).toBe(1);
      expect(mockRepositoryBase.getId).toHaveBeenCalledWith(mockUser);
    });

    it('should return undefined when no id', () => {
      const userWithoutId = { ...mockUser, id: undefined };
      mockRepositoryBase.getId.mockReturnValue(undefined);

      const result = userRepository.getId(userWithoutId);

      expect(result).toBeUndefined();
      expect(mockRepositoryBase.getId).toHaveBeenCalledWith(userWithoutId);
    });
  });

  describe('preload', () => {
    it('should preload entity', async () => {
      const partialEntity = { id: 1, firstName: 'Preloaded' };
      const preloadedEntity = { ...mockUser, ...partialEntity };
      mockRepositoryBase.preload.mockResolvedValue(preloadedEntity);

      const result = await userRepository.preload(partialEntity);

      expect(result).toEqual(preloadedEntity);
      expect(mockRepositoryBase.preload).toHaveBeenCalledWith(partialEntity);
    });

    it('should return null when entity not found', async () => {
      mockRepositoryBase.preload.mockResolvedValue(null);

      const result = await userRepository.preload({ id: 999 });

      expect(result).toBeNull();
    });

    it('should throw error when preload fails', async () => {
      const error = new Error('Preload failed');
      mockRepositoryBase.preload.mockRejectedValue(error);

      await expect(userRepository.preload({ id: 1 })).rejects.toThrow('Preload failed');
    });
  });

  describe('merge', () => {
    it('should merge entities', () => {
      const mergeWith = { firstName: 'Merged' };
      const mergedEntity = { ...mockUser, ...mergeWith };
      mockRepositoryBase.merge.mockReturnValue(mergedEntity);

      const result = userRepository.merge(mockUser, mergeWith);

      expect(result).toEqual(mergedEntity);
      expect(mockRepositoryBase.merge).toHaveBeenCalledWith(mockUser, mergeWith);
    });

    it('should merge multiple entities', () => {
      const mergeWith1 = { firstName: 'First' };
      const mergeWith2 = { lastName: 'Last' };
      const mergedEntity = { ...mockUser, ...mergeWith1, ...mergeWith2 };
      mockRepositoryBase.merge.mockReturnValue(mergedEntity);

      const result = userRepository.merge(mockUser, mergeWith1, mergeWith2);

      expect(result).toEqual(mergedEntity);
      expect(mockRepositoryBase.merge).toHaveBeenCalledWith(mockUser, mergeWith1, mergeWith2);
    });
  });

  describe('remove', () => {
    it('should remove a user entity', async () => {
      mockRepositoryBase.remove.mockResolvedValue(mockUser);

      const result = await userRepository.remove(mockUser);

      expect(result).toEqual(mockUser);
      expect(mockRepositoryBase.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should remove multiple user entities', async () => {
      mockRepositoryBase.remove.mockResolvedValue(mockUsers);

      const result = await userRepository.remove(mockUsers);

      expect(result).toEqual(mockUsers);
      expect(mockRepositoryBase.remove).toHaveBeenCalledWith(mockUsers);
    });

    it('should throw error when remove fails', async () => {
      const error = new Error('Remove failed');
      mockRepositoryBase.remove.mockRejectedValue(error);

      await expect(userRepository.remove(mockUser)).rejects.toThrow('Remove failed');
    });
  });

  describe('softDelete', () => {
    it('should soft delete a user', async () => {
      const criteria = { id: 1 };
      const deleteResult = { affected: 1, raw: {} };
      mockRepositoryBase.softDelete.mockResolvedValue(deleteResult);

      const result = await userRepository.softDelete(criteria);

      expect(result).toEqual(deleteResult);
      expect(mockRepositoryBase.softDelete).toHaveBeenCalledWith(criteria);
    });

    it('should return affected 0 when user not found', async () => {
      const criteria = { id: 999 };
      const deleteResult = { affected: 0, raw: {} };
      mockRepositoryBase.softDelete.mockResolvedValue(deleteResult);

      const result = await userRepository.softDelete(criteria);

      expect(result).toEqual(deleteResult);
      expect(result.affected).toBe(0);
    });

    it('should throw error when softDelete fails', async () => {
      const error = new Error('SoftDelete failed');
      mockRepositoryBase.softDelete.mockRejectedValue(error);

      await expect(userRepository.softDelete({ id: 1 })).rejects.toThrow('SoftDelete failed');
    });
  });

  describe('softRemove', () => {
    it('should soft remove a user entity', async () => {
      mockRepositoryBase.softRemove.mockResolvedValue(mockUser);

      const result = await userRepository.softRemove(mockUser);

      expect(result).toEqual(mockUser);
      expect(mockRepositoryBase.softRemove).toHaveBeenCalledWith(mockUser);
    });

    it('should soft remove multiple user entities', async () => {
      mockRepositoryBase.softRemove.mockResolvedValue(mockUsers);

      const result = await userRepository.softRemove(mockUsers);

      expect(result).toEqual(mockUsers);
      expect(mockRepositoryBase.softRemove).toHaveBeenCalledWith(mockUsers);
    });

    it('should throw error when softRemove fails', async () => {
      const error = new Error('SoftRemove failed');
      mockRepositoryBase.softRemove.mockRejectedValue(error);

      await expect(userRepository.softRemove(mockUser)).rejects.toThrow('SoftRemove failed');
    });
  });

  describe('restore', () => {
    it('should restore a soft-deleted user', async () => {
      const criteria = { id: 1 };
      const restoreResult = { affected: 1, raw: {} };
      mockRepositoryBase.restore.mockResolvedValue(restoreResult);

      const result = await userRepository.restore(criteria);

      expect(result).toEqual(restoreResult);
      expect(mockRepositoryBase.restore).toHaveBeenCalledWith(criteria);
    });

    it('should return affected 0 when user not found', async () => {
      const criteria = { id: 999 };
      const restoreResult = { affected: 0, raw: {} };
      mockRepositoryBase.restore.mockResolvedValue(restoreResult);

      const result = await userRepository.restore(criteria);

      expect(result).toEqual(restoreResult);
      expect(result.affected).toBe(0);
    });

    it('should throw error when restore fails', async () => {
      const error = new Error('Restore failed');
      mockRepositoryBase.restore.mockRejectedValue(error);

      await expect(userRepository.restore({ id: 1 })).rejects.toThrow('Restore failed');
    });
  });

  describe('recover', () => {
    it('should recover a soft-deleted user entity', async () => {
      mockRepositoryBase.recover.mockResolvedValue(mockUser);

      const result = await userRepository.recover(mockUser);

      expect(result).toEqual(mockUser);
      expect(mockRepositoryBase.recover).toHaveBeenCalledWith(mockUser);
    });

    it('should recover multiple user entities', async () => {
      mockRepositoryBase.recover.mockResolvedValue(mockUsers);

      const result = await userRepository.recover(mockUsers);

      expect(result).toEqual(mockUsers);
      expect(mockRepositoryBase.recover).toHaveBeenCalledWith(mockUsers);
    });

    it('should throw error when recover fails', async () => {
      const error = new Error('Recover failed');
      mockRepositoryBase.recover.mockRejectedValue(error);

      await expect(userRepository.recover(mockUser)).rejects.toThrow('Recover failed');
    });
  });

  describe('increment', () => {
    it('should increment a column value', async () => {
      const criteria = { id: 1 };
      const column = 'loginCount';
      const value = 1;
      const incrementResult = { affected: 1, raw: {} };
      mockRepositoryBase.increment.mockResolvedValue(incrementResult);

      const result = await userRepository.increment(criteria, column, value);

      expect(result).toEqual(incrementResult);
      expect(mockRepositoryBase.increment).toHaveBeenCalledWith(criteria, column, value);
    });

    it('should throw error when increment fails', async () => {
      const error = new Error('Increment failed');
      mockRepositoryBase.increment.mockRejectedValue(error);

      await expect(userRepository.increment({ id: 1 }, 'loginCount', 1)).rejects.toThrow('Increment failed');
    });
  });

  describe('decrement', () => {
    it('should decrement a column value', async () => {
      const criteria = { id: 1 };
      const column = 'loginCount';
      const value = 1;
      const decrementResult = { affected: 1, raw: {} };
      mockRepositoryBase.decrement.mockResolvedValue(decrementResult);

      const result = await userRepository.decrement(criteria, column, value);

      expect(result).toEqual(decrementResult);
      expect(mockRepositoryBase.decrement).toHaveBeenCalledWith(criteria, column, value);
    });

    it('should throw error when decrement fails', async () => {
      const error = new Error('Decrement failed');
      mockRepositoryBase.decrement.mockRejectedValue(error);

      await expect(userRepository.decrement({ id: 1 }, 'loginCount', 1)).rejects.toThrow('Decrement failed');
    });
  });

  describe('query', () => {
    it('should execute a raw query', async () => {
      const query = 'SELECT * FROM users';
      const parameters = [];
      const queryResult = [{ id: 1, firstName: 'John' }];
      mockRepositoryBase.query.mockResolvedValue(queryResult);

      const result = await userRepository.query(query, parameters);

      expect(result).toEqual(queryResult);
      expect(mockRepositoryBase.query).toHaveBeenCalledWith(query, parameters);
    });

    it('should execute query without parameters', async () => {
      const query = 'SELECT * FROM users';
      const queryResult = [];
      mockRepositoryBase.query.mockResolvedValue(queryResult);

      const result = await userRepository.query(query);

      expect(result).toEqual(queryResult);
      expect(mockRepositoryBase.query).toHaveBeenCalledWith(query, undefined);
    });

    it('should throw error when query fails', async () => {
      const error = new Error('Query failed');
      mockRepositoryBase.query.mockRejectedValue(error);

      await expect(userRepository.query('SELECT * FROM users')).rejects.toThrow('Query failed');
    });
  });

  describe('clear', () => {
    it('should clear all users', async () => {
      mockRepositoryBase.clear.mockResolvedValue(undefined);

      await userRepository.clear();

      expect(mockRepositoryBase.clear).toHaveBeenCalled();
    });

    it('should throw error when clear fails', async () => {
      const error = new Error('Clear failed');
      mockRepositoryBase.clear.mockRejectedValue(error);

      await expect(userRepository.clear()).rejects.toThrow('Clear failed');
    });
  });

  describe('insert', () => {
    it('should insert a new user', async () => {
      const insertData = { firstName: 'New', email: 'new@example.com' };
      const insertResult = { identifiers: [{ id: 3 }], generatedMaps: [insertData], raw: {} };
      mockRepositoryBase.insert.mockResolvedValue(insertResult);

      const result = await userRepository.insert(insertData);

      expect(result).toEqual(insertResult);
      expect(mockRepositoryBase.insert).toHaveBeenCalledWith(insertData);
    });

    it('should insert multiple users', async () => {
      const insertData = [
        { firstName: 'New1', email: 'new1@example.com' },
        { firstName: 'New2', email: 'new2@example.com' },
      ];
      const insertResult = { identifiers: [{ id: 3 }, { id: 4 }], generatedMaps: insertData, raw: {} };
      mockRepositoryBase.insert.mockResolvedValue(insertResult);

      const result = await userRepository.insert(insertData);

      expect(result).toEqual(insertResult);
      expect(mockRepositoryBase.insert).toHaveBeenCalledWith(insertData);
    });

    it('should throw error when insert fails', async () => {
      const error = new Error('Insert failed');
      mockRepositoryBase.insert.mockRejectedValue(error);

      await expect(userRepository.insert({ firstName: 'Test' })).rejects.toThrow('Insert failed');
    });
  });

  describe('upsert', () => {
    it('should upsert a user', async () => {
      const upsertData = { id: 1, firstName: 'Updated' };
      const conflictPaths = ['id'];
      const upsertResult = { identifiers: [{ id: 1 }], generatedMaps: [upsertData], raw: {} };
      mockRepositoryBase.upsert.mockResolvedValue(upsertResult);

      const result = await userRepository.upsert(upsertData, conflictPaths);

      expect(result).toEqual(upsertResult);
      expect(mockRepositoryBase.upsert).toHaveBeenCalledWith(upsertData, conflictPaths);
    });

    it('should upsert multiple users', async () => {
      const upsertData = [
        { id: 1, firstName: 'Updated1' },
        { id: 2, firstName: 'Updated2' },
      ];
      const conflictPaths = ['id'];
      const upsertResult = { identifiers: [{ id: 1 }, { id: 2 }], generatedMaps: upsertData, raw: {} };
      mockRepositoryBase.upsert.mockResolvedValue(upsertResult);

      const result = await userRepository.upsert(upsertData, conflictPaths);

      expect(result).toEqual(upsertResult);
      expect(mockRepositoryBase.upsert).toHaveBeenCalledWith(upsertData, conflictPaths);
    });

    it('should throw error when upsert fails', async () => {
      const error = new Error('Upsert failed');
      mockRepositoryBase.upsert.mockRejectedValue(error);

      await expect(userRepository.upsert({ id: 1 }, ['id'])).rejects.toThrow('Upsert failed');
    });
  });

  describe('exists', () => {
    it('should return true when user exists', async () => {
      mockRepositoryBase.exists.mockResolvedValue(true);

      const result = await userRepository.exists({ where: { id: 1 } });

      expect(result).toBe(true);
      expect(mockRepositoryBase.exists).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return false when user does not exist', async () => {
      mockRepositoryBase.exists.mockResolvedValue(false);

      const result = await userRepository.exists({ where: { id: 999 } });

      expect(result).toBe(false);
      expect(mockRepositoryBase.exists).toHaveBeenCalledWith({ where: { id: 999 } });
    });

    it('should throw error when exists fails', async () => {
      const error = new Error('Exists failed');
      mockRepositoryBase.exists.mockRejectedValue(error);

      await expect(userRepository.exists({ where: { id: 1 } })).rejects.toThrow('Exists failed');
    });
  });

  describe('existsBy', () => {
    it('should return true when user exists by criteria', async () => {
      mockRepositoryBase.existsBy.mockResolvedValue(true);

      const result = await userRepository.existsBy({ email: 'john@example.com' });

      expect(result).toBe(true);
      expect(mockRepositoryBase.existsBy).toHaveBeenCalledWith({ email: 'john@example.com' });
    });

    it('should return false when user does not exist by criteria', async () => {
      mockRepositoryBase.existsBy.mockResolvedValue(false);

      const result = await userRepository.existsBy({ email: 'nonexistent@example.com' });

      expect(result).toBe(false);
      expect(mockRepositoryBase.existsBy).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
    });

    it('should throw error when existsBy fails', async () => {
      const error = new Error('ExistsBy failed');
      mockRepositoryBase.existsBy.mockRejectedValue(error);

      await expect(userRepository.existsBy({ email: 'test@example.com' })).rejects.toThrow('ExistsBy failed');
    });
  });

  describe('findOneBy', () => {
    it('should find one user by criteria', async () => {
      mockRepositoryBase.findOneBy.mockResolvedValue(mockUser);

      const result = await userRepository.findOneBy({ email: 'john@example.com' });

      expect(result).toEqual(mockUser);
      expect(mockRepositoryBase.findOneBy).toHaveBeenCalledWith({ email: 'john@example.com' });
    });

    it('should return null when user not found', async () => {
      mockRepositoryBase.findOneBy.mockResolvedValue(null);

      const result = await userRepository.findOneBy({ email: 'nonexistent@example.com' });

      expect(result).toBeNull();
      expect(mockRepositoryBase.findOneBy).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
    });

    it('should throw error when findOneBy fails', async () => {
      const error = new Error('FindOneBy failed');
      mockRepositoryBase.findOneBy.mockRejectedValue(error);

      await expect(userRepository.findOneBy({ email: 'test@example.com' })).rejects.toThrow('FindOneBy failed');
    });
  });

  describe('findOneById', () => {
    it('should find one user by id', async () => {
      mockRepositoryBase.findOneById.mockResolvedValue(mockUser);

      const result = await userRepository.findOneById(1);

      expect(result).toEqual(mockUser);
      expect(mockRepositoryBase.findOneById).toHaveBeenCalledWith(1);
    });

    it('should return null when user not found', async () => {
      mockRepositoryBase.findOneById.mockResolvedValue(null);

      const result = await userRepository.findOneById(999);

      expect(result).toBeNull();
      expect(mockRepositoryBase.findOneById).toHaveBeenCalledWith(999);
    });

    it('should throw error when findOneById fails', async () => {
      const error = new Error('FindOneById failed');
      mockRepositoryBase.findOneById.mockRejectedValue(error);

      await expect(userRepository.findOneById(1)).rejects.toThrow('FindOneById failed');
    });
  });

  describe('findBy', () => {
    it('should find users by criteria', async () => {
      mockRepositoryBase.findBy.mockResolvedValue(mockUsers);

      const result = await userRepository.findBy({ isActive: true });

      expect(result).toEqual(mockUsers);
      expect(mockRepositoryBase.findBy).toHaveBeenCalledWith({ isActive: true });
    });

    it('should return empty array when no users match', async () => {
      mockRepositoryBase.findBy.mockResolvedValue([]);

      const result = await userRepository.findBy({ isActive: false });

      expect(result).toEqual([]);
      expect(mockRepositoryBase.findBy).toHaveBeenCalledWith({ isActive: false });
    });

    it('should throw error when findBy fails', async () => {
      const error = new Error('FindBy failed');
      mockRepositoryBase.findBy.mockRejectedValue(error);

      await expect(userRepository.findBy({ isActive: true })).rejects.toThrow('FindBy failed');
    });
  });

  describe('findAndCountBy', () => {
    it('should find users and count by criteria', async () => {
      const result = [mockUsers, 2];
      mockRepositoryBase.findAndCountBy.mockResolvedValue(result);

      const [users, count] = await userRepository.findAndCountBy({ isActive: true });

      expect(users).toEqual(mockUsers);
      expect(count).toBe(2);
      expect(mockRepositoryBase.findAndCountBy).toHaveBeenCalledWith({ isActive: true });
    });

    it('should return empty array and 0 count when no users match', async () => {
      mockRepositoryBase.findAndCountBy.mockResolvedValue([[], 0]);

      const [users, count] = await userRepository.findAndCountBy({ isActive: false });

      expect(users).toEqual([]);
      expect(count).toBe(0);
    });

    it('should throw error when findAndCountBy fails', async () => {
      const error = new Error('FindAndCountBy failed');
      mockRepositoryBase.findAndCountBy.mockRejectedValue(error);

      await expect(userRepository.findAndCountBy({ isActive: true })).rejects.toThrow('FindAndCountBy failed');
    });
  });

  describe('countBy', () => {
    it('should count users by criteria', async () => {
      mockRepositoryBase.countBy.mockResolvedValue(2);

      const result = await userRepository.countBy({ isActive: true });

      expect(result).toBe(2);
      expect(mockRepositoryBase.countBy).toHaveBeenCalledWith({ isActive: true });
    });

    it('should return 0 when no users match', async () => {
      mockRepositoryBase.countBy.mockResolvedValue(0);

      const result = await userRepository.countBy({ isActive: false });

      expect(result).toBe(0);
      expect(mockRepositoryBase.countBy).toHaveBeenCalledWith({ isActive: false });
    });

    it('should throw error when countBy fails', async () => {
      const error = new Error('CountBy failed');
      mockRepositoryBase.countBy.mockRejectedValue(error);

      await expect(userRepository.countBy({ isActive: true })).rejects.toThrow('CountBy failed');
    });
  });

  describe('sum', () => {
    it('should sum a column', async () => {
      mockRepositoryBase.sum.mockResolvedValue(100);

      const result = await userRepository.sum('loginCount', { isActive: true });

      expect(result).toBe(100);
      expect(mockRepositoryBase.sum).toHaveBeenCalledWith('loginCount', { isActive: true });
    });

    it('should return null when no rows', async () => {
      mockRepositoryBase.sum.mock