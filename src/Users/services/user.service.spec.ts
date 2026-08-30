import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRepository } from '../repositories/user.repository';

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let getRepositoryMock: jest.Mock;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockCreateUserDto: CreateUserDto = {
    email: 'new@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith'
  };

  beforeEach(async () => {
    getRepositoryMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    
    // Mock the global getRepository function
    (global as any).getRepository = getRepositoryMock;
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
      expect(userRepository.find).toHaveBeenCalled();
    });

    it('should return an empty array when no users exist', async () => {
      userRepository.find.mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual([]);
      expect(userRepository.find).toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
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

    it('should return null when user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.getById('999');

      expect(result).toBeNull();
      expect(userRepository.findOne).toHaveBeenCalledWith('999');
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      userRepository.findOne.mockRejectedValue(error);

      await expect(service.getById('1')).rejects.toThrow(error);
    });
  });

  describe('getByEmail', () => {
    it('should return a user by email', async () => {
      const queryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser)
      };

      userRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.getByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(userRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(queryBuilder.addSelect).toHaveBeenCalledWith('user.password');
      expect(queryBuilder.where).toHaveBeenCalledWith('user.email = :email', { email: 'test@example.com' });
      expect(queryBuilder.getOne).toHaveBeenCalled();
    });

    it('should return null when user not found', async () => {
      const queryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null)
      };

      userRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.getByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      const queryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockRejectedValue(error)
      };

      userRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await expect(service.getByEmail('test@example.com')).rejects.toThrow(error);
    });
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null)
      };

      getRepositoryMock.mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(queryBuilder)
      });

      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(mockCreateUserDto);

      expect(result).toEqual(mockUser);
      expect(getRepositoryMock).toHaveBeenCalledWith(User);
      expect(queryBuilder.where).toHaveBeenCalledWith('user.email = :email', { email: mockCreateUserDto.email });
      expect(queryBuilder.getOne).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalledWith(mockCreateUserDto);
    });

    it('should throw HttpException when email already exists', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser)
      };

      getRepositoryMock.mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(queryBuilder)
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

    it('should handle repository errors during email check', async () => {
      const error = new Error('Database error');
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockRejectedValue(error)
      };

      getRepositoryMock.mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(queryBuilder)
      });

      await expect(service.create(mockCreateUserDto)).rejects.toThrow(error);
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should handle repository errors during save', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null)
      };

      getRepositoryMock.mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(queryBuilder)
      });

      const error = new Error('Database error');
      userRepository.save.mockRejectedValue(error);

      await expect(service.create(mockCreateUserDto)).rejects.toThrow(error);
    });

    it('should handle empty email in DTO', async () => {
      const emptyEmailDto: CreateUserDto = {
        ...mockCreateUserDto,
        email: ''
      };

      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null)
      };

      getRepositoryMock.mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(queryBuilder)
      });

      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(emptyEmailDto);

      expect(result).toEqual(mockUser);
      expect(queryBuilder.where).toHaveBeenCalledWith('user.email = :email', { email: '' });
      expect(userRepository.save).toHaveBeenCalledWith(emptyEmailDto);
    });
  });
});