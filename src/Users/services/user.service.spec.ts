import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { getRepository } from 'typeorm';

jest.mock('typeorm', () => ({
  getRepository: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let mockQueryBuilder: any;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
  } as User;

  const mockCreateUserDto: CreateUserDto = {
    email: 'new@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
  };

  beforeEach(async () => {
    mockQueryBuilder = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      userRepository.find.mockResolvedValue(users);

      const result = await service.getAll();

      expect(result).toEqual(users);
      expect(userRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no users exist', async () => {
      userRepository.find.mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual([]);
      expect(userRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should handle errors from the repository', async () => {
      const error = new Error('Database error');
      userRepository.find.mockRejectedValue(error);

      await expect(service.getAll()).rejects.toThrow(error);
    });
  });

  describe('getById', () => {
    it('should return a user by id', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getById('1');

      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith('1');
    });

    it('should return null when user is not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.getById('999');

      expect(result).toBeNull();
      expect(userRepository.findOne).toHaveBeenCalledWith('999');
    });

    it('should handle errors from the repository', async () => {
      const error = new Error('Database error');
      userRepository.findOne.mockRejectedValue(error);

      await expect(service.getById('1')).rejects.toThrow(error);
    });
  });

  describe('getByEmail', () => {
    it('should return a user by email with password', async () => {
      const userWithPassword = { ...mockUser, password: 'plainPassword' };
      mockQueryBuilder.getOne.mockResolvedValue(userWithPassword);

      const result = await service.getByEmail('test@example.com');

      expect(result).toEqual(userWithPassword);
      expect(userRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith('user.password');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.email = :email', { email: 'test@example.com' });
      expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1);
    });

    it('should return null when user is not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);

      const result = await service.getByEmail('nonexistent@example.com');

      expect(result).toBeNull();
      expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1);
    });

    it('should handle errors from the query builder', async () => {
      const error = new Error('Database error');
      mockQueryBuilder.getOne.mockRejectedValue(error);

      await expect(service.getByEmail('test@example.com')).rejects.toThrow(error);
    });
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const mockRepoQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      (getRepository as jest.Mock).mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(mockRepoQueryBuilder),
      });
      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(mockCreateUserDto);

      expect(result).toEqual(mockUser);
      expect(getRepository).toHaveBeenCalledWith(User);
      expect(mockRepoQueryBuilder.where).toHaveBeenCalledWith('user.email = :email', { email: mockCreateUserDto.email });
      expect(mockRepoQueryBuilder.getOne).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(mockCreateUserDto);
    });

    it('should throw HttpException when email already exists', async () => {
      const mockRepoQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      };
      (getRepository as jest.Mock).mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(mockRepoQueryBuilder),
      });

      await expect(service.create(mockCreateUserDto)).rejects.toThrow(HttpException);
      await expect(service.create(mockCreateUserDto)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: ['Email must be unique.'],
          error: 'Bad Request'
        }
      });
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should handle errors when checking for existing user', async () => {
      const mockRepoQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockRejectedValue(new Error('Database error')),
      };
      (getRepository as jest.Mock).mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(mockRepoQueryBuilder),
      });

      await expect(service.create(mockCreateUserDto)).rejects.toThrow('Database error');
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should handle errors when saving the new user', async () => {
      const mockRepoQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      (getRepository as jest.Mock).mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(mockRepoQueryBuilder),
      });
      const error = new Error('Database error');
      userRepository.save.mockRejectedValue(error);

      await expect(service.create(mockCreateUserDto)).rejects.toThrow(error);
    });

    it('should handle empty email in create user dto', async () => {
      const emptyEmailDto = { ...mockCreateUserDto, email: '' };
      const mockRepoQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      (getRepository as jest.Mock).mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(mockRepoQueryBuilder),
      });
      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(emptyEmailDto);

      expect(result).toEqual(mockUser);
      expect(mockRepoQueryBuilder.where).toHaveBeenCalledWith('user.email = :email', { email: '' });
      expect(userRepository.save).toHaveBeenCalledWith(emptyEmailDto);
    });
  });
});