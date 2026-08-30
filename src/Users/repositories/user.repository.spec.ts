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
      manager: {
        transaction: jest.fn(),
      },
      repository: {
        metadata: {
          target: User,
          name: 'User',
        },
      },
    } as unknown as jest.Mocked<RepositoryBase<User>>;

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

  describe('constructor', () => {
    it('should be defined', () => {
      expect(userRepository).toBeDefined();
    });

    it('should extend RepositoryBase', () => {
      expect(userRepository).toBeInstanceOf(RepositoryBase);
    });
  });

  describe('find', () => {
    it('should return all users when no options provided', async () => {
      mockRepositoryBase.find.mockResolvedValue(mockUsers);

      const result = await userRepository.find();

      expect(result).toEqual(mockUsers);
      expect(mockRepositoryBase.find).toHaveBeenCalledTimes(1);
      expect(mockRepositoryBase.find).toHaveBeenCalledWith();
    });

    it('should return users with options', async () => {
      const options = { where: { firstName: 'John' } };
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
    });

    it('should handle errors when find fails', async () => {
      const error = new Error('Database error');
      mockRepositoryBase.find.mockRejectedValue(error);

      await expect(userRepository.find()).rejects.toThrow('Database error');
    });
  });

  describe('findOne', () => {
    it('should return a single user by id', async () => {
      mockRepositoryBase.findOne.mockResolvedValue(mockUser);

      const result = await userRepository.findOne({ where: { id: 1 } });

      expect(result).toEqual(mockUser);
      expect(mockRepositoryBase.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null when user not found', async () => {
      mockRepositoryBase.findOne.mockResolvedValue(null);

      const result = await userRepository.findOne({ where: { id: 999 } });

      expect(result).toBeNull();
    });

    it('should handle errors when findOne fails', async () => {
      const error = new Error('Database error');
      mockRepositoryBase.findOne.mockRejectedValue(error);

      await expect(userRepository.findOne({ where: { id: 1 } })).rejects.toThrow('Database error');
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
      const createdUser = { ...newUserData, id: 3, createdAt: new Date(), updatedAt: new Date() };
      mockRepositoryBase.create.mockReturnValue(createdUser as User);

      const result = userRepository.create(newUserData);

      expect(result).toEqual(createdUser);
      expect(mockRepositoryBase.create).toHaveBeenCalledWith(newUserData);
    });

    it('should create user with partial data', async () => {
      const partialData = { email: 'partial@example.com' };
      const createdUser = { ...partialData, id: 4, createdAt: new Date(), updatedAt: new Date() };
      mockRepositoryBase.create.mockReturnValue(createdUser as User);

      const result = userRepository.create(partialData);

      expect(result).toEqual(createdUser);
      expect(mockRepositoryBase.create).toHaveBeenCalledWith(partialData);
    });
  });

  describe('save', () => {
    it('should save a user entity', async () => {
      mockRepositoryBase.save.mockResolvedValue(mockUser);

      const result = await userRepository.save(mockUser);

      expect(result).toEqual(mockUser);
      expect(mockRepositoryBase.save).toHaveBeenCalledWith(mockUser);
    });

    it('should save multiple user entities', async () => {
      mockRepositoryBase.save.mockResolvedValue(mockUsers);

      const result = await userRepository.save(mockUsers);

      expect(result).toEqual(mockUsers);
      expect(mockRepositoryBase.save).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle errors when save fails', async () => {
      const error = new Error('Save failed');
      mockRepositoryBase.save.mockRejectedValue(error);

      await expect(userRepository.save(mockUser)).rejects.toThrow('Save failed');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateResult = { affected: 1, raw: {}, generatedMaps: [] };
      mockRepositoryBase.update.mockResolvedValue(updateResult);

      const result = await userRepository.update(1, { firstName: 'Updated' });

      expect(result).toEqual(updateResult);
      expect(mockRepositoryBase.update).toHaveBeenCalledWith(1, { firstName: 'Updated' });
    });

    it('should handle update with criteria object', async () => {
      const updateResult = { affected: 1, raw: {}, generatedMaps: [] };
      mockRepositoryBase.update.mockResolvedValue(updateResult);

      const result = await userRepository.update({ email: 'john@example.com' }, { lastName: 'Updated' });

      expect(result).toEqual(updateResult);
      expect(mockRepositoryBase.update).toHaveBeenCalledWith({ email: 'john@example.com' }, { lastName: 'Updated' });
    });

    it('should handle errors when update fails', async () => {
      const error = new Error('Update failed');
      mockRepositoryBase.update.mockRejectedValue(error);

      await expect(userRepository.update(1, { firstName: 'Updated' })).rejects.toThrow('Update failed');
    });
  });

  describe('delete', () => {
    it('should delete a user by id', async () => {
      const deleteResult = { affected: 1, raw: {} };
      mockRepositoryBase.delete.mockResolvedValue(deleteResult);

      const result = await userRepository.delete(1);

      expect(result).toEqual(deleteResult);
      expect(mockRepositoryBase.delete).toHaveBeenCalledWith(1);
    });

    it('should delete a user by criteria', async () => {
      const deleteResult = { affected: 1, raw: {} };
      mockRepositoryBase.delete.mockResolvedValue(deleteResult);

      const result = await userRepository.delete({ email: 'john@example.com' });

      expect(result).toEqual(deleteResult);
      expect(mockRepositoryBase.delete).toHaveBeenCalledWith({ email: 'john@example.com' });
    });

    it('should handle errors when delete fails', async () => {
      const error = new Error('Delete failed');
      mockRepositoryBase.delete.mockRejectedValue(error);

      await expect(userRepository.delete(1)).rejects.toThrow('Delete failed');
    });
  });

  describe('count', () => {
    it('should return count of users', async () => {
      mockRepositoryBase.count.mockResolvedValue(2);

      const result = await userRepository.count();

      expect(result).toBe(2);
      expect(mockRepositoryBase.count).toHaveBeenCalledWith();
    });

    it('should return count with options', async () => {
      mockRepositoryBase.count.mockResolvedValue(1);

      const result = await userRepository.count({ where: { firstName: 'John' } });

      expect(result).toBe(1);
      expect(mockRepositoryBase.count).toHaveBeenCalledWith({ where: { firstName: 'John' } });
    });

    it('should return 0 when no users exist', async () => {
      mockRepositoryBase.count.mockResolvedValue(0);

      const result = await userRepository.count();

      expect(result).toBe(0);
    });
  });

  describe('findAndCount', () => {
    it('should return users and count', async () => {
      const result = [mockUsers, 2];
      mockRepositoryBase.findAndCount.mockResolvedValue(result);

      const [users, count] = await userRepository.findAndCount();

      expect(users).toEqual(mockUsers);
      expect(count).toBe(2);
      expect(mockRepositoryBase.findAndCount).toHaveBeenCalledWith();
    });

    it('should return empty array and 0 count when no users', async () => {
      const result = [[], 0];
      mockRepositoryBase.findAndCount.mockResolvedValue(result);

      const [users, count] = await userRepository.findAndCount();

      expect(users).toEqual([]);
      expect(count).toBe(0);
    });

    it('should handle errors when findAndCount fails', async () => {
      const error = new Error('FindAndCount failed');
      mockRepositoryBase.findAndCount.mockRejectedValue(error);

      await expect(userRepository.findAndCount()).rejects.toThrow('FindAndCount failed');
    });
  });

  describe('createQueryBuilder', () => {
    it('should create a query builder', () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockUsers),
      };
      mockRepositoryBase.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = userRepository.createQueryBuilder('user');

      expect(result).toBe(mockQueryBuilder);
      expect(mockRepositoryBase.createQueryBuilder).toHaveBeenCalledWith('user');
    });

    it('should create query builder without alias', () => {
      const mockQueryBuilder = {};
      mockRepositoryBase.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = userRepository.createQueryBuilder();

      expect(result).toBe(mockQueryBuilder);
      expect(mockRepositoryBase.createQueryBuilder).toHaveBeenCalledWith();
    });
  });

  describe('manager', () => {
    it('should expose the manager property', () => {
      expect(userRepository.manager).toBeDefined();
      expect(userRepository.manager).toBe(mockRepositoryBase.manager);
    });

    it('should support transactions', async () => {
      const mockTransactionResult = 'transaction result';
      mockRepositoryBase.manager.transaction.mockImplementation(async (cb: any) => {
        return cb(mockRepositoryBase.manager);
      });

      const result = await userRepository.manager.transaction(async (manager) => {
        return mockTransactionResult;
      });

      expect(result).toBe(mockTransactionResult);
      expect(mockRepositoryBase.manager.transaction).toHaveBeenCalled();
    });
  });

  describe('repository', () => {
    it('should expose the repository property', () => {
      expect(userRepository.repository).toBeDefined();
      expect(userRepository.repository.metadata.target).toBe(User);
      expect(userRepository.repository.metadata.name).toBe('User');
    });
  });
});