import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { UserSubscriber } from '../../src/Users/subscribers/user.subscriber';
import { User } from '../../src/Users/entities/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserSubscriber', () => {
  let userSubscriber: UserSubscriber;
  let mockConnection: jest.Mocked<Connection>;
  let mockInsertEvent: jest.Mocked<InsertEvent<User>>;
  let mockUpdateEvent: jest.Mocked<UpdateEvent<User>>;
  let mockRemoveEvent: jest.Mocked<RemoveEvent<User>>;

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
        id: 1,
        email: 'test@example.com',
        password: 'plainPassword',
      },
    } as unknown as jest.Mocked<InsertEvent<User>>;

    mockUpdateEvent = {
      entity: {
        id: 1,
        email: 'test@example.com',
        password: 'updatedPassword',
      },
    } as unknown as jest.Mocked<UpdateEvent<User>>;

    mockRemoveEvent = {
      entity: {
        id: 1,
        email: 'test@example.com',
        password: 'passwordToRemove',
      },
    } as unknown as jest.Mocked<RemoveEvent<User>>;

    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should push the subscriber to the connection subscribers array', () => {
      expect(mockConnection.subscribers).toContain(userSubscriber);
    });
  });

  describe('listenTo', () => {
    it('should return the User entity', () => {
      expect(userSubscriber.listenTo()).toBe(User);
    });
  });

  describe('beforeInsert', () => {
    it('should hash the password before insertion', async () => {
      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      await userSubscriber.beforeInsert(mockInsertEvent);

      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 10);
      expect(mockInsertEvent.entity.password).toBe(hashedPassword);
    });

    it('should handle empty password', async () => {
      const hashedPassword = 'hashedEmptyPassword';
      mockInsertEvent.entity.password = '';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      await userSubscriber.beforeInsert(mockInsertEvent);

      expect(bcrypt.hash).toHaveBeenCalledWith('', 10);
      expect(mockInsertEvent.entity.password).toBe(hashedPassword);
    });

    it('should handle null password', async () => {
      const hashedPassword = 'hashedNullPassword';
      mockInsertEvent.entity.password = null as unknown as string;
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      await userSubscriber.beforeInsert(mockInsertEvent);

      expect(bcrypt.hash).toHaveBeenCalledWith(null, 10);
      expect(mockInsertEvent.entity.password).toBe(hashedPassword);
    });

    it('should propagate bcrypt errors', async () => {
      const error = new Error('Bcrypt hashing failed');
      (bcrypt.hash as jest.Mock).mockRejectedValue(error);

      await expect(userSubscriber.beforeInsert(mockInsertEvent)).rejects.toThrow(error);
    });
  });

  describe('hashPassword', () => {
    it('should hash a password with salt rounds of 10', async () => {
      const password = 'testPassword';
      const hashedPassword = 'hashedTestPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await userSubscriber.hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });

    it('should handle empty password', async () => {
      const hashedPassword = 'hashedEmpty';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await userSubscriber.hashPassword('');

      expect(bcrypt.hash).toHaveBeenCalledWith('', 10);
      expect(result).toBe(hashedPassword);
    });

    it('should handle special characters in password', async () => {
      const password = 'P@ssw0rd!$#%';
      const hashedPassword = 'hashedSpecial';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await userSubscriber.hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });

    it('should propagate bcrypt errors', async () => {
      const error = new Error('Hashing failed');
      (bcrypt.hash as jest.Mock).mockRejectedValue(error);

      await expect(userSubscriber.hashPassword('test')).rejects.toThrow(error);
    });
  });

  describe('edge cases', () => {
    it('should handle beforeInsert with undefined entity', async () => {
      mockInsertEvent.entity = undefined as unknown as User;

      await expect(userSubscriber.beforeInsert(mockInsertEvent)).rejects.toThrow();
    });

    it('should handle beforeInsert with null entity', async () => {
      mockInsertEvent.entity = null as unknown as User;

      await expect(userSubscriber.beforeInsert(mockInsertEvent)).rejects.toThrow();
    });

    it('should handle hashPassword with undefined password', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedUndefined');

      const result = await userSubscriber.hashPassword(undefined as unknown as string);

      expect(bcrypt.hash).toHaveBeenCalledWith(undefined, 10);
      expect(result).toBe('hashedUndefined');
    });

    it('should handle hashPassword with null password', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedNull');

      const result = await userSubscriber.hashPassword(null as unknown as string);

      expect(bcrypt.hash).toHaveBeenCalledWith(null, 10);
      expect(result).toBe('hashedNull');
    });
  });
});