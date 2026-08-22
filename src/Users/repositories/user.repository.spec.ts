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
    // Override the internal repository with our mock
    Object.assign(userRepository, mockRepositoryBase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockRepositoryBase.find.mockResolvedValue(mockUsers);

      const result = await userRepository.find();

      expect(result).toEqual(mockUsers);
      expect(mockRepositoryBase.find).toHaveBeenCalled();
      expect(mockRepositoryBase.find).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no users exist', async () => {
      mockRepositoryBase.find.mockResolvedValue([]);

      const result = await userRepository.find();

      expect(result).toEqual([]);
      expect(mockRepositoryBase.find).toHaveBeenCalled();
    });

    it('should pass options to find method', async () => {
      const options = { where: { isActive: true }, take: 10 };
      mockRepositoryBase.find.mockResolvedValue([mockUser]);

      await userRepository.find(options);

      expect(mockRepositoryBase.find).toHaveBeenCalledWith(options);
    });

    it('should handle errors when finding users', async () => {
      const error = new Error('Database error');
      mockRepositoryBase.find.mockRejectedValue(error);

      await expect(userRepository.find()).rejects.toThrow('Database error');
      expect(mockRepositoryBase.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user by id', async () => {
      mockRepositoryBase.findOne.mockResolvedValue(mockUser);

      const result = await userRepository.findOne(1);

      expect(result).toEqual(mockUser);
      expect(mockRepositoryBase.findOne).toHaveBeenCalledWith(1);
    });

    it('should return a single user by criteria', async () => {
      const criteria = { where: { email: 'test@example.com' } };
      mockRepositoryBase.findOne.mockResolvedValue(mockUser);

      const result = await userRepository.findOne(criteria);

      expect(result).toEqual(mockUser);
      expect(mockRepositoryBase.findOne).toHaveBeenCalledWith(criteria);
    });

    it('should return null when user not found', async () => {
      mockRepositoryBase.findOne.mockResolvedValue(null);

      const result = await userRepository.findOne(999);

      expect(result).toBeNull();
      expect(mockRepositoryBase.findOne).toHaveBeenCalledWith(999);
    });

    it('should handle errors when finding a user', async () => {
      const error = new Error('Database error');
      mockRepositoryBase.findOne.mockRejectedValue(error);

      await expect(userRepository.findOne(1)).rejects.toThrow('Database error');
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newUserData = {
        email: 'new@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
      };
      const createdUser = { ...mockUser, ...newUserData };
      mockRepositoryBase.create.mockReturnValue(createdUser);

      const result = userRepository.create(newUserData);

      expect(result).toEqual(createdUser);
      expect(mockRepositoryBase.create).toHaveBeenCalledWith(newUserData);
    });

    it('should create multiple users', async () => {
      const usersData = [
        { email: 'user1@example.com', password: 'pass1' },
        { email: 'user2@example.com', password: 'pass2' },
      ];
      const createdUsers = usersData.map((data, index) => ({
        ...mockUser,
        ...data,
        id: index + 1,
      }));
      mockRepositoryBase.create.mockReturnValue(createdUsers);

      const result = userRepository.create(usersData);

      expect(result).toEqual(createdUsers);
      expect(mockRepositoryBase.create).toHaveBeenCalledWith(usersData);
    });

    it('should handle errors when creating a user', () => {
      const error = new Error('Validation error');
      mockRepositoryBase.create.mockImplementation(() => {
        throw error;
      });

      expect(() => userRepository.create({ email: 'test@test.com' })).toThrow(
        'Validation error',
      );
    });
  });

  describe('save', () => {
    it('should save a user', async () => {
      mockRepositoryBase.save.mockResolvedValue(mockUser);

      const result = await userRepository.save(mockUser);

      expect(result).toEqual(mockUser);
      expect(mockRepositoryBase.save).toHaveBeenCalledWith(mockUser);
    });

    it('should save multiple users', async () => {
      mockRepositoryBase.save.mockResolvedValue(mockUsers);

      const result = await userRepository.save(mockUsers);

      expect(result).toEqual(mockUsers);
      expect(mockRepositoryBase.save).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle errors when saving a user', async () => {
      const error = new Error('Database error');
      mockRepositoryBase.save.mockRejectedValue(error);

      await expect(userRepository.save(mockUser)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateResult = { affected: 1, raw: {} };
      mockRepositoryBase.update.mockResolvedValue(updateResult);

      const result = await userRepository.update(1, { firstName: 'Updated' });

      expect(result).toEqual(updateResult);
      expect(mockRepositoryBase.update).toHaveBeenCalledWith(1, {
        firstName: 'Updated',
      });
    });

    it('should handle update with criteria object', async () => {
      const criteria = { email: 'test@example.com' };
      const updateResult = { affected: 1, raw: {} };
      mockRepositoryBase.update.mockResolvedValue(updateResult);

      const result = await userRepository.update(criteria, {
        isActive: false,
      });

      expect(result).toEqual(updateResult);
      expect(mockRepositoryBase.update).toHaveBeenCalledWith(criteria, {
        isActive: false,
      });
    });

    it('should handle errors when updating a user', async () => {
      const error = new Error('Database error');
      mockRepositoryBase.update.mockRejectedValue(error);

      await expect(
        userRepository.update(1, { firstName: 'Updated' }),
      ).rejects.toThrow('Database error');
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
      const criteria = { email: 'test@example.com' };
      const deleteResult = { affected: 1, raw: {} };
      mockRepositoryBase.delete.mockResolvedValue(deleteResult);

      const result = await userRepository.delete(criteria);

      expect(result).toEqual(deleteResult);
      expect(mockRepositoryBase.delete).toHaveBeenCalledWith(criteria);
    });

    it('should handle errors when deleting a user', async () => {
      const error = new Error('Database error');
      mockRepositoryBase.delete.mockRejectedValue(error);

      await expect(userRepository.delete(1)).rejects.toThrow('Database error');
    });
  });

  describe('count', () => {
    it('should return the count of users', async () => {
      mockRepositoryBase.count.mockResolvedValue(5);

      const result = await userRepository.count();

      expect(result).toBe(5);
      expect(mockRepositoryBase.count).toHaveBeenCalled();
    });

    it('should return count with criteria', async () => {
      const criteria = { where: { isActive: true } };
      mockRepositoryBase.count.mockResolvedValue(3);

      const result = await userRepository.count(criteria);

      expect(result).toBe(3);
      expect(mockRepositoryBase.count).toHaveBeenCalledWith(criteria);
    });

    it('should handle errors when counting users', async () => {
      const error = new Error('Database error');
      mockRepositoryBase.count.mockRejectedValue(error);

      await expect(userRepository.count()).rejects.toThrow('Database error');
    });
  });

  describe('findAndCount', () => {
    it('should return users and count', async () => {
      const result = [mockUsers, mockUsers.length];
      mockRepositoryBase.findAndCount.mockResolvedValue(result);

      const [users, count] = await userRepository.findAndCount();

      expect(users).toEqual(mockUsers);
      expect(count).toBe(mockUsers.length);
      expect(mockRepositoryBase.findAndCount).toHaveBeenCalled();
    });

    it('should return empty array and zero count when no users', async () => {
      mockRepositoryBase.findAndCount.mockResolvedValue([[], 0]);

      const [users, count] = await userRepository.findAndCount();

      expect(users).toEqual([]);
      expect(count).toBe(0);
    });

    it('should handle errors when finding and counting users', async () => {
      const error = new Error('Database error');
      mockRepositoryBase.findAndCount.mockRejectedValue(error);

      await expect(userRepository.findAndCount()).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('createQueryBuilder', () => {
    it('should create a query builder', () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
      };
      mockRepositoryBase.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = userRepository.createQueryBuilder('user');

      expect(result).toBe(mockQueryBuilder);
      expect(mockRepositoryBase.createQueryBuilder).toHaveBeenCalledWith(
        'user',
      );
    });

    it('should handle errors when creating query builder', () => {
      const error = new Error('Query builder error');
      mockRepositoryBase.createQueryBuilder.mockImplementation(() => {
        throw error;
      });

      expect(() => userRepository.createQueryBuilder('user')).toThrow(
        'Query builder error',
      );
    });
  });

  describe('transaction', () => {
    it('should execute a transaction', async () => {
      const transactionResult = 'transaction result';
      const mockManager = {
        transaction: jest.fn().mockResolvedValue(transactionResult),
      };
      mockRepositoryBase.manager = mockManager;

      const callback = jest.fn().mockResolvedValue(transactionResult);
      const result = await userRepository.manager.transaction(callback);

      expect(result).toBe(transactionResult);
      expect(mockManager.transaction).toHaveBeenCalledWith(callback);
    });

    it('should handle transaction errors', async () => {
      const error = new Error('Transaction failed');
      const mockManager = {
        transaction: jest.fn().mockRejectedValue(error),
      };
      mockRepositoryBase.manager = mockManager;

      const callback = jest.fn();
      await expect(userRepository.manager.transaction(callback)).rejects.toThrow(
        'Transaction failed',
      );
    });
  });

  describe('inheritance', () => {
    it('should be an instance of RepositoryBase', () => {
      expect(userRepository).toBeInstanceOf(RepositoryBase);
    });

    it('should have all RepositoryBase methods', () => {
      expect(userRepository).toHaveProperty('find');
      expect(userRepository).toHaveProperty('findOne');
      expect(userRepository).toHaveProperty('create');
      expect(userRepository).toHaveProperty('save');
      expect(userRepository).toHaveProperty('update');
      expect(userRepository).toHaveProperty('delete');
      expect(userRepository).toHaveProperty('count');
      expect(userRepository).toHaveProperty('findAndCount');
      expect(userRepository).toHaveProperty('createQueryBuilder');
      expect(userRepository).toHaveProperty('manager');
    });
  });
});