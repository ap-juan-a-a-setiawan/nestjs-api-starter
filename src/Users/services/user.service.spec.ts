typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getRepository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

jest.mock('typeorm', () => {
  const actual = jest.requireActual('typeorm');
  return {
    ...actual,
    getRepository: jest.fn(),
  };
});

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: any;
  let queryBuilder: any;

  beforeEach(async () => {
    jest.clearAllMocks();

    queryBuilder = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    };

    mockUserRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
      save: jest.fn(),
    };

    (getRepository as jest.Mock).mockReturnValue({
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    });

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: '1', email: 'test@example.com' }] as User[];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.getAll();

      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('getById', () => {
    it('should return the user with the provided id', async () => {
      const user = { id: '1', email: 'test@example.com' } as User;
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.getById('1');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(user);
    });
  });

  describe('getByEmail', () => {
    it('should return a user with password by email', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'secret',
      } as User;
      queryBuilder.getOne.mockResolvedValue(user);

      const result = await service.getByEmail('test@example.com');

      expect(mockUserRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(queryBuilder.addSelect).toHaveBeenCalledWith('user.password');
      expect(queryBuilder.where).toHaveBeenCalledWith('user.email = :email', {
        email: 'test@example.com',
      });
      expect(queryBuilder.getOne).toHaveBeenCalled();
      expect(result).toEqual(user);
    });
  });

  describe('create', () => {
    it('should throw an HttpException if email already exists', async () => {
      const existingUser = { id: '1', email: 'test@example.com' } as User;
      queryBuilder.getOne.mockResolvedValue(existingUser);
      const dto = {
        email: 'test@example.com',
        password: 'password',
      } as CreateUserDto;

      let error: unknown;
      try {
        await service.create(dto);
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(HttpException);
      if (error instanceof HttpException) {
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      }
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should create and return a new user if email is unique', async () => {
      queryBuilder.getOne.mockResolvedValue(null);
      const newUser = { id: '2', email: 'test@example.com' } as User;
      mockUserRepository.save.mockResolvedValue(newUser);
      const dto = {
        email: 'test@example.com',
        password: 'password',
      } as CreateUserDto;

      const result = await service.create(dto);

      expect(getRepository).toHaveBeenCalledWith(User);
      expect(mockUserRepository.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual(newUser);
    });
  });
});