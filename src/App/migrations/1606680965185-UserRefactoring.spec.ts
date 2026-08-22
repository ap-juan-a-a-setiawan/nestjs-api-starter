typescript
jest.mock('typeorm', () => ({
  MigrationInterface: class {},
  QueryRunner: class {},
  Table: jest.fn().mockImplementation((options) => options),
}));

import { Test } from '@nestjs/testing';
import { Table } from 'typeorm';
import { UserRefactoring1606680965185 } from './1606680965185-UserRefactoring';

describe('UserRefactoring1606680965185', () => {
  let migration: UserRefactoring1606680965185;
  let queryRunnerMock: { createTable: jest.Mock; dropTable: jest.Mock };

  beforeEach(async () => {
    jest.clearAllMocks();

    queryRunnerMock = {
      createTable: jest.fn().mockResolvedValue(undefined),
      dropTable: jest.fn().mockResolvedValue(undefined),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [UserRefactoring1606680965185],
    }).compile();

    migration = moduleRef.get(UserRefactoring1606680965185);
  });

  describe('up', () => {
    it('should create a users table with the expected schema', async () => {
      await migration.up(queryRunnerMock as any);

      expect(Table).toHaveBeenCalledTimes(1);
      expect(Table).toHaveBeenCalledWith({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'first_name',
            type: 'varchar',
          },
          {
            name: 'last_name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive', 'block'],
            enumName: 'statusEnum',
            default: '"active"',
          },
        ],
      });

      expect(queryRunnerMock.createTable).toHaveBeenCalledTimes(1);
      expect(queryRunnerMock.createTable).toHaveBeenCalledWith(expect.any(Object), true);
    });

    it('should pass true as the second argument to createTable', async () => {
      await migration.up(queryRunnerMock as any);

      expect(queryRunnerMock.createTable).toHaveBeenCalledWith(expect.anything(), true);
    });

    it('should propagate errors from createTable', async () => {
      const error = new Error('create failed');
      queryRunnerMock.createTable.mockRejectedValueOnce(error);

      await expect(migration.up(queryRunnerMock as any)).rejects.toThrow('create failed');
    });
  });

  describe('down', () => {
    it('should drop the users table', async () => {
      await migration.down(queryRunnerMock as any);

      expect(queryRunnerMock.dropTable).toHaveBeenCalledTimes(1);
      expect(queryRunnerMock.dropTable).toHaveBeenCalledWith('users');
    });

    it('should propagate errors from dropTable', async () => {
      const error = new Error('drop failed');
      queryRunnerMock.dropTable.mockRejectedValueOnce(error);

      await expect(migration.down(queryRunnerMock as any)).rejects.toThrow('drop failed');
    });
  });
});