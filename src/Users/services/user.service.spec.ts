typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getRepository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

jest.mock('typeorm', () => ({
  getRepository: jest.fn(),
}));

jest.mock('../entities/user.entity', () => ({
  User: class User {},
}));

jest.mock('../repositories/user.repository', () => ({
  UserRepository: class UserRepository {},
}));

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: {
    find: jest.Mock;
    findOne: jest.Mock;
    createQueryBuilder: jest.Mock;
    save: jest.Mock;
  };
  let mockGetRepository: jest.Mock;

  beforeEach(async () => {
    mockUserRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
      save: jest.fn(),
    };

    mockGetRepository = getRepository as jest.Mock;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: '1', email: 'test@example.com' }];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.getAll();

      expect(result).toEqual(users);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });

    it('should return an empty array when no users exist', async () => {
      mockUserRepository.find.mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return a user by id', async () => {
      const user = { id: '1', email: 'test@example.com' };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.getById('1');

      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith('1');
    });

    it('should return null when user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.getById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('getByEmail', () => {
    it('should return a user with password selected', async () => {
      const user = { id: '1', email: 'test@example.com', password: 'hashed' };
      const queryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(user),
      };
      mockUserRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.getByEmail('test@example.com');

      expect(result).toEqual(user);
      expect(mockUserRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(queryBuilder.addSelect).toHaveBeenCalledWith('user.password');
      expect(queryBuilder.where).toHaveBeenCalledWith('user.email = :email', {
        email: 'test@example.com',
      });
      expect(queryBuilder.getOne).toHaveBeenCalled();
    });

    it('should return null when no user matches the email', async () => {
      const queryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockUserRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.getByEmail('missing@example.com');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'new@example.com',
      password: 'password123',
    };

    it('should throw HttpException when email already exists', async () => {
      const existingUser = { id: '1', email: createUserDto.email };
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(existingUser),
      };
      mockGetRepository.mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
      });

      let error: any;
      try {
        await service.create(createUserDto);
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(HttpException);
      expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(error.getResponse()).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        errors: ['Email must be unique.'],
        error: 'Bad Request',
      });
      expect(mockGetRepository).toHaveBeenCalledWith(User);
      expect(queryBuilder.where).toHaveBeenCalledWith('user.email = :email', {
        email: createUserDto.email,
      });
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should create and return a new user when email is unique', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockGetRepository.mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
      });

      const newUser = { id: '2', ...createUserDto };
      mockUserRepository.save.mockResolvedValue(newUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(newUser);
      expect(mockGetRepository).toHaveBeenCalledWith(User);
      expect(queryBuilder.where).toHaveBeenCalledWith('user.email = :email', {
        email: createUserDto.email,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(createUserDto);
    });
  });
});