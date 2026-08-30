import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { UserSubscriber } from './user.subscriber';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserSubscriber', () => {
  let userSubscriber: UserSubscriber;
  let mockConnection: jest.Mocked<Connection>;
  let mockBcrypt: jest.Mocked<typeof bcrypt>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'plainPassword123',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
    mockBcrypt.hash.mockResolvedValue('hashedPassword123');

    mockConnection = {
      subscribers: [],
    } as unknown as jest.Mocked<Connection>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        UserSubscriber,
        {
          provide: Connection,
          useValue: mockConnection,
        },
      ],
    }).compile();

    userSubscriber = moduleRef.get<UserSubscriber>(UserSubscriber);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should push the subscriber to the connection subscribers array', () => {
      expect(mockConnection.subscribers).toContain(userSubscriber);
    });

    it('should push exactly one subscriber to the connection', () => {
      expect(mockConnection.subscribers).toHaveLength(1);
    });
  });

  describe('listenTo', () => {
    it('should return the User entity', () => {
      expect(userSubscriber.listenTo()).toBe(User);
    });
  });

  describe('beforeInsert', () => {
    it('should hash the password before insertion', async () => {
      const event = {
        entity: { ...mockUser },
      } as InsertEvent<User>;

      await userSubscriber.beforeInsert(event);

      expect(mockBcrypt.hash).toHaveBeenCalledWith('plainPassword123', 10);
      expect(event.entity.password).toBe('hashedPassword123');
    });

    it('should handle empty password', async () => {
      const event = {
        entity: { ...mockUser, password: '' },
      } as InsertEvent<User>;

      mockBcrypt.hash.mockResolvedValue('');

      await userSubscriber.beforeInsert(event);

      expect(mockBcrypt.hash).toHaveBeenCalledWith('', 10);
      expect(event.entity.password).toBe('');
    });

    it('should handle undefined password', async () => {
      const event = {
        entity: { ...mockUser, password: undefined },
      } as InsertEvent<User>;

      mockBcrypt.hash.mockResolvedValue(undefined);

      await userSubscriber.beforeInsert(event);

      expect(mockBcrypt.hash).toHaveBeenCalledWith(undefined, 10);
      expect(event.entity.password).toBeUndefined();
    });

    it('should propagate bcrypt errors', async () => {
      const event = {
        entity: { ...mockUser },
      } as InsertEvent<User>;

      const error = new Error('Bcrypt hash failed');
      mockBcrypt.hash.mockRejectedValue(error);

      await expect(userSubscriber.beforeInsert(event)).rejects.toThrow(error);
      expect(mockBcrypt.hash).toHaveBeenCalledWith('plainPassword123', 10);
    });
  });

  describe('hashPassword', () => {
    it('should hash a password with salt rounds of 10', async () => {
      const password = 'mySecretPassword';
      mockBcrypt.hash.mockResolvedValue('hashedSecretPassword');

      const result = await userSubscriber.hashPassword(password);

      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe('hashedSecretPassword');
    });

    it('should handle empty password', async () => {
      mockBcrypt.hash.mockResolvedValue('');

      const result = await userSubscriber.hashPassword('');

      expect(mockBcrypt.hash).toHaveBeenCalledWith('', 10);
      expect(result).toBe('');
    });

    it('should handle special characters in password', async () => {
      const password = 'P@ssw0rd!$#%^&*()';
      mockBcrypt.hash.mockResolvedValue('hashedSpecialPassword');

      const result = await userSubscriber.hashPassword(password);

      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe('hashedSpecialPassword');
    });

    it('should propagate bcrypt errors', async () => {
      const error = new Error('Bcrypt error');
      mockBcrypt.hash.mockRejectedValue(error);

      await expect(userSubscriber.hashPassword('password')).rejects.toThrow(error);
      expect(mockBcrypt.hash).toHaveBeenCalledWith('password', 10);
    });
  });
});