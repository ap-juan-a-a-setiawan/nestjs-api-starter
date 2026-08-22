import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { UserSubscriber } from './user.subscriber';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserSubscriber', () => {
  let subscriber: UserSubscriber;
  let mockConnection: jest.Mocked<Connection>;
  let mockInsertEvent: jest.Mocked<InsertEvent<User>>;

  beforeEach(async () => {
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

    subscriber = moduleRef.get<UserSubscriber>(UserSubscriber);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should push the subscriber to the connection subscribers array', () => {
      expect(mockConnection.subscribers).toContain(subscriber);
    });
  });

  describe('listenTo', () => {
    it('should return the User entity', () => {
      expect(subscriber.listenTo()).toBe(User);
    });
  });

  describe('hashPassword', () => {
    it('should hash the password with bcrypt using salt rounds of 10', async () => {
      const password = 'plainPassword123';
      const hashedPassword = 'hashedPassword123';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await subscriber.hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });

    it('should handle empty password', async () => {
      const password = '';
      const hashedPassword = 'hashedEmptyPassword';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await subscriber.hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });

    it('should propagate bcrypt errors', async () => {
      const password = 'password123';
      const error = new Error('bcrypt error');

      (bcrypt.hash as jest.Mock).mockRejectedValue(error);

      await expect(subscriber.hashPassword(password)).rejects.toThrow(error);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });
  });

  describe('beforeInsert', () => {
    beforeEach(() => {
      mockInsertEvent = {
        entity: {
          password: 'plainPassword123',
        },
      } as unknown as jest.Mocked<InsertEvent<User>>;
    });

    it('should hash the password before insertion', async () => {
      const hashedPassword = 'hashedPassword123';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      await subscriber.beforeInsert(mockInsertEvent);

      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword123', 10);
      expect(mockInsertEvent.entity.password).toBe(hashedPassword);
    });

    it('should handle empty password in event entity', async () => {
      mockInsertEvent.entity.password = '';
      const hashedPassword = 'hashedEmptyPassword';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      await subscriber.beforeInsert(mockInsertEvent);

      expect(bcrypt.hash).toHaveBeenCalledWith('', 10);
      expect(mockInsertEvent.entity.password).toBe(hashedPassword);
    });

    it('should handle undefined password in event entity', async () => {
      mockInsertEvent.entity.password = undefined as unknown as string;
      const hashedPassword = 'hashedUndefinedPassword';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      await subscriber.beforeInsert(mockInsertEvent);

      expect(bcrypt.hash).toHaveBeenCalledWith(undefined, 10);
      expect(mockInsertEvent.entity.password).toBe(hashedPassword);
    });

    it('should propagate errors from hashPassword', async () => {
      const error = new Error('Hashing failed');

      (bcrypt.hash as jest.Mock).mockRejectedValue(error);

      await expect(subscriber.beforeInsert(mockInsertEvent)).rejects.toThrow(error);
      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword123', 10);
    });
  });
});