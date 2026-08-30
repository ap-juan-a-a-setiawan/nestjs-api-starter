import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtAuthGuard } from '../../Auth/guards/jwt-auth.guard';
import { HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  const mockUserService = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      const expectedUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
      ];
      mockUserService.getAll.mockResolvedValue(expectedUsers);

      const result = await controller.getAll();

      expect(result).toEqual(expectedUsers);
      expect(mockUserService.getAll).toHaveBeenCalled();
      expect(mockUserService.getAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no users exist', async () => {
      mockUserService.getAll.mockResolvedValue([]);

      const result = await controller.getAll();

      expect(result).toEqual([]);
      expect(mockUserService.getAll).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const error = new Error('Database connection failed');
      mockUserService.getAll.mockRejectedValue(error);

      await expect(controller.getAll()).rejects.toThrow('Database connection failed');
      expect(mockUserService.getAll).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return a user by id', async () => {
      const userId = '123';
      const expectedUser = { id: 123, name: 'John Doe', email: 'john@example.com' };
      mockUserService.getById.mockResolvedValue(expectedUser);

      const result = await controller.getById({ id: userId });

      expect(result).toEqual(expectedUser);
      expect(mockUserService.getById).toHaveBeenCalledWith(userId);
      expect(mockUserService.getById).toHaveBeenCalledTimes(1);
    });

    it('should handle non-numeric id', async () => {
      const userId = 'abc';
      const expectedUser = { id: 'abc', name: 'John Doe', email: 'john@example.com' };
      mockUserService.getById.mockResolvedValue(expectedUser);

      const result = await controller.getById({ id: userId });

      expect(result).toEqual(expectedUser);
      expect(mockUserService.getById).toHaveBeenCalledWith(userId);
    });

    it('should return null when user not found', async () => {
      const userId = '999';
      mockUserService.getById.mockResolvedValue(null);

      const result = await controller.getById({ id: userId });

      expect(result).toBeNull();
      expect(mockUserService.getById).toHaveBeenCalledWith(userId);
    });

    it('should handle service errors', async () => {
      const userId = '123';
      const error = new Error('User not found');
      mockUserService.getById.mockRejectedValue(error);

      await expect(controller.getById({ id: userId })).rejects.toThrow('User not found');
      expect(mockUserService.getById).toHaveBeenCalledWith(userId);
    });
  });

  describe('create', () => {
    it('should create a user and return success response', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      const createdUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      };
      mockUserService.create.mockResolvedValue(createdUser);

      const result = await controller.create(createUserDto);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        user: createdUser,
      });
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUserService.create).toHaveBeenCalledTimes(1);
    });

    it('should handle empty user data', async () => {
      const createUserDto = {} as CreateUserDto;
      const createdUser = { id: 1 };
      mockUserService.create.mockResolvedValue(createdUser);

      const result = await controller.create(createUserDto);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        user: createdUser,
      });
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should handle service errors during creation', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      const error = new Error('Email already exists');
      mockUserService.create.mockRejectedValue(error);

      await expect(controller.create(createUserDto)).rejects.toThrow('Email already exists');
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should handle validation errors', async () => {
      const createUserDto = {
        name: '',
        email: 'invalid-email',
        password: '123',
      } as CreateUserDto;
      const error = new Error('Validation failed');
      mockUserService.create.mockRejectedValue(error);

      await expect(controller.create(createUserDto)).rejects.toThrow('Validation failed');
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('Guard configuration', () => {
    it('should have JwtAuthGuard applied to controller', () => {
      const guards = Reflect.getMetadata('__guards__', UserController);
      expect(guards).toBeDefined();
      expect(guards).toContain(JwtAuthGuard);
    });

    it('should have JwtAuthGuard applied to getAll method', () => {
      const guards = Reflect.getMetadata('__guards__', UserController.prototype.getAll);
      expect(guards).toBeDefined();
      expect(guards).toContain(JwtAuthGuard);
    });

    it('should have JwtAuthGuard applied to getById method', () => {
      const guards = Reflect.getMetadata('__guards__', UserController.prototype.getById);
      expect(guards).toBeDefined();
      expect(guards).toContain(JwtAuthGuard);
    });

    it('should have JwtAuthGuard applied to create method', () => {
      const guards = Reflect.getMetadata('__guards__', UserController.prototype.create);
      expect(guards).toBeDefined();
      expect(guards).toContain(JwtAuthGuard);
    });
  });
});