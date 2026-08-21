typescript
import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserSubscriber } from './user.subscriber';
import { User } from '../entities/user.entity';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

jest.mock('../entities/user.entity', () => ({
  User: class User {},
}));

describe('UserSubscriber', () => {
  let subscriber: UserSubscriber;
  let mockConnection: { subscribers: any[] };
  let pushSpy: jest.SpyInstance;

  beforeEach(async () => {
    mockConnection = {
      subscribers: [],
    };

    pushSpy = jest.spyOn(mockConnection.subscribers, 'push');

    const moduleRef = await Test.createTestingModule({
      providers: [
        UserSubscriber,
        { provide: Connection, useValue: mockConnection },
      ],
    }).compile();

    subscriber = moduleRef.get(UserSubscriber);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(subscriber).toBeDefined();
  });

  describe('constructor', () => {
    it('should push itself to connection.subscribers', () => {
      expect(pushSpy).toHaveBeenCalledWith(subscriber);
    });
  });

  describe('listenTo', () => {
    it('should return User entity', () => {
      expect(subscriber.listenTo()).toBe(User);
    });
  });

  describe('hashPassword', () => {
    it('should call bcrypt.hash with the password and salt rounds 10', async () => {
      const password = 'plainPassword';
      const hashedPassword = 'hashedPassword';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await subscriber.hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });

    it('should handle an empty password', async () => {
      const hashedPassword = 'hashedEmpty';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await subscriber.hashPassword('');

      expect(bcrypt.hash).toHaveBeenCalledWith('', 10);
      expect(result).toBe(hashedPassword);
    });

    it('should propagate errors from bcrypt.hash', async () => {
      const error = new Error('hash error');

      (bcrypt.hash as jest.Mock).mockRejectedValue(error);

      await expect(subscriber.hashPassword('password')).rejects.toThrow('hash error');
    });
  });

  describe('beforeInsert', () => {
    it('should hash the entity password and assign it to the entity', async () => {
      const entity = { password: 'plainPassword' } as any;
      const hashedPassword = 'hashedPassword';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const event = { entity } as any;

      await subscriber.beforeInsert(event);

      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 10);
      expect(entity.password).toBe(hashedPassword);
    });

    it('should call hashPassword even when password is undefined', async () => {
      const entity = { password: undefined } as any;
      const hashedPassword = 'hashedUndefined';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const event = { entity } as any;

      await subscriber.beforeInsert(event);

      expect(bcrypt.hash).toHaveBeenCalledWith(undefined, 10);
      expect(entity.password).toBe(hashedPassword);
    });

    it('should propagate errors from hashing', async () => {
      const entity = { password: 'plainPassword' } as any;
      const error = new Error('hash error');

      (bcrypt.hash as jest.Mock).mockRejectedValue(error);

      const event = { entity } as any;

      await expect(subscriber.beforeInsert(event)).rejects.toThrow('hash error');
      expect(entity.password).toBe('plainPassword');
    });
  });
});