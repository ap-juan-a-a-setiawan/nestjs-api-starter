import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtAuthGuard } from '../../Auth/guards/jwt-auth.guard';

const mockUserService = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
};

const mockJwtAuthGuard = {
  canActivate: jest.fn(() => true),
};

describe('UserController', () => {
  let controller: UserController;
  let userService: { getAll: jest.Mock; getById: jest.Mock; create: jest.Mock };

  beforeEach(async () => {
    jest.resetAllMocks();
    mockJwtAuthGuard.canActivate.mockReturnValue(true);

    const moduleRef: TestingModule = await Test.createTestingModule({
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
    userService = moduleRef.get(UserService) as unknown as {
      getAll: jest.Mock;
      getById: jest.Mock;
      create: jest.Mock;
    };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all users from the user service', async () => {
      const users = [{ id: '1', name: 'Alice' }];
      userService.getAll.mockResolvedValue(users);

      const result = await controller.getAll();

      expect(userService.getAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(users);
    });

    it('should return an empty array when no users exist', async () => {
      userService.getAll.mockResolvedValue([]);

      const result = await controller.getAll();

      expect(result).toEqual([]);
      expect(userService.getAll).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors thrown by the user service', async () => {
      userService.getAll.mockRejectedValue(new Error('getAll failed'));

      await expect(controller.getAll()).rejects.toThrow('getAll failed');
      expect(userService.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('should return a user by id from params', async () => {
      const user = { id: '42', name: 'Bob' };
      userService.getById.mockResolvedValue(user);

      const result = await controller.getById({ id: '42' });

      expect(userService.getById).toHaveBeenCalledWith('42');
      expect(result).toEqual(user);
    });

    it('should handle missing id by passing undefined to the service', async () => {
      userService.getById.mockResolvedValue(null);

      const result = await controller.getById({});

      expect(userService.getById).toHaveBeenCalledWith(undefined);
      expect(result).toBeNull();
    });

    it('should propagate errors thrown by the user service', async () => {
      userService.getById.mockRejectedValue(new Error('user not found'));

      await expect(controller.getById({ id: '999' })).rejects.toThrow('user not found');
      expect(userService.getById).toHaveBeenCalledWith('999');
    });
  });

  describe('create', () => {
    it('should create a user and return statusCode 200 with the created user', async () => {
      const dto = { name: 'Charlie', email: 'charlie@example.com' } as CreateUserDto;
      const createdUser = { id: '3', ...dto };
      userService.create.mockResolvedValue(createdUser);

      const result = await controller.create(dto);

      expect(userService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ statusCode: HttpStatus.OK, user: createdUser });
    });

    it('should return HttpStatus.OK in the response', async () => {
      const dto = { name: 'Dana' } as CreateUserDto;
      userService.create.mockResolvedValue({ id: '4' });

      const result = await controller.create(dto);

      expect(result.statusCode).toBe(200);
    });

    it('should propagate errors thrown by the user service during creation', async () => {
      const dto = { name: 'Err' } as CreateUserDto;
      userService.create.mockRejectedValue(new Error('create failed'));

      await expect(controller.create(dto)).rejects.toThrow('create failed');
      expect(userService.create).toHaveBeenCalledWith(dto);
    });
  });
});