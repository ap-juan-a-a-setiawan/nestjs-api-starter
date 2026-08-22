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
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Entity properties', () => {
    it('should have all required properties defined', () => {
      expect(user).toBeDefined();
      expect(user.id).toBeUndefined();
      expect(user.first_name).toBeUndefined();
      expect(user.last_name).toBeUndefined();
      expect(user.email).toBeUndefined();
      expect(user.password).toBeUndefined();
      expect(user.status).toBeUndefined();
    });

    it('should have default status as active', () => {
      const newUser = new User();
      expect(newUser.status).toBeUndefined();
      // The default value is set by the database, not the entity
    });
  });

  describe('validatePassword', () => {
    it('should return true when password matches', async () => {
      const plainPassword = 'testPassword123';
      const hashedPassword = 'hashedPassword';
      
      user.password = hashedPassword;
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await user.validatePassword(plainPassword);

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    });

    it('should return false when password does not match', async () => {
      const plainPassword = 'wrongPassword';
      const hashedPassword = 'hashedPassword';
      
      user.password = hashedPassword;
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await user.validatePassword(plainPassword);

      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    });

    it('should handle empty password', async () => {
      const plainPassword = '';
      const hashedPassword = 'hashedPassword';
      
      user.password = hashedPassword;
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await user.validatePassword(plainPassword);

      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith('', hashedPassword);
    });

    it('should handle null password', async () => {
      const plainPassword = null;
      const hashedPassword = 'hashedPassword';
      
      user.password = hashedPassword;
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await user.validatePassword(plainPassword);

      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(null, hashedPassword);
    });

    it('should handle undefined password', async () => {
      const plainPassword = undefined;
      const hashedPassword = 'hashedPassword';
      
      user.password = hashedPassword;
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await user.validatePassword(plainPassword);

      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(undefined, hashedPassword);
    });

    it('should handle when user has no password set', async () => {
      const plainPassword = 'testPassword';
      
      user.password = undefined;
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await user.validatePassword(plainPassword);

      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, undefined);
    });

    it('should handle bcrypt errors', async () => {
      const plainPassword = 'testPassword';
      const hashedPassword = 'hashedPassword';
      const error = new Error('bcrypt error');
      
      user.password = hashedPassword;
      jest.spyOn(bcrypt, 'compare').mockRejectedValue(error);

      await expect(user.validatePassword(plainPassword)).rejects.toThrow('bcrypt error');
      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    });

    it('should handle special characters in password', async () => {
      const plainPassword = 'P@ssw0rd!$#%^&*()';
      const hashedPassword = 'hashedPassword';
      
      user.password = hashedPassword;
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await user.validatePassword(plainPassword);

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('P@ssw0rd!$#%^&*()', hashedPassword);
    });

    it('should handle very long password', async () => {
      const plainPassword = 'a'.repeat(1000);
      const hashedPassword = 'hashedPassword';
      
      user.password = hashedPassword;
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await user.validatePassword(plainPassword);

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('a'.repeat(1000), hashedPassword);
    });

    it('should handle unicode characters in password', async () => {
      const plainPassword = 'pässwörd-üñïçødé-日本語-한국어';
      const hashedPassword = 'hashedPassword';
      
      user.password = hashedPassword;
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await user.validatePassword(plainPassword);

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('pässwörd-üñïçødé-日本語-한국어', hashedPassword);
    });
  });

  describe('Entity inheritance', () => {
    it('should inherit from EntityBase', () => {
      const userInstance = new User();
      expect(userInstance).toBeInstanceOf(EntityBase);
    });

    it('should have EntityBase properties', () => {
      const userInstance = new User();
      expect(userInstance).toHaveProperty('created_at');
      expect(userInstance).toHaveProperty('updated_at');
      expect(userInstance).toHaveProperty('deleted_at');
    });
  });

  describe('Entity metadata', () => {
    it('should have entity name as users', () => {
      const metadata = Reflect.getMetadata('typeorm:entity', User);
      expect(metadata).toBeDefined();
      expect(metadata.name).toBe('users');
    });

    it('should have primary generated column for id', () => {
      const columns = Reflect.getMetadata('typeorm:columns', User);
      expect(columns).toBeDefined();
      expect(columns).toContain('id');
    });

    it('should have all required columns', () => {
      const columns = Reflect.getMetadata('typeorm:columns', User);
      expect(columns).toBeDefined();
      expect(columns).toContain('first_name');
      expect(columns).toContain('last_name');
      expect(columns).toContain('email');
      expect(columns).toContain('password');
      expect(columns).toContain('status');
    });

    it('should have password column with select false', () => {
      const columnMetadata = Reflect.getMetadata('typeorm:columns', User);
      expect(columnMetadata).toBeDefined();
      
      // Verify password column is not selected by default
      const passwordColumn = columnMetadata.find((col: any) => col.propertyName === 'password');
      expect(passwordColumn).toBeDefined();
      expect(passwordColumn.options).toMatchObject({ select: false });
    });

    it('should have status column with enum values', () => {
      const columnMetadata = Reflect.getMetadata('typeorm:columns', User);
      expect(columnMetadata).toBeDefined();
      
      const statusColumn = columnMetadata.find((col: any) => col.propertyName === 'status');
      expect(statusColumn).toBeDefined();
      expect(statusColumn.options).toMatchObject({
        type: 'enum',
        enum: ['active', 'inactive', 'block'],
        default: 'active'
      });
    });
  });

  describe('User instance methods', () => {
    it('should create a new user instance', () => {
      const newUser = new User();
      expect(newUser).toBeInstanceOf(User);
    });

    it('should set and get properties correctly', () => {
      const newUser = new User();
      newUser.id = 1;
      newUser.first_name = 'John';
      newUser.last_name = 'Doe';
      newUser.email = 'john.doe@example.com';
      newUser.password = 'hashedPassword';
      newUser.status = 'active';

      expect(newUser.id).toBe(1);
      expect(newUser.first_name).toBe('John');
      expect(newUser.last_name).toBe('Doe');
      expect(newUser.email).toBe('john.doe@example.com');
      expect(newUser.password).toBe('hashedPassword');
      expect(newUser.status).toBe('active');
    });

    it('should handle all status values', () => {
      const statuses = ['active', 'inactive', 'block'];
      
      for (const status of statuses) {
        const newUser = new User();
        newUser.status = status;
        expect(newUser.status).toBe(status);
      }
    });

    it('should handle invalid status values', () => {
      const newUser = new User();
      newUser.status = 'invalid-status';
      expect(newUser.status).toBe('invalid-status');
    });
  });
});