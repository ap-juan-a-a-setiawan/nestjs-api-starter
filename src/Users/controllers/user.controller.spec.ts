import { Test } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from '../../Auth/guards/jwt-auth.guard';
import { CreateUserDto } from '../dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: {
    getAll: jest.Mock;
    getById: jest.Mock;
    create: jest.Mock;
  };

  const mockUserService = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
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

    controller = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all users from the service', async () => {
      const users = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
      ];
      mockUserService.getAll.mockResolvedValue(users);

      await expect(controller.getAll()).resolves.toEqual(users);
      expect(mockUserService.getAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when there are no users', async () => {
      mockUserService.getAll.mockResolvedValue([]);

      await expect(controller.getAll()).resolves.toEqual([]);
      expect(mockUserService.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('should call the service with the id from params and return the result', async () => {
      const user = { id: '123', name: 'John Smith' };
      mockUserService.getById.mockResolvedValue(user);

      const result = await controller.getById({ id: '123' });

      expect(mockUserService.getById).toHaveBeenCalledWith('123');
      expect(result).toEqual(user);
    });

    it('should call the service with undefined when params.id is missing', async () => {
      mockUserService.getById.mockResolvedValue(undefined);

      await expect(controller.getById({})).resolves.toBeUndefined();
      expect(mockUserService.getById).toHaveBeenCalledWith(undefined);
    });
  });

  describe('create', () => {
    it('should create a user and return statusCode OK with the created user', async () => {
      const dto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      } as CreateUserDto;
      const createdUser = { id: '1', ...dto };
      mockUserService.create.mockResolvedValue(createdUser);

      const result = await controller.create(dto);

      expect(mockUserService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        user: createdUser,
      });
    });

    it('should propagate errors thrown by the service', async () => {
      const dto = {
        username: 'invalid',
        email: 'invalid@example.com',
        password: 'password',
      } as CreateUserDto;
      const error = new Error('Creation failed');
      mockUserService.create.mockRejectedValue(error);

      await expect(controller.create(dto)).rejects.toThrow('Creation failed');
      expect(mockUserService.create).toHaveBeenCalledWith(dto);
    });
  });
});