import { Test } from '@nestjs/testing';
import { Connection, InsertEvent, UpdateEvent, RemoveEvent } from 'typeorm';
import { UserSubscriber } from './user.subscriber';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserSubscriber', () => {
  let subscriber: UserSubscriber;
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
    mockConnection = {
      subscribers: [],
    } as unknown as jest.Mocked<Connection>;

    mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
    mockBcrypt.hash.mockResolvedValue('hashedPassword123');

    const moduleRef = await Test.createTestingModule({
      providers: [
        UserSubscriber,
        {
          provide: Connection,
          useValue: mockConnection,
        },
      ],
    }).compile();

    subscriber = moduleRef.get<UserSubscriber>(UserSubscriber);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should push the subscriber to the connection subscribers array', () => {
      expect(mockConnection.subscribers).toContain(subscriber);
    });

    it('should push exactly one subscriber to the connection', () => {
      expect(mockConnection.subscribers).toHaveLength(1);
    });
  });

  describe('listenTo', () => {
    it('should return the User entity', () => {
      expect(subscriber.listenTo()).toBe(User);
    });
  });

  describe('beforeInsert', () => {
    it('should hash the password before insertion', async () => {
      const insertEvent: InsertEvent<User> = {
        entity: { ...mockUser },
        manager: {} as any,
        connection: mockConnection,
        queryRunner: {} as any,
        metadata: {} as any,
      };

      await subscriber.beforeInsert(insertEvent);

      expect(mockBcrypt.hash).toHaveBeenCalledWith('plainPassword123', 10);
      expect(insertEvent.entity.password).toBe('hashedPassword123');
    });

    it('should handle empty password', async () => {
      const insertEvent: InsertEvent<User> = {
        entity: { ...mockUser, password: '' },
        manager: {} as any,
        connection: mockConnection,
        queryRunner: {} as any,
        metadata: {} as any,
      };

      mockBcrypt.hash.mockResolvedValue('hashedEmptyPassword');

      await subscriber.beforeInsert(insertEvent);

      expect(mockBcrypt.hash).toHaveBeenCalledWith('', 10);
      expect(insertEvent.entity.password).toBe('hashedEmptyPassword');
    });

    it('should handle undefined password', async () => {
      const insertEvent: InsertEvent<User> = {
        entity: { ...mockUser, password: undefined as any },
        manager: {} as any,
        connection: mockConnection,
        queryRunner: {} as any,
        metadata: {} as any,
      };

      mockBcrypt.hash.mockResolvedValue('hashedUndefinedPassword');

      await subscriber.beforeInsert(insertEvent);

      expect(mockBcrypt.hash).toHaveBeenCalledWith(undefined, 10);
      expect(insertEvent.entity.password).toBe('hashedUndefinedPassword');
    });

    it('should handle bcrypt hash errors', async () => {
      const insertEvent: InsertEvent<User> = {
        entity: { ...mockUser },
        manager: {} as any,
        connection: mockConnection,
        queryRunner: {} as any,
        metadata: {} as any,
      };

      mockBcrypt.hash.mockRejectedValue(new Error('Hash failed'));

      await expect(subscriber.beforeInsert(insertEvent)).rejects.toThrow('Hash failed');
      expect(insertEvent.entity.password).toBe('plainPassword123');
    });
  });

  describe('hashPassword', () => {
    it('should hash a password with salt rounds of 10', async () => {
      const result = await subscriber.hashPassword('testPassword');

      expect(mockBcrypt.hash).toHaveBeenCalledWith('testPassword', 10);
      expect(result).toBe('hashedPassword123');
    });

    it('should hash an empty password', async () => {
      mockBcrypt.hash.mockResolvedValue('hashedEmpty');

      const result = await subscriber.hashPassword('');

      expect(mockBcrypt.hash).toHaveBeenCalledWith('', 10);
      expect(result).toBe('hashedEmpty');
    });

    it('should hash a password with special characters', async () => {
      const specialPassword = 'P@ssw0rd!$#%';
      mockBcrypt.hash.mockResolvedValue('hashedSpecial');

      const result = await subscriber.hashPassword(specialPassword);

      expect(mockBcrypt.hash).toHaveBeenCalledWith(specialPassword, 10);
      expect(result).toBe('hashedSpecial');
    });

    it('should handle bcrypt errors', async () => {
      mockBcrypt.hash.mockRejectedValue(new Error('Bcrypt error'));

      await expect(subscriber.hashPassword('testPassword')).rejects.toThrow('Bcrypt error');
    });

    it('should return different hashes for different passwords', async () => {
      mockBcrypt.hash
        .mockResolvedValueOnce('hash1')
        .mockResolvedValueOnce('hash2');

      const hash1 = await subscriber.hashPassword('password1');
      const hash2 = await subscriber.hashPassword('password2');

      expect(hash1).toBe('hash1');
      expect(hash2).toBe('hash2');
      expect(mockBcrypt.hash).toHaveBeenCalledTimes(2);
    });
  });
});