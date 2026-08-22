import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

jest.mock('bcrypt');
jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  Column: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
}));
jest.mock('../../App/abstracts/entity.base', () => ({
  EntityBase: class EntityBase {
    id: number;
    created_at: Date;
    updated_at: Date;
  },
}));

describe('User', () => {
  let user: User;
  let bcryptCompareMock: jest.Mock;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [User],
    }).compile();

    user = moduleRef.get(User);
    bcryptCompareMock = bcrypt.compare as jest.Mock;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(user).toBeDefined();
  });

  describe('validatePassword', () => {
    it('should return true when password matches', async () => {
      user.password = 'hashed_password';
      bcryptCompareMock.mockResolvedValue(true);

      const result = await user.validatePassword('plain_password');

      expect(result).toBe(true);
      expect(bcryptCompareMock).toHaveBeenCalledWith('plain_password', 'hashed_password');
      expect(bcryptCompareMock).toHaveBeenCalledTimes(1);
    });

    it('should return false when password does not match', async () => {
      user.password = 'hashed_password';
      bcryptCompareMock.mockResolvedValue(false);

      const result = await user.validatePassword('wrong_password');

      expect(result).toBe(false);
      expect(bcryptCompareMock).toHaveBeenCalledWith('wrong_password', 'hashed_password');
      expect(bcryptCompareMock).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from bcrypt.compare', async () => {
      user.password = 'hashed_password';
      const error = new Error('bcrypt error');
      bcryptCompareMock.mockRejectedValue(error);

      await expect(user.validatePassword('plain_password')).rejects.toThrow('bcrypt error');
      expect(bcryptCompareMock).toHaveBeenCalledWith('plain_password', 'hashed_password');
      expect(bcryptCompareMock).toHaveBeenCalledTimes(1);
    });

    it('should handle empty password string', async () => {
      user.password = 'hashed_password';
      bcryptCompareMock.mockResolvedValue(false);

      const result = await user.validatePassword('');

      expect(result).toBe(false);
      expect(bcryptCompareMock).toHaveBeenCalledWith('', 'hashed_password');
      expect(bcryptCompareMock).toHaveBeenCalledTimes(1);
    });

    it('should handle undefined stored password', async () => {
      user.password = undefined as any;
      bcryptCompareMock.mockResolvedValue(false);

      const result = await user.validatePassword('plain_password');

      expect(result).toBe(false);
      expect(bcryptCompareMock).toHaveBeenCalledWith('plain_password', undefined);
      expect(bcryptCompareMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('entity properties', () => {
    it('should allow setting and getting properties', () => {
      user.id = 1;
      user.first_name = 'John';
      user.last_name = 'Doe';
      user.email = 'john@example.com';
      user.password = 'secret';
      user.status = 'inactive';

      expect(user.id).toBe(1);
      expect(user.first_name).toBe('John');
      expect(user.last_name).toBe('Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.password).toBe('secret');
      expect(user.status).toBe('inactive');
    });
  });
});