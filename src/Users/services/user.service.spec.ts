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
      ]
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
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

      const result = await service.getById('nonexistent');

      expect(result).toBeNull();
      expect(userRepository.findOne).toHaveBeenCalledWith('nonexistent');
    });
  });

  describe('getByEmail', () => {
    it('should return a user by email with password', async () => {
      const mockQueryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser)
      };

      userRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(userRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith('user.password');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.email = :email', { email: 'test@example.com' });
      expect(mockQueryBuilder.getOne).toHaveBeenCalled();
    });

    it('should return null when user not found', async () => {
      const mockQueryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null)
      };

      userRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getByEmail('nonexistent@example.com');

      expect(result).toBeNull();
      expect(mockQueryBuilder.getOne).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    beforeEach(() => {
      // Mock the global getRepository function
      (global as any).getRepository = getRepositoryMock;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should create a new user successfully', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null)
      };

      getRepositoryMock.mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder)
      });

      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(mockCreateUserDto);

      expect(result).toEqual(mockUser);
      expect(getRepositoryMock).toHaveBeenCalledWith(User);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.email = :email', { email: mockCreateUserDto.email });
      expect(mockQueryBuilder.getOne).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalledWith(mockCreateUserDto);
    });

    it('should throw HttpException when email already exists', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser)
      };

      getRepositoryMock.mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder)
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

    it('should throw HttpException with correct message for duplicate email', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser)
      };

      getRepositoryMock.mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder)
      });

      try {
        await service.create(mockCreateUserDto);
        fail('Expected HttpException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        expect(error.getResponse()).toEqual({
          statusCode: HttpStatus.BAD_REQUEST,
          errors: ['Email must be unique.'],
          error: 'Bad Request'
        });
      }
    });

    it('should handle database errors during save', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null)
      };

      getRepositoryMock.mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder)
      });

      const dbError = new Error('Database connection failed');
      userRepository.save.mockRejectedValue(dbError);

      await expect(service.create(mockCreateUserDto)).rejects.toThrow(dbError);
    });

    it('should handle errors during email check', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockRejectedValue(new Error('Query failed'))
      };

      getRepositoryMock.mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder)
      });

      await expect(service.create(mockCreateUserDto)).rejects.toThrow('Query failed');
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });
});