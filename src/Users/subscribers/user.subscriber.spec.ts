import { Test } from '@nestjs/testing';
import { Connection, InsertEvent } from 'typeorm';
import { UserSubscriber } from './user.subscriber';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserSubscriber', () => {
  let subscriber: UserSubscriber;
  let mockConnection: jest.Mocked<Connection>;

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

    it('should handle bcrypt hash errors', async () => {
      const password = 'plainPassword123';
      const error = new Error('Hash failed');
      
      (bcrypt.hash as jest.Mock).mockRejectedValue(error);

      await expect(subscriber.hashPassword(password)).rejects.toThrow('Hash failed');
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it('should handle empty password', async () => {
      const password = '';
      const hashedPassword = 'hashedEmptyPassword';
      
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await subscriber.hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith('', 10);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('beforeInsert', () => {
    it('should hash the password before inserting a user', async () => {
      const plainPassword = 'plainPassword123';
      const hashedPassword = 'hashedPassword123';
      const user = new User();
      user.password = plainPassword;

      const event = {
        entity: user,
      } as InsertEvent<User>;

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      await subscriber.beforeInsert(event);

      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
      expect(event.entity.password).toBe(hashedPassword);
    });

    it('should handle null password', async () => {
      const user = new User();
      user.password = null as unknown as string;

      const event = {
        entity: user,
      } as InsertEvent<User>;

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedNullPassword');

      await subscriber.beforeInsert(event);

      expect(bcrypt.hash).toHaveBeenCalledWith(null, 10);
      expect(event.entity.password).toBe('hashedNullPassword');
    });

    it('should handle bcrypt errors during beforeInsert', async () => {
      const plainPassword = 'plainPassword123';
      const user = new User();
      user.password = plainPassword;

      const event = {
        entity: user,
      } as InsertEvent<User>;

      const error = new Error('Bcrypt error');
      (bcrypt.hash as jest.Mock).mockRejectedValue(error);

      await expect(subscriber.beforeInsert(event)).rejects.toThrow('Bcrypt error');
      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
    });

    it('should handle undefined entity', async () => {
      const event = {
        entity: undefined,
      } as InsertEvent<User>;

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedUndefined');

      await subscriber.beforeInsert(event);

      expect(bcrypt.hash).toHaveBeenCalledWith(undefined, 10);
    });
  });
});