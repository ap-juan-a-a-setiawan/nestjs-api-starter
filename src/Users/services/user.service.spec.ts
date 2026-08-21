import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getRepository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

jest.mock('typeorm', () => ({
  getRepository: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let mockRepository: any;
  let mockQueryBuilder: any;

  const mockUser = {
    id: 'd1a0d0e0-1f1a-2b2b-3c3c-4d4d4d4d4d4d',
    email: 'test@example.com',
    password: 'hashedPassword',
  };

  const createUserDto: CreateUserDto = {
    email: 'new@example.com',
    password: 'plainPassword',
  };

  beforeEach(async () => {
    mockQueryBuilder = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    };

    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    (getRepository as jest.Mock).mockReturnValue({
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    });

    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      mockRepository.find.mockResolvedValue([mockUser]);

      const result = await service.getAll();

      expect(result).toEqual([mockUser]);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('should return a user by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getById(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith(mockUser.id);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return undefined when no user is found', async () => {
      mockRepository.findOne.mockResolvedValue(undefined);

      const result = await service.getById('missing-id');

      expect(result).toBeUndefined();
    });
  });

  describe('getByEmail', () => {
    it('should return a user with password by email', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(mockUser);

      const result = await service.getByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith('user.password');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.email = :email', {
        email: 'test@example.com',
      });
      expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1);
    });

    it('should return null when no user is found by email', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);

      const result = await service.getByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user when email is unique', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(getRepository).toHaveBeenCalledWith(User);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.email = :email', {
        email: createUserDto.email,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(createUserDto);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpException when email already exists', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(HttpException);
      await expect(service.create(createUserDto)).rejects.toMatchObject({
        status: 400,
        response: {
          statusCode: 400,
          errors: ['Email must be unique.'],
          error: 'Bad Request',
        },
      });

      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });
});