import { Test } from '@nestjs/testing';
import { Connection, InsertEvent } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserSubscriber } from './user.subscriber';
import { User } from '../entities/user.entity';

describe('UserSubscriber', () => {
  let subscriber: UserSubscriber;
  let mockConnection: { subscribers: any[] };
  let pushMock: jest.Mock;

  beforeEach(async () => {
    pushMock = jest.fn();
    const subscribers: any[] = [];
    subscribers.push = pushMock as any;
    mockConnection = { subscribers } as any;

    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: Connection, useValue: mockConnection },
        {
          provide: UserSubscriber,
          useFactory: (connection: Connection) => new UserSubscriber(connection),
          inject: [Connection],
        },
      ],
    }).compile();

    subscriber = moduleRef.get(UserSubscriber);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(subscriber).toBeDefined();
  });

  describe('constructor', () => {
    it('should register itself as a subscriber in the connection', () => {
      expect(pushMock).toHaveBeenCalledWith(subscriber);
    });
  });

  describe('listenTo', () => {
    it('should return the User entity', () => {
      expect(subscriber.listenTo()).toBe(User);
    });
  });

  describe('hashPassword', () => {
    it('should hash the password using bcrypt with 10 salt rounds', async () => {
      const password = 'plain-password';
      const hashedPassword = 'hashed-password';

      const bcryptHashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);

      await expect(subscriber.hashPassword(password)).resolves.toBe(hashedPassword);
      expect(bcryptHashSpy).toHaveBeenCalledWith(password, 10);
    });

    it('should propagate an error when bcrypt.hash fails', async () => {
      const error = new Error('bcrypt failure');
      jest.spyOn(bcrypt, 'hash').mockRejectedValue(error);

      await expect(subscriber.hashPassword('password')).rejects.toThrow(error);
    });
  });

  describe('beforeInsert', () => {
    it('should hash the entity password and update it', async () => {
      const entity = { password: 'plain' } as User;
      const event = { entity } as InsertEvent<User>;

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-value' as never);

      await subscriber.beforeInsert(event);

      expect(entity.password).toBe('hashed-value');
      expect(bcrypt.hash).toHaveBeenCalledWith('plain', 10);
    });

    it('should handle an empty password', async () => {
      const entity = { password: '' } as User;
      const event = { entity } as InsertEvent<User>;

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('' as never);

      await subscriber.beforeInsert(event);

      expect(entity.password).toBe('');
      expect(bcrypt.hash).toHaveBeenCalledWith('', 10);
    });

    it('should propagate an error when hashing fails', async () => {
      const entity = { password: 'plain' } as User;
      const event = { entity } as InsertEvent<User>;
      const error = new Error('hashing failed');

      jest.spyOn(bcrypt, 'hash').mockRejectedValue(error);

      await expect(subscriber.beforeInsert(event)).rejects.toThrow(error);
    });
  });
});