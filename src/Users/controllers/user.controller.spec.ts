import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from '../../Auth/guards/jwt-auth.guard';
import { CreateUserDto } from '../dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all users from the service', async () => {
      const users = [{ id: 1, name: 'John Doe' }];
      mockUserService.getAll.mockResolvedValue(users);

      const result = await controller.getAll();

      expect(mockUserService.getAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should return an empty array when no users exist', async () => {
      mockUserService.getAll.mockResolvedValue([]);

      const result = await controller.getAll();

      expect(mockUserService.getAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should call the service with the id from params', async () => {
      const user = { id: '123', name: 'Jane Doe' };
      mockUserService.getById.mockResolvedValue(user);

      const params = { id: '123' };
      const result = await controller.getById(params);

      expect(mockUserService.getById).toHaveBeenCalledWith('123');
      expect(result).toEqual(user);
    });

    it('should handle missing id in params', async () => {
      mockUserService.getById.mockResolvedValue(undefined);

      const result = await controller.getById({});

      expect(mockUserService.getById).toHaveBeenCalledWith(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create a user and return statusCode with the created user', async () => {
      const dto = { name: 'Alice', email: 'alice@example.com' } as CreateUserDto;
      const createdUser = { id: 1, ...dto };
      mockUserService.create.mockResolvedValue(createdUser);

      const result = await controller.create(dto);

      expect(mockUserService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        user: createdUser,
      });
    });

    it('should create a user with an empty body', async () => {
      const dto = {} as CreateUserDto;
      const createdUser = { id: 2 };
      mockUserService.create.mockResolvedValue(createdUser);

      const result = await controller.create(dto);

      expect(mockUserService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        user: createdUser,
      });
    });

    it('should propagate service errors', async () => {
      const dto = { name: 'Bob', email: 'bob@example.com' } as CreateUserDto;
      mockUserService.create.mockRejectedValue(new Error('creation failed'));

      await expect(controller.create(dto)).rejects.toThrow('creation failed');
      expect(mockUserService.create).toHaveBeenCalledWith(dto);
    });
  });
});