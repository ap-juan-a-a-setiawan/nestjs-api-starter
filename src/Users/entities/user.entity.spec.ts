ts
jest.mock('../../App/abstracts/entity.base', () => ({
  EntityBase: class EntityBase {},
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  Column: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
}));

import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

describe('User Entity', () => {
  let user: User;
  let mockCompare: jest.Mock;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [User],
    }).compile();

    user = moduleRef.get(User);
    mockCompare = bcrypt.compare as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(user).toBeDefined();
  });

  describe('validatePassword', () => {
    it('should return true when bcrypt.compare resolves to true', async () => {
      mockCompare.mockResolvedValue(true);
      user.password = 'hashedPassword';

      const result = await user.validatePassword('plainPassword');

      expect(mockCompare).toHaveBeenCalledWith('plainPassword', 'hashedPassword');
      expect(result).toBe(true);
    });

    it('should return false when bcrypt.compare resolves to false', async () => {
      mockCompare.mockResolvedValue(false);
      user.password = 'hashedPassword';

      const result = await user.validatePassword('wrongPassword');

      expect(mockCompare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
      expect(result).toBe(false);
    });

    it('should propagate errors thrown by bcrypt.compare', async () => {
      const error = new Error('bcrypt comparison failed');
      mockCompare.mockRejectedValue(error);
      user.password = 'hashedPassword';

      await expect(user.validatePassword('plainPassword')).rejects.toThrow('bcrypt comparison failed');
      expect(mockCompare).toHaveBeenCalledWith('plainPassword', 'hashedPassword');
    });

    it('should handle empty plain password', async () => {
      mockCompare.mockResolvedValue(false);
      user.password = 'hashedPassword';

      const result = await user.validatePassword('');

      expect(mockCompare).toHaveBeenCalledWith('', 'hashedPassword');
      expect(result).toBe(false);
    });

    it('should handle empty stored password', async () => {
      mockCompare.mockResolvedValue(false);
      user.password = '';

      const result = await user.validatePassword('plainPassword');

      expect(mockCompare).toHaveBeenCalledWith('plainPassword', '');
      expect(result).toBe(false);
    });
  });
});