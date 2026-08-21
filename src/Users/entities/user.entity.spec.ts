import { Test } from '@nestjs/testing';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

jest.mock('typeorm', () => ({
  Entity: jest.fn(() => jest.fn()),
  Column: jest.fn(() => jest.fn()),
  PrimaryGeneratedColumn: jest.fn(() => jest.fn()),
}));

jest.mock('../../App/abstracts/entity.base', () => ({
  EntityBase: class EntityBase {},
}));

describe('User Entity', () => {
  let user: User;
  let bcryptCompareMock: jest.Mock;

  beforeAll(() => {
    bcryptCompareMock = bcrypt.compare as jest.Mock;
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [User],
    }).compile();

    user = moduleRef.get(User);
  });

  it('should be defined', () => {
    expect(user).toBeDefined();
  });

  it('should have undefined id initially', () => {
    expect(user.id).toBeUndefined();
  });

  describe('validatePassword', () => {
    it('should return true when the password matches', async () => {
      user.password = 'hashed_password';
      bcryptCompareMock.mockResolvedValue(true);

      await expect(user.validatePassword('plain_password')).resolves.toBe(true);

      expect(bcryptCompareMock).toHaveBeenCalledWith('plain_password', 'hashed_password');
      expect(bcryptCompareMock).toHaveBeenCalledTimes(1);
    });

    it('should return false when the password does not match', async () => {
      user.password = 'hashed_password';
      bcryptCompareMock.mockResolvedValue(false);

      await expect(user.validatePassword('wrong_password')).resolves.toBe(false);

      expect(bcryptCompareMock).toHaveBeenCalledWith('wrong_password', 'hashed_password');
      expect(bcryptCompareMock).toHaveBeenCalledTimes(1);
    });

    it('should propagate an error when bcrypt.compare throws', async () => {
      user.password = 'hashed_password';
      const error = new Error('bcrypt comparison failed');
      bcryptCompareMock.mockRejectedValue(error);

      await expect(user.validatePassword('plain_password')).rejects.toThrow('bcrypt comparison failed');
      expect(bcryptCompareMock).toHaveBeenCalledWith('plain_password', 'hashed_password');
      expect(bcryptCompareMock).toHaveBeenCalledTimes(1);
    });
  });
});