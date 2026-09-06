import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { UserSubscriber } from './user.subscriber';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserSubscriber', () => {
  let userSubscriber: UserSubscriber;
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

    userSubscriber = moduleRef.get<UserSubscriber>(UserSubscriber);
    mockInsertEvent = {
      entity: {
        password: 'plainPassword123',
      },
    } as jest.Mocked<InsertEvent<User>>;

    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should push the subscriber to the connection subscribers array', () => {
      expect(mockConnection.subscribers).toContain(userSubscriber);
    });
  });

  describe('listenTo', () => {
    it('should return the User entity', () => {
      const result = userSubscriber.listenTo();
      expect(result).toBe(User);
    });
  });

  describe('hashPassword', () => {
    it('should hash the password with bcrypt using salt rounds of 10', async () => {
      const password = 'testPassword123';
      const hashedPassword = 'hashedPassword123';
      
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await userSubscriber.hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });

    it('should handle bcrypt errors', async () => {
      const password = 'testPassword123';
      const error = new Error('Bcrypt error');
      
      (bcrypt.hash as jest.Mock).mockRejectedValue(error);

      await expect(userSubscriber.hashPassword(password)).rejects.toThrow('Bcrypt error');
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it('should handle empty password', async () => {
      const password = '';
      const hashedPassword = 'hashedEmptyPassword';
      
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await userSubscriber.hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('beforeInsert', () => {
    it('should hash the password before inserting a user', async () => {
      const hashedPassword = 'hashedPassword123';
      
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      await userSubscriber.beforeInsert(mockInsertEvent);

      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword123', 10);
      expect(mockInsertEvent.entity.password).toBe(hashedPassword);
    });

    it('should handle missing password in entity', async () => {
      const eventWithoutPassword = {
        entity: {},
      } as jest.Mocked<InsertEvent<User>>;

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedUndefinedPassword');

      await userSubscriber.beforeInsert(eventWithoutPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith(undefined, 10);
      expect(eventWithoutPassword.entity.password).toBe('hashedUndefinedPassword');
    });

    it('should handle bcrypt errors during beforeInsert', async () => {
      const error = new Error('Bcrypt hashing failed');
      
      (bcrypt.hash as jest.Mock).mockRejectedValue(error);

      await expect(userSubscriber.beforeInsert(mockInsertEvent)).rejects.toThrow('Bcrypt hashing failed');
      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword123', 10);
    });

    it('should handle null password in entity', async () => {
      const eventWithNullPassword = {
        entity: {
          password: null,
        },
      } as jest.Mocked<InsertEvent<User>>;

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedNullPassword');

      await userSubscriber.beforeInsert(eventWithNullPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith(null, 10);
      expect(eventWithNullPassword.entity.password).toBe('hashedNullPassword');
    });
  });
});