import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from '../entities/user.entity';
import { RepositoryBase } from '../../App/abstracts/repository.base';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockRepositoryBase: jest.Mocked<Partial<RepositoryBase<User>>>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsers: User[] = [
    mockUser,
    {
      ...mockUser,
      id: 2,
      email: 'test2@example.com',
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
      manager: {
        transaction: jest.fn(),
      } as any,
      target: User,
      metadata: {
        name: 'User',
        columns: [],
        relations: [],
      } as any,
      query: jest.fn(),
      clear: jest.fn(),
      insert: jest.fn(),
      remove: jest.fn(),
      softDelete: jest.fn(),
      restore: jest.fn(),
      softRemove: jest.fn(),
      recover: jest.fn(),
      preload: jest.fn(),
      increment: jest.fn(),
      decrement: jest.fn(),
      exists: jest.fn(),
      existsBy: jest.fn(),
      findOneBy: jest.fn(),
      findOneById: jest.fn(),
      findBy: jest.fn(),
      findByIds: jest.fn(),
      findAndCountBy: jest.fn(),
      countBy: jest.fn(),
      sum: jest.fn(),
      average: jest.fn(),
      minimum: jest.fn(),
      maximum: jest.fn(),
      getId: jest.fn(),
      createEntityId: jest.fn(),
      hasId: jest.fn(),
      merge: jest.fn(),
      getMany: jest.fn(),
      getManyAndCount: jest.fn(),
      getOne: jest.fn(),
      getRawMany: jest.fn(),
      getRawOne: jest.fn(),
      getCount: jest.fn(),
      getExists: jest.fn(),
      getExistsBy: jest.fn(),
      getOneOrFail: jest.fn(),
      getManyOrFail: jest.fn(),
      getRawManyOrFail: jest.fn(),
      getRawOneOrFail: jest.fn(),
      getCountOrFail: jest.fn(),
      getExistsOrFail: jest.fn(),
      getExistsByOrFail: jest.fn(),
      getOneById: jest.fn(),
      getManyByIds: jest.fn(),
      getManyByIdsOrFail: jest.fn(),
      getOneByIdOrFail: jest.fn(),
      getManyBy: jest.fn(),
      getManyByOrFail: jest.fn(),
      getOneBy: jest.fn(),
      getOneByOrFail: jest.fn(),
      getManyAndCountBy: jest.fn(),
      getManyAndCountByOrFail: jest.fn(),
      getCountBy: jest.fn(),
      getCountByOrFail: jest.fn(),
      getSum: jest.fn(),
      getAverage: jest.fn(),
      getMinimum: jest.fn(),
      getMaximum: jest.fn(),
      getSumBy: jest.fn(),
      getAverageBy: jest.fn(),
      getMinimumBy: jest.fn(),
      getMaximumBy: jest.fn(),
      getIncrement: jest.fn(),
      getDecrement: jest.fn(),
      getSoftDelete: jest.fn(),
      getRestore: jest.fn(),
      getSoftRemove: jest.fn(),
      getRecover: jest.fn(),
      getPreload: jest.fn(),
      getInsert: jest.fn(),
      getUpdate: jest.fn(),
      getDelete: jest.fn(),
      getRemove: jest.fn(),
      getClear: jest.fn(),
      getQuery: jest.fn(),
      getManager: jest.fn(),
      getTarget: jest.fn(),
      getMetadata: jest.fn(),
      getRepository: jest.fn(),
      getTreeRepository: jest.fn(),
      getMongoRepository: jest.fn(),
      getCustomRepository: jest.fn(),
      getEntityManager: jest.fn(),
      getConnection: jest.fn(),
      getDataSource: jest.fn(),
      getTree: jest.fn(),
      getTrees: jest.fn(),
      getDescendants: jest.fn(),
      getDescendantsTree: jest.fn(),
      getAncestors: jest.fn(),
      getAncestorsTree: jest.fn(),
      getChildren: jest.fn(),
      getChildrenTree: jest.fn(),
      getParent: jest.fn(),
      getParentTree: jest.fn(),
      getRoots: jest.fn(),
      getRootsTree: jest.fn(),
      getAdjacencyList: jest.fn(),
      getNestedSet: jest.fn(),
      getMaterializedPath: jest.fn(),
      getClosureTable: jest.fn(),
      getTreeRepositoryBy: jest.fn(),
      getTreeRepositoryById: jest.fn(),
      getTreeRepositoryByPath: jest.fn(),
      getTreeRepositoryByParent: jest.fn(),
      getTreeRepositoryByChildren: jest.fn(),
      getTreeRepositoryByRoot: jest.fn(),
      getTreeRepositoryByRoots: jest.fn(),
      getTreeRepositoryByDescendants: jest.fn(),
      getTreeRepositoryByAncestors: jest.fn(),
      getTreeRepositoryByParentTree: jest.fn(),
      getTreeRepositoryByChildrenTree: jest.fn(),
      getTreeRepositoryByRootTree: jest.fn(),
      getTreeRepositoryByRootsTree: jest.fn(),
      getTreeRepositoryByDescendantsTree: jest.fn(),
      getTreeRepositoryByAncestorsTree: jest.fn(),
      getTreeRepositoryByParentTreeBy: jest.fn(),
      getTreeRepositoryByChildrenTreeBy: jest.fn(),
      getTreeRepositoryByRootTreeBy: jest.fn(),
      getTreeRepositoryByRootsTreeBy: jest.fn(),
      getTreeRepositoryByDescendantsTreeBy: jest.fn(),
      getTreeRepositoryByAncestorsTreeBy: jest.fn(),
      getTreeRepositoryByParentTreeById: jest.fn(),
      getTreeRepositoryByChildrenTreeById: jest.fn(),
      getTreeRepositoryByRootTreeById: jest.fn(),
      getTreeRepositoryByRootsTreeById: jest.fn(),
      getTreeRepositoryByDescendantsTreeById: jest.fn(),
      getTreeRepositoryByAncestorsTreeById: jest.fn(),
      getTreeRepositoryByParentTreeByPath: jest.fn(),
      getTreeRepositoryByChildrenTreeByPath: jest.fn(),
      getTreeRepositoryByRootTreeByPath: jest.fn(),
      getTreeRepositoryByRootsTreeByPath: jest.fn(),
      getTreeRepositoryByDescendantsTreeByPath: jest.fn(),
      getTreeRepositoryByAncestorsTreeByPath: jest.fn(),
      getTreeRepositoryByParentTreeByParent: jest.fn(),
      getTreeRepositoryByChildrenTreeByParent: jest.fn(),
      getTreeRepositoryByRootTreeByParent: jest.fn(),
      getTreeRepositoryByRootsTreeByParent: jest.fn(),
      getTreeRepositoryByDescendantsTreeByParent: jest.fn(),
      getTreeRepositoryByAncestorsTreeByParent: jest.fn(),
      getTreeRepositoryByParentTreeByChildren: jest.fn(),
      getTreeRepositoryByChildrenTreeByChildren: jest.fn(),
      getTreeRepositoryByRootTreeByChildren: jest.fn(),
      getTreeRepositoryByRootsTreeByChildren: jest.fn(),
      getTreeRepositoryByDescendantsTreeByChildren: jest.fn(),
      getTreeRepositoryByAncestorsTreeByChildren: jest.fn(),
      getTreeRepositoryByParentTreeByRoot: jest.fn(),
      getTreeRepositoryByChildrenTreeByRoot: jest.fn(),
      getTreeRepositoryByRootTreeByRoot: jest.fn(),
      getTreeRepositoryByRootsTreeByRoot: jest.fn(),
      getTreeRepositoryByDescendantsTreeByRoot: jest.fn(),
      getTreeRepositoryByAncestorsTreeByRoot: jest.fn(),
      getTreeRepositoryByParentTreeByRoots: jest.fn(),
      getTreeRepositoryByChildrenTreeByRoots: jest.fn(),
      getTreeRepositoryByRootTreeByRoots: jest.fn(),
      getTreeRepositoryByRootsTreeByRoots: jest.fn(),
      getTreeRepositoryByDescendantsTreeByRoots: jest.fn(),
      getTreeRepositoryByAncestorsTreeByRoots: jest.fn(),
      getTreeRepositoryByParentTreeByDescendants: jest.fn(),
      getTreeRepositoryByChildrenTreeByDescendants: jest.fn(),
      getTreeRepositoryByRootTreeByDescendants: jest.fn(),
      getTreeRepositoryByRootsTreeByDescendants: jest.fn(),
      getTreeRepositoryByDescendantsTreeByDescendants: jest.fn(),
      getTreeRepositoryByAncestorsTreeByDescendants: jest.fn(),
      getTreeRepositoryByParentTreeByAncestors: jest.fn(),
      getTreeRepositoryByChildrenTreeByAncestors: jest.fn(),
      getTreeRepositoryByRootTreeByAncestors: jest.fn(),
      getTreeRepositoryByRootsTreeByAncestors: jest.fn(),
      getTreeRepositoryByDescendantsTreeByAncestors: jest.fn(),
      getTreeRepositoryByAncestorsTreeByAncestors: jest.fn(),
      getTreeRepositoryByParentTreeByParentTree: jest.fn(),
      getTreeRepositoryByChildrenTreeByParentTree: jest.fn(),
      getTreeRepositoryByRootTreeByParentTree: jest.fn(),
      getTreeRepositoryByRootsTreeByParentTree: jest.fn(),
      getTreeRepositoryByDescendantsTreeByParentTree: jest.fn(),
      getTreeRepositoryByAncestorsTreeByParentTree: jest.fn(),
      getTreeRepositoryByParentTreeByChildrenTree: jest.fn(),
      getTreeRepositoryByChildrenTreeByChildrenTree: jest.fn(),
      getTreeRepositoryByRootTreeByChildrenTree: jest.fn(),
      getTreeRepositoryByRootsTreeByChildrenTree: jest.fn(),
      getTreeRepositoryByDescendantsTreeByChildrenTree: jest.fn(),
      getTreeRepositoryByAncestorsTreeByChildrenTree: jest.fn(),
      getTreeRepositoryByParentTreeByRootTree: jest.fn(),
      getTreeRepositoryByChildrenTreeByRootTree: jest.fn(),
      getTreeRepositoryByRootTreeByRootTree: jest.fn(),
      getTreeRepositoryByRootsTreeByRootTree: jest.fn(),
      getTreeRepositoryByDescendantsTreeByRootTree: jest.fn(),
      getTreeRepositoryByAncestorsTreeByRootTree: jest.fn(),
      getTreeRepositoryByParentTreeByRootsTree: jest.fn(),
      getTreeRepositoryByChildrenTreeByRootsTree: jest.fn(),
      getTreeRepositoryByRootTreeByRootsTree: jest.fn(),
      getTreeRepositoryByRootsTreeByRootsTree: jest.fn(),
      getTreeRepositoryByDescendantsTreeByRootsTree: jest.fn(),
      getTreeRepositoryByAncestorsTreeByRootsTree: jest.fn(),
      getTreeRepositoryByParentTreeByDescendantsTree: jest.fn(),
      getTreeRepositoryByChildrenTreeByDescendantsTree: jest.fn(),
      getTreeRepositoryByRootTreeByDescendantsTree: jest.fn(),
      getTreeRepositoryByRootsTreeByDescendantsTree: jest.fn(),
      getTreeRepositoryByDescendantsTreeByDescendantsTree: jest.fn(),
      getTreeRepositoryByAncestorsTreeByDescendantsTree: jest.fn(),
      getTreeRepositoryByParentTreeByAncestorsTree: jest.fn(),
      getTreeRepositoryByChildrenTreeByAncestorsTree: jest.fn(),
      getTreeRepositoryByRootTreeByAncestorsTree: jest.fn(),
      getTreeRepositoryByRootsTreeByAncestorsTree: jest.fn(),
      getTreeRepositoryByDescendantsTreeByAncestorsTree: jest.fn(),
      getTreeRepositoryByAncestorsTreeByAncestorsTree: jest.fn(),
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('inheritance', () => {
    it('should be defined', () => {
      expect(userRepository).toBeDefined();
    });

    it('should extend RepositoryBase', () => {
      expect(userRepository).toBeInstanceOf(RepositoryBase);
    });
  });

  describe('find', () => {
    it('should return all users when no options provided', async () => {
      (mockRepositoryBase.find as jest.Mock).mockResolvedValue(mockUsers);

      const result = await userRepository.find();

      expect(result).toEqual(mockUsers);
      expect(mockRepositoryBase.find).toHaveBeenCalledWith();
    });

    it('should return users with options', async () => {
      const options = { where: { isActive: true } };
      (mockRepositoryBase.find as jest.Mock).mockResolvedValue([mockUser]);

      const result = await userRepository.find(options);

      expect(result).toEqual([mockUser]);
      expect(mockRepositoryBase.find).toHaveBeenCalledWith(options);
    });

    it('should return empty array when no users found', async () => {
      (mockRepositoryBase.find as jest.Mock).mockResolvedValue([]);

      const result = await userRepository.find();

      expect(result).toEqual([]);
    });

    it('should throw error when database fails', async () => {
      const error = new Error('Database error');
      (mockRepositoryBase.find as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.find()).rejects.toThrow('Database error');
    });
  });

  describe('findOne', () => {
    it('should return a single user by id', async () => {
      (mockRepositoryBase.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.findOne({ where: { id: 1 } });

      expect(result).toEqual(mockUser);
      expect(mockRepositoryBase.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null when user not found', async () => {
      (mockRepositoryBase.findOne as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.findOne({ where: { id: 999 } });

      expect(result).toBeNull();
    });

    it('should throw error when database fails', async () => {
      const error = new Error('Database error');
      (mockRepositoryBase.findOne as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.findOne({ where: { id: 1 } })).rejects.toThrow('Database error');
    });
  });

  describe('create', () => {
    it('should create a new user entity', () => {
      const newUser = { ...mockUser, id: undefined };
      (mockRepositoryBase.create as jest.Mock).mockReturnValue(newUser);

      const result = userRepository.create(newUser);

      expect(result).toEqual(newUser);
      expect(mockRepositoryBase.create).toHaveBeenCalledWith(newUser);
    });

    it('should create multiple users when array provided', () => {
      const newUsers = [mockUser, { ...mockUser, id: 2 }];
      (mockRepositoryBase.create as jest.Mock).mockReturnValue(newUsers);

      const result = userRepository.create(newUsers);

      expect(result).toEqual(newUsers);
      expect(mockRepositoryBase.create).toHaveBeenCalledWith(newUsers);
    });

    it('should create empty user when no data provided', () => {
      const emptyUser = {} as User;
      (mockRepositoryBase.create as jest.Mock).mockReturnValue(emptyUser);

      const result = userRepository.create();

      expect(result).toEqual(emptyUser);
      expect(mockRepositoryBase.create).toHaveBeenCalledWith();
    });
  });

  describe('save', () => {
    it('should save a user entity', async () => {
      (mockRepositoryBase.save as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.save(mockUser);

      expect(result).toEqual(mockUser);
      expect(mockRepositoryBase.save).toHaveBeenCalledWith(mockUser);
    });

    it('should save multiple users', async () => {
      (mockRepositoryBase.save as jest.Mock).mockResolvedValue(mockUsers);

      const result = await userRepository.save(mockUsers);

      expect(result).toEqual(mockUsers);
      expect(mockRepositoryBase.save).toHaveBeenCalledWith(mockUsers);
    });

    it('should throw error when save fails', async () => {
      const error = new Error('Save failed');
      (mockRepositoryBase.save as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.save(mockUser)).rejects.toThrow('Save failed');
    });
  });

  describe('update', () => {
    it('should update a user by criteria', async () => {
      const updateResult = { affected: 1, raw: {}, generatedMaps: [] };
      (mockRepositoryBase.update as jest.Mock).mockResolvedValue(updateResult);

      const result = await userRepository.update({ id: 1 }, { firstName: 'Jane' });

      expect(result).toEqual(updateResult);
      expect(mockRepositoryBase.update).toHaveBeenCalledWith({ id: 1 }, { firstName: 'Jane' });
    });

    it('should return affected 0 when user not found', async () => {
      const updateResult = { affected: 0, raw: {}, generatedMaps: [] };
      (mockRepositoryBase.update as jest.Mock).mockResolvedValue(updateResult);

      const result = await userRepository.update({ id: 999 }, { firstName: 'Jane' });

      expect(result.affected).toBe(0);
    });

    it('should throw error when update fails', async () => {
      const error = new Error('Update failed');
      (mockRepositoryBase.update as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.update({ id: 1 }, { firstName: 'Jane' })).rejects.toThrow('Update failed');
    });
  });

  describe('delete', () => {
    it('should delete a user by criteria', async () => {
      const deleteResult = { affected: 1, raw: {} };
      (mockRepositoryBase.delete as jest.Mock).mockResolvedValue(deleteResult);

      const result = await userRepository.delete({ id: 1 });

      expect(result).toEqual(deleteResult);
      expect(mockRepositoryBase.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return affected 0 when user not found', async () => {
      const deleteResult = { affected: 0, raw: {} };
      (mockRepositoryBase.delete as jest.Mock).mockResolvedValue(deleteResult);

      const result = await userRepository.delete({ id: 999 });

      expect(result.affected).toBe(0);
    });

    it('should throw error when delete fails', async () => {
      const error = new Error('Delete failed');
      (mockRepositoryBase.delete as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.delete({ id: 1 })).rejects.toThrow('Delete failed');
    });
  });

  describe('count', () => {
    it('should return count of users', async () => {
      (mockRepositoryBase.count as jest.Mock).mockResolvedValue(2);

      const result = await userRepository.count();

      expect(result).toBe(2);
      expect(mockRepositoryBase.count).toHaveBeenCalledWith();
    });

    it('should return count with options', async () => {
      const options = { where: { isActive: true } };
      (mockRepositoryBase.count as jest.Mock).mockResolvedValue(1);

      const result = await userRepository.count(options);

      expect(result).toBe(1);
      expect(mockRepositoryBase.count).toHaveBeenCalledWith(options);
    });

    it('should return 0 when no users found', async () => {
      (mockRepositoryBase.count as jest.Mock).mockResolvedValue(0);

      const result = await userRepository.count();

      expect(result).toBe(0);
    });

    it('should throw error when count fails', async () => {
      const error = new Error('Count failed');
      (mockRepositoryBase.count as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.count()).rejects.toThrow('Count failed');
    });
  });

  describe('findAndCount', () => {
    it('should return users and count', async () => {
      const result = [mockUsers, 2];
      (mockRepositoryBase.findAndCount as jest.Mock).mockResolvedValue(result);

      const [users, count] = await userRepository.findAndCount();

      expect(users).toEqual(mockUsers);
      expect(count).toBe(2);
      expect(mockRepositoryBase.findAndCount).toHaveBeenCalledWith();
    });

    it('should return empty array and 0 count when no users', async () => {
      const result = [[], 0];
      (mockRepositoryBase.findAndCount as jest.Mock).mockResolvedValue(result);

      const [users, count] = await userRepository.findAndCount();

      expect(users).toEqual([]);
      expect(count).toBe(0);
    });

    it('should throw error when findAndCount fails', async () => {
      const error = new Error('FindAndCount failed');
      (mockRepositoryBase.findAndCount as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.findAndCount()).rejects.toThrow('FindAndCount failed');
    });
  });

  describe('createQueryBuilder', () => {
    it('should create query builder', () => {
      const mockQueryBuilder = { where: jest.fn().mockReturnThis(), getMany: jest.fn() };
      (mockRepositoryBase.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = userRepository.createQueryBuilder('user');

      expect(result).toBe(mockQueryBuilder);
      expect(mockRepositoryBase.createQueryBuilder).toHaveBeenCalledWith('user');
    });

    it('should create query builder without alias', () => {
      const mockQueryBuilder = {};
      (mockRepositoryBase.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = userRepository.createQueryBuilder();

      expect(result).toBe(mockQueryBuilder);
      expect(mockRepositoryBase.createQueryBuilder).toHaveBeenCalledWith();
    });
  });

  describe('manager', () => {
    it('should return the manager', () => {
      const mockManager = { transaction: jest.fn() };
      (mockRepositoryBase.manager as any) = mockManager;

      expect(userRepository.manager).toBe(mockManager);
    });
  });

  describe('target', () => {
    it('should return the target entity', () => {
      expect(userRepository.target).toBe(User);
    });
  });

  describe('metadata', () => {
    it('should return the metadata', () => {
      const mockMetadata = { name: 'User', columns: [], relations: [] };
      (mockRepositoryBase.metadata as any) = mockMetadata;

      expect(userRepository.metadata).toBe(mockMetadata);
    });
  });

  describe('query', () => {
    it('should execute raw query', async () => {
      const rawResult = [{ id: 1, email: 'test@example.com' }];
      (mockRepositoryBase.query as jest.Mock).mockResolvedValue(rawResult);

      const result = await userRepository.query('SELECT * FROM users');

      expect(result).toEqual(rawResult);
      expect(mockRepositoryBase.query).toHaveBeenCalledWith('SELECT * FROM users');
    });

    it('should throw error when query fails', async () => {
      const error = new Error('Query failed');
      (mockRepositoryBase.query as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.query('SELECT * FROM users')).rejects.toThrow('Query failed');
    });
  });

  describe('clear', () => {
    it('should clear all users', async () => {
      (mockRepositoryBase.clear as jest.Mock).mockResolvedValue(undefined);

      await userRepository.clear();

      expect(mockRepositoryBase.clear).toHaveBeenCalled();
    });

    it('should throw error when clear fails', async () => {
      const error = new Error('Clear failed');
      (mockRepositoryBase.clear as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.clear()).rejects.toThrow('Clear failed');
    });
  });

  describe('insert', () => {
    it('should insert a user', async () => {
      const insertResult = { identifiers: [{ id: 1 }], generatedMaps: [mockUser], raw: {} };
      (mockRepositoryBase.insert as jest.Mock).mockResolvedValue(insertResult);

      const result = await userRepository.insert(mockUser);

      expect(result).toEqual(insertResult);
      expect(mockRepositoryBase.insert).toHaveBeenCalledWith(mockUser);
    });

    it('should throw error when insert fails', async () => {
      const error = new Error('Insert failed');
      (mockRepositoryBase.insert as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.insert(mockUser)).rejects.toThrow('Insert failed');
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      (mockRepositoryBase.remove as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.remove(mockUser);

      expect(result).toEqual(mockUser);
      expect(mockRepositoryBase.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should remove multiple users', async () => {
      (mockRepositoryBase.remove as jest.Mock).mockResolvedValue(mockUsers);

      const result = await userRepository.remove(mockUsers);

      expect(result).toEqual(mockUsers);
      expect(mockRepositoryBase.remove).toHaveBeenCalledWith(mockUsers);
    });

    it('should throw error when remove fails', async () => {
      const error = new Error('Remove failed');
      (mockRepositoryBase.remove as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.remove(mockUser)).rejects.toThrow('Remove failed');
    });
  });

  describe('softDelete', () => {
    it('should soft delete a user', async () => {
      const softDeleteResult = { affected: 1, raw: {} };
      (mockRepositoryBase.softDelete as jest.Mock).mockResolvedValue(softDeleteResult);

      const result = await userRepository.softDelete({ id: 1 });

      expect(result).toEqual(softDeleteResult);
      expect(mockRepositoryBase.softDelete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw error when soft delete fails', async () => {
      const error = new Error('SoftDelete failed');
      (mockRepositoryBase.softDelete as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.softDelete({ id: 1 })).rejects.toThrow('SoftDelete failed');
    });
  });

  describe('restore', () => {
    it('should restore a soft deleted user', async () => {
      const restoreResult = { affected: 1, raw: {} };
      (mockRepositoryBase.restore as jest.Mock).mockResolvedValue(restoreResult);

      const result = await userRepository.restore({ id: 1 });

      expect(result).toEqual(restoreResult);
      expect(mockRepositoryBase.restore).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw error when restore fails', async () => {
      const error = new Error('Restore failed');
      (mockRepositoryBase.restore as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.restore({ id: 1 })).rejects.toThrow('Restore failed');
    });
  });

  describe('softRemove', () => {
    it('should soft remove a user entity', async () => {
      (mockRepositoryBase.softRemove as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.softRemove(mockUser);

      expect(result).toEqual(mockUser);
      expect(mockRepositoryBase.softRemove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw error when soft remove fails', async () => {
      const error = new Error('SoftRemove failed');
      (mockRepositoryBase.softRemove as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.softRemove(mockUser)).rejects.toThrow('SoftRemove failed');
    });
  });

  describe('recover', () => {
    it('should recover a soft removed user', async () => {
      (mockRepositoryBase.recover as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.recover(mockUser);

      expect(result).toEqual(mockUser);
      expect(mockRepositoryBase.recover).toHaveBeenCalledWith(mockUser);
    });

    it('should throw error when recover fails', async () => {
      const error = new Error('Recover failed');
      (mockRepositoryBase.recover as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.recover(mockUser)).rejects.toThrow('Recover failed');
    });
  });

  describe('preload', () => {
    it('should preload a user entity', async () => {
      (mockRepositoryBase.preload as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.preload({ id: 1, firstName: 'Jane' });

      expect(result).toEqual(mockUser);
      expect(mockRepositoryBase.preload).toHaveBeenCalledWith({ id: 1, firstName: 'Jane' });
    });

    it('should return null when user not found', async () => {
      (mockRepositoryBase.preload as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.preload({ id: 999 });

      expect(result).toBeNull();
    });

    it('should throw error when preload fails', async () => {
      const error = new Error('Preload failed');
      (mockRepositoryBase.preload as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.preload({ id: 1 })).rejects.toThrow('Preload failed');
    });
  });

  describe('increment', () => {
    it('should increment a column', async () => {
      const incrementResult = { affected: 1, raw: {} };
      (mockRepositoryBase.increment as jest.Mock).mockResolvedValue(incrementResult);

      const result = await userRepository.increment({ id: 1 }, 'loginCount', 1);

      expect(result).toEqual(incrementResult);
      expect(mockRepositoryBase.increment).toHaveBeenCalledWith({ id: 1 }, 'loginCount', 1);
    });

    it('should throw error when increment fails', async () => {
      const error = new Error('Increment failed');
      (mockRepositoryBase.increment as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.increment({ id: 1 }, 'loginCount', 1)).rejects.toThrow('Increment failed');
    });
  });

  describe('decrement', () => {
    it('should decrement a column', async () => {
      const decrementResult = { affected: 1, raw: {} };
      (mockRepositoryBase.decrement as jest.Mock).mockResolvedValue(decrementResult);

      const result = await userRepository.decrement({ id: 1 }, 'loginCount', 1);

      expect(result).toEqual(decrementResult);
      expect(mockRepositoryBase.decrement).toHaveBeenCalledWith({ id: 1 }, 'loginCount', 1);
    });

    it('should throw error when decrement fails', async () => {
      const error = new Error('Decrement failed');
      (mockRepositoryBase.decrement as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.decrement({ id: 1 }, 'loginCount', 1)).rejects.toThrow('Decrement failed');
    });
  });

  describe('exists', () => {
    it('should return true when user exists', async () => {
      (mockRepositoryBase.exists as jest.Mock).mockResolvedValue(true);

      const result = await userRepository.exists({ where: { id: 1 } });

      expect(result).toBe(true);
      expect(mockRepositoryBase.exists).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return false when user does not exist', async () => {
      (mockRepositoryBase.exists as jest.Mock).mockResolvedValue(false);

      const result = await userRepository.exists({ where: { id: 999 } });

      expect(result).toBe(false);
    });

    it('should throw error when exists fails', async () => {
      const error = new Error('Exists failed');
      (mockRepositoryBase.exists as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.exists({ where: { id: 1 } })).rejects.toThrow('Exists failed');
    });
  });

  describe('existsBy', () => {
    it('should return true when user exists by criteria', async () => {
      (mockRepositoryBase.existsBy as jest.Mock).mockResolvedValue(true);

      const result = await userRepository.existsBy({ email: 'test@example.com' });

      expect(result).toBe(true);
      expect(mockRepositoryBase.existsBy).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should return false when user does not exist', async () => {
      (mockRepositoryBase.existsBy as jest.Mock).mockResolvedValue(false);

      const result = await userRepository.existsBy({ email: 'nonexistent@example.com' });

      expect(result).toBe(false);
    });

    it('should throw error when existsBy fails', async () => {
      const error = new Error('ExistsBy failed');
      (mockRepositoryBase.existsBy as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.existsBy({ email: 'test@example.com' })).rejects.toThrow('ExistsBy failed');
    });
  });

  describe('findOneBy', () => {
    it('should find one user by criteria', async () => {
      (mockRepositoryBase.findOneBy as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.findOneBy({ email: 'test@example.com' });

      expect(result).toEqual(mockUser);
      expect(mockRepositoryBase.findOneBy).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should return null when user not found', async () => {
      (mockRepositoryBase.findOneBy as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.findOneBy({ email: 'nonexistent@example.com' });

      expect(result).toBeNull();
    });

    it('should throw error when findOneBy fails', async () => {
      const error = new Error('FindOneBy failed');
      (mockRepositoryBase.findOneBy as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.findOneBy({ email: 'test@example.com' })).rejects.toThrow('FindOneBy failed');
    });
  });

  describe('findOneById', () => {
    it('should find one user by id', async () => {
      (mockRepositoryBase.findOneById as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.findOneById(1);