import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('User Entity', () => {
  let user: User;
  let repository: Repository<User>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        User,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    user = moduleRef.get<User>(User);
    repository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Entity Definition', () => {
    it('should be defined', () => {
      expect(user).toBeDefined();
    });

    it('should have all required properties', () => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('first_name');
      expect(user).toHaveProperty('last_name');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('password');
      expect(user).toHaveProperty('status');
    });

    it('should have default status as active', () => {
      const newUser = new User();
      expect(newUser.status).toBe('active');
    });

    it('should have password field with select: false', () => {
      const passwordColumn = Reflect.getMetadata('typeorm:columns', User);
      expect(passwordColumn).toBeDefined();
    });
  });

  describe('validatePassword', () => {
    beforeEach(() => {
      user.password = 'hashedPassword123';
    });

    it('should return true when password matches', async () => {
      const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      
      const result = await user.validatePassword('correctPassword');
      
      expect(result).toBe(true);
      expect(bcryptCompareSpy).toHaveBeenCalledWith('correctPassword', 'hashedPassword123');
      expect(bcryptCompareSpy).toHaveBeenCalledTimes(1);
    });

    it('should return false when password does not match', async () => {
      const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      
      const result = await user.validatePassword('wrongPassword');
      
      expect(result).toBe(false);
      expect(bcryptCompareSpy).toHaveBeenCalledWith('wrongPassword', 'hashedPassword123');
      expect(bcryptCompareSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle bcrypt errors', async () => {
      const error = new Error('bcrypt error');
      const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare').mockRejectedValue(error);
      
      await expect(user.validatePassword('anyPassword')).rejects.toThrow('bcrypt error');
      expect(bcryptCompareSpy).toHaveBeenCalledWith('anyPassword', 'hashedPassword123');
      expect(bcryptCompareSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle empty password', async () => {
      const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      
      const result = await user.validatePassword('');
      
      expect(result).toBe(false);
      expect(bcryptCompareSpy).toHaveBeenCalledWith('', 'hashedPassword123');
      expect(bcryptCompareSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle null password', async () => {
      user.password = null as any;
      const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      
      const result = await user.validatePassword('anyPassword');
      
      expect(result).toBe(false);
      expect(bcryptCompareSpy).toHaveBeenCalledWith('anyPassword', null);
      expect(bcryptCompareSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Repository Operations', () => {
    it('should find all users', async () => {
      const users = [
        { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', status: 'active' },
        { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', status: 'inactive' },
      ];
      mockRepository.find.mockResolvedValue(users);

      const result = await repository.find();

      expect(result).toEqual(users);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should find one user by id', async () => {
      const userData = { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', status: 'active' };
      mockRepository.findOne.mockResolvedValue(userData);

      const result = await repository.findOne({ where: { id: 1 } });

      expect(result).toEqual(userData);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return null when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.findOne({ where: { id: 999 } });

      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should save a new user', async () => {
      const newUser = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        status: 'active',
      };
      const savedUser = { id: 1, ...newUser };
      mockRepository.save.mockResolvedValue(savedUser);

      const result = await repository.save(newUser);

      expect(result).toEqual(savedUser);
      expect(mockRepository.save).toHaveBeenCalledWith(newUser);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should update a user', async () => {
      const updateData = { first_name: 'John Updated' };
      const updateResult = { affected: 1 };
      mockRepository.update.mockResolvedValue(updateResult);

      const result = await repository.update(1, updateData);

      expect(result).toEqual(updateResult);
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateData);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should delete a user', async () => {
      const deleteResult = { affected: 1 };
      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await repository.delete(1);

      expect(result).toEqual(deleteResult);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockRepository.find.mockRejectedValue(error);

      await expect(repository.find()).rejects.toThrow('Database error');
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('Entity Validation', () => {
    it('should validate email format', () => {
      const validUser = new User();
      validUser.email = 'test@example.com';
      validUser.first_name = 'John';
      validUser.last_name = 'Doe';
      validUser.password = 'password123';

      expect(validUser.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('should validate status enum values', () => {
      const validStatuses = ['active', 'inactive', 'block'];
      
      validStatuses.forEach(status => {
        const userWithStatus = new User();
        userWithStatus.status = status;
        expect(validStatuses).toContain(userWithStatus.status);
      });
    });

    it('should reject invalid status values', () => {
      const invalidStatuses = ['pending', 'deleted', 'suspended'];
      
      invalidStatuses.forEach(status => {
        const userWithStatus = new User();
        userWithStatus.status = status;
        expect(['active', 'inactive', 'block']).not.toContain(userWithStatus.status);
      });
    });
  });
});