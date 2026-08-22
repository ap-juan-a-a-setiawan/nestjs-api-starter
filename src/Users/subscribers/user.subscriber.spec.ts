import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { UserSubscriber } from './user.subscriber';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UserSubscriber', () => {
  let subscriber: UserSubscriber;
  let connectionMock: { subscribers: any[] };
  let bcryptHashMock: jest.Mock;

  beforeEach(async () => {
    connectionMock = { subscribers: [] };
    bcryptHashMock = bcrypt.hash as jest.Mock;

    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: Connection, useValue: connectionMock },
        UserSubscriber,
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

  it('should register itself to connection subscribers', () => {
    expect(connectionMock.subscribers).toContain(subscriber);
  });

  describe('listenTo', () => {
    it('should return User entity', () => {
      expect(subscriber.listenTo()).toBe(User);
    });
  });

  describe('hashPassword', () => {
    it('should hash password with bcrypt using salt rounds 10', async () => {
      bcryptHashMock.mockResolvedValue('hashed_password');

      const result = await subscriber.hashPassword('plain_password');

      expect(bcryptHashMock).toHaveBeenCalledWith('plain_password', 10);
      expect(result).toBe('hashed_password');
    });

    it('should handle empty password', async () => {
      bcryptHashMock.mockResolvedValue('hashed_empty');

      const result = await subscriber.hashPassword('');

      expect(bcryptHashMock).toHaveBeenCalledWith('', 10);
      expect(result).toBe('hashed_empty');
    });

    it('should handle undefined password', async () => {
      bcryptHashMock.mockResolvedValue('hashed_undefined');

      const result = await subscriber.hashPassword(undefined as any);

      expect(bcryptHashMock).toHaveBeenCalledWith(undefined, 10);
      expect(result).toBe('hashed_undefined');
    });
  });

  describe('beforeInsert', () => {
    it('should hash the entity password before insert', async () => {
      bcryptHashMock.mockResolvedValue('hashed_password');
      const event = { entity: { password: 'plain_password' } } as any;

      await subscriber.beforeInsert(event);

      expect(bcryptHashMock).toHaveBeenCalledWith('plain_password', 10);
      expect(event.entity.password).toBe('hashed_password');
    });

    it('should hash empty password before insert', async () => {
      bcryptHashMock.mockResolvedValue('hashed_empty');
      const event = { entity: { password: '' } } as any;

      await subscriber.beforeInsert(event);

      expect(bcryptHashMock).toHaveBeenCalledWith('', 10);
      expect(event.entity.password).toBe('hashed_empty');
    });

    it('should hash undefined password before insert', async () => {
      bcryptHashMock.mockResolvedValue('hashed_undefined');
      const event = { entity: { password: undefined } } as any;

      await subscriber.beforeInsert(event);

      expect(bcryptHashMock).toHaveBeenCalledWith(undefined, 10);
      expect(event.entity.password).toBe('hashed_undefined');
    });
  });
});