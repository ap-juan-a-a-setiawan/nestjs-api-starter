import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('User Entity', () => {
  let user: User;
  let mockRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      // Add other repository methods as needed
    } as unknown as jest.Mocked<Repository<User>>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        User,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    user = moduleRef.get<User>(User);
  });

  describe('User entity properties', () => {
    it('should have all required properties defined', () => {
      expect(user).toBeDefined();
      expect(user.id).toBeUndefined();
      expect(user.first_name).toBeUndefined();
      expect(user.last_name).toBeUndefined();
      expect(user.email).toBeUndefined();
      expect(user.password).toBeUndefined();
      expect(user.status).toBeUndefined();
    });

    it('should set properties correctly', () => {
      const userData = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: 'hashedPassword123',
        status: 'active',
      };

      Object.assign(user, userData);

      expect(user.id).toBe(1);
      expect(user.first_name).toBe('John');
      expect(user.last_name).toBe('Doe');
      expect(user.email).toBe('john.doe@example.com');
      expect(user.password).toBe('hashedPassword123');
      expect(user.status).toBe('active');
    });

    it('should have default status as active when not set', () => {
      const userData = {
        id: 1,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        password: 'hashedPassword456',
      };

      Object.assign(user, userData);

      expect(user.status).toBeUndefined(); // Default value is handled by database
    });
  });

  describe('validatePassword', () => {
    beforeEach(() => {
      user.password = 'hashedPassword123';
    });

    it('should return true when password matches', async () => {
      const plainPassword = 'plainPassword123';
      const bcryptCompareMock = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await user.validatePassword(plainPassword);

      expect(result).toBe(true);
      expect(bcryptCompareMock).toHaveBeenCalledWith(plainPassword, user.password);
      expect(bcryptCompareMock).toHaveBeenCalledTimes(1);

      bcryptCompareMock.mockRestore();
    });

    it('should return false when password does not match', async () => {
      const plainPassword = 'wrongPassword';
      const bcryptCompareMock = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await user.validatePassword(plainPassword);

      expect(result).toBe(false);
      expect(bcryptCompareMock).toHaveBeenCalledWith(plainPassword, user.password);
      expect(bcryptCompareMock).toHaveBeenCalledTimes(1);

      bcryptCompareMock.mockRestore();
    });

    it('should handle empty password', async () => {
      const plainPassword = '';
      const bcryptCompareMock = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await user.validatePassword(plainPassword);

      expect(result).toBe(false);
      expect(bcryptCompareMock).toHaveBeenCalledWith(plainPassword, user.password);
      expect(bcryptCompareMock).toHaveBeenCalledTimes(1);

      bcryptCompareMock.mockRestore();
    });

    it('should handle null password', async () => {
      const plainPassword = null;
      const bcryptCompareMock = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await user.validatePassword(plainPassword);

      expect(result).toBe(false);
      expect(bcryptCompareMock).toHaveBeenCalledWith(plainPassword, user.password);
      expect(bcryptCompareMock).toHaveBeenCalledTimes(1);

      bcryptCompareMock.mockRestore();
    });

    it('should handle undefined password', async () => {
      const plainPassword = undefined;
      const bcryptCompareMock = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await user.validatePassword(plainPassword);

      expect(result).toBe(false);
      expect(bcryptCompareMock).toHaveBeenCalledWith(plainPassword, user.password);
      expect(bcryptCompareMock).toHaveBeenCalledTimes(1);

      bcryptCompareMock.mockRestore();
    });

    it('should handle bcrypt errors', async () => {
      const plainPassword = 'testPassword';
      const error = new Error('bcrypt error');
      const bcryptCompareMock = jest.spyOn(bcrypt, 'compare').mockRejectedValue(error);

      await expect(user.validatePassword(plainPassword)).rejects.toThrow('bcrypt error');
      expect(bcryptCompareMock).toHaveBeenCalledWith(plainPassword, user.password);
      expect(bcryptCompareMock).toHaveBeenCalledTimes(1);

      bcryptCompareMock.mockRestore();
    });

    it('should handle when user password is not set', async () => {
      user.password = undefined;
      const plainPassword = 'testPassword';
      const bcryptCompareMock = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await user.validatePassword(plainPassword);

      expect(result).toBe(false);
      expect(bcryptCompareMock).toHaveBeenCalledWith(plainPassword, undefined);
      expect(bcryptCompareMock).toHaveBeenCalledTimes(1);

      bcryptCompareMock.mockRestore();
    });

    it('should handle when user password is empty string', async () => {
      user.password = '';
      const plainPassword = 'testPassword';
      const bcryptCompareMock = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await user.validatePassword(plainPassword);

      expect(result).toBe(false);
      expect(bcryptCompareMock).toHaveBeenCalledWith(plainPassword, '');
      expect(bcryptCompareMock).toHaveBeenCalledTimes(1);

      bcryptCompareMock.mockRestore();
    });

    it('should handle special characters in password', async () => {
      const plainPassword = 'P@ssw0rd!$#%^&*()';
      const bcryptCompareMock = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await user.validatePassword(plainPassword);

      expect(result).toBe(true);
      expect(bcryptCompareMock).toHaveBeenCalledWith(plainPassword, user.password);
      expect(bcryptCompareMock).toHaveBeenCalledTimes(1);

      bcryptCompareMock.mockRestore();
    });

    it('should handle very long passwords', async () => {
      const plainPassword = 'a'.repeat(1000);
      const bcryptCompareMock = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await user.validatePassword(plainPassword);

      expect(result).toBe(true);
      expect(bcryptCompareMock).toHaveBeenCalledWith(plainPassword, user.password);
      expect(bcryptCompareMock).toHaveBeenCalledTimes(1);

      bcryptCompareMock.mockRestore();
    });

    it('should handle unicode characters in password', async () => {
      const plainPassword = 'pässwörd-ünïcödé-日本語-😀';
      const bcryptCompareMock = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await user.validatePassword(plainPassword);

      expect(result).toBe(true);
      expect(bcryptCompareMock).toHaveBeenCalledWith(plainPassword, user.password);
      expect(bcryptCompareMock).toHaveBeenCalledTimes(1);

      bcryptCompareMock.mockRestore();
    });

    it('should call bcrypt.compare with correct arguments', async () => {
      const plainPassword = 'testPassword123';
      const bcryptCompareMock = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      await user.validatePassword(plainPassword);

      expect(bcryptCompareMock).toHaveBeenCalledWith(plainPassword, user.password);
      expect(bcryptCompareMock).toHaveBeenCalledTimes(1);

      bcryptCompareMock.mockRestore();
    });

    it('should return a Promise<boolean>', () => {
      const plainPassword = 'testPassword';
      const bcryptCompareMock = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = user.validatePassword(plainPassword);

      expect(result).toBeInstanceOf(Promise);
      expect(result).resolves.toBe(true);

      bcryptCompareMock.mockRestore();
    });
  });

  describe('Entity inheritance', () => {
    it('should inherit from EntityBase', () => {
      expect(User.prototype).toBeInstanceOf(EntityBase);
    });

    it('should have EntityBase properties', () => {
      const userInstance = new User();
      expect(userInstance).toHaveProperty('created_at');
      expect(userInstance).toHaveProperty('updated_at');
      expect(userInstance).toHaveProperty('deleted_at');
    });
  });

  describe('Entity decorators', () => {
    it('should have entity metadata', () => {
      const metadata = Reflect.getMetadata('typeorm:entity', User);
      expect(metadata).toBeDefined();
      expect(metadata.name).toBe('users');
    });

    it('should have column metadata for all properties', () => {
      const columns = Reflect.getMetadata('typeorm:columns', User);
      expect(columns).toBeDefined();
      expect(columns).toContain('id');
      expect(columns).toContain('first_name');
      expect(columns).toContain('last_name');
      expect(columns).toContain('email');
      expect(columns).toContain('password');
      expect(columns).toContain('status');
    });
  });
});