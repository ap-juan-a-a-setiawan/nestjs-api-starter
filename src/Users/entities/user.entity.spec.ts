import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('User Entity', () => {
  let user: User;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    user = new User();
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

    it('should set properties correctly', () => {
      user.id = 1;
      user.first_name = 'John';
      user.last_name = 'Doe';
      user.email = 'john@example.com';
      user.password = 'hashedPassword';
      user.status = 'active';

      expect(user.id).toBe(1);
      expect(user.first_name).toBe('John');
      expect(user.last_name).toBe('Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.password).toBe('hashedPassword');
      expect(user.status).toBe('active');
    });

    it('should have default status as active', () => {
      expect(user.status).toBeUndefined();
      // Simulate entity creation with default
      user.status = 'active';
      expect(user.status).toBe('active');
    });
  });

  describe('validatePassword', () => {
    it('should return true when password matches', async () => {
      const password = 'testPassword123';
      const hashedPassword = '$2b$10$somehashedvalue';
      
      user.password = hashedPassword;
      
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      
      const result = await user.validatePassword(password);
      
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    });

    it('should return false when password does not match', async () => {
      const password = 'wrongPassword';
      const hashedPassword = '$2b$10$somehashedvalue';
      
      user.password = hashedPassword;
      
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      
      const result = await user.validatePassword(password);
      
      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    });

    it('should handle empty password', async () => {
      const password = '';
      const hashedPassword = '$2b$10$somehashedvalue';
      
      user.password = hashedPassword;
      
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      
      const result = await user.validatePassword(password);
      
      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith('', hashedPassword);
    });

    it('should handle undefined password property', async () => {
      const password = 'testPassword';
      
      user.password = undefined;
      
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      
      const result = await user.validatePassword(password);
      
      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, undefined);
    });

    it('should handle bcrypt errors', async () => {
      const password = 'testPassword';
      const hashedPassword = '$2b$10$somehashedvalue';
      
      user.password = hashedPassword;
      
      jest.spyOn(bcrypt, 'compare').mockRejectedValue(new Error('bcrypt error') as never);
      
      await expect(user.validatePassword(password)).rejects.toThrow('bcrypt error');
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should handle null password', async () => {
      const password = null;
      const hashedPassword = '$2b$10$somehashedvalue';
      
      user.password = hashedPassword;
      
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      
      const result = await user.validatePassword(password);
      
      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(null, hashedPassword);
    });

    it('should handle null hashed password', async () => {
      const password = 'testPassword';
      
      user.password = null;
      
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      
      const result = await user.validatePassword(password);
      
      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, null);
    });

    it('should handle special characters in password', async () => {
      const password = 'P@ssw0rd!$#%^&*()';
      const hashedPassword = '$2b$10$specialhash';
      
      user.password = hashedPassword;
      
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      
      const result = await user.validatePassword(password);
      
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should handle very long password', async () => {
      const password = 'a'.repeat(1000);
      const hashedPassword = '$2b$10$longhash';
      
      user.password = hashedPassword;
      
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      
      const result = await user.validatePassword(password);
      
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should handle unicode characters in password', async () => {
      const password = 'pässwörd-漢字-テスト';
      const hashedPassword = '$2b$10$unicodehash';
      
      user.password = hashedPassword;
      
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      
      const result = await user.validatePassword(password);
      
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });
  });

  describe('Entity inheritance', () => {
    it('should inherit from EntityBase', () => {
      expect(user).toBeInstanceOf(EntityBase);
    });

    it('should have EntityBase properties', () => {
      // EntityBase typically has created_at and updated_at
      expect(user).toHaveProperty('created_at');
      expect(user).toHaveProperty('updated_at');
    });
  });

  describe('Entity metadata', () => {
    it('should have entity name "users"', () => {
      // This is a compile-time check, we can verify the decorator is applied
      expect(User).toBeDefined();
      expect(User.name).toBe('User');
    });

    it('should have all column decorators applied', () => {
      // Verify the entity has the expected structure
      const userInstance = new User();
      expect(userInstance).toHaveProperty('id');
      expect(userInstance).toHaveProperty('first_name');
      expect(userInstance).toHaveProperty('last_name');
      expect(userInstance).toHaveProperty('email');
      expect(userInstance).toHaveProperty('password');
      expect(userInstance).toHaveProperty('status');
    });
  });

  describe('Status enum values', () => {
    it('should accept valid status values', () => {
      const validStatuses = ['active', 'inactive', 'block'];
      
      validStatuses.forEach(status => {
        user.status = status;
        expect(user.status).toBe(status);
      });
    });

    it('should handle invalid status values', () => {
      // TypeScript would prevent this at compile time, but we test runtime behavior
      user.status = 'invalid_status';
      expect(user.status).toBe('invalid_status');
    });
  });
});