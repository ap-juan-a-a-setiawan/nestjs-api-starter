typescript
import { Test } from '@nestjs/testing';
import { Table } from 'typeorm';
import type { QueryRunner } from 'typeorm';
import { UserRefactoring1606680965185 } from './1606680965185-UserRefactoring';

jest.mock('typeorm', () => ({
  MigrationInterface: class MigrationInterface {},
  QueryRunner: class QueryRunner {},
  Table: jest.fn().mockImplementation((options: any) => ({ ...options })),
}));

describe('UserRefactoring1606680965185', () => {
  let migration: UserRefactoring1606680965185;
  let queryRunner: { createTable: jest.Mock; dropTable: jest.Mock };
  let tableMock: jest.Mock;

  const expectedTable = {
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
  };

  beforeEach(async () => {
    tableMock = Table as unknown as jest.Mock;
    tableMock.mockClear();

    queryRunner = {
      createTable: jest.fn().mockResolvedValue(undefined),
      dropTable: jest.fn().mockResolvedValue(undefined),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [UserRefactoring1606680965185],
    }).compile();

    migration = moduleRef.get(UserRefactoring1606680965185);
  });

  describe('up', () => {
    it('should create the users table with expected options and pass true for ifNotExists', async () => {
      await migration.up(queryRunner as unknown as QueryRunner);

      expect(tableMock).toHaveBeenCalledTimes(1);
      expect(tableMock).toHaveBeenCalledWith(expectedTable);

      expect(queryRunner.createTable).toHaveBeenCalledTimes(1);
      expect(queryRunner.createTable).toHaveBeenCalledWith(expectedTable, true);
    });

    it('should propagate errors when createTable fails', async () => {
      const error = new Error('createTable failed');
      queryRunner.createTable.mockRejectedValueOnce(error);

      await expect(
        migration.up(queryRunner as unknown as QueryRunner),
      ).rejects.toThrow(error);

      expect(queryRunner.createTable).toHaveBeenCalledTimes(1);
    });
  });

  describe('down', () => {
    it('should drop the users table', async () => {
      await migration.down(queryRunner as unknown as QueryRunner);

      expect(queryRunner.dropTable).toHaveBeenCalledTimes(1);
      expect(queryRunner.dropTable).toHaveBeenCalledWith('users');
    });

    it('should propagate errors when dropTable fails', async () => {
      const error = new Error('dropTable failed');
      queryRunner.dropTable.mockRejectedValueOnce(error);

      await expect(
        migration.down(queryRunner as unknown as QueryRunner),
      ).rejects.toThrow(error);

      expect(queryRunner.dropTable).toHaveBeenCalledTimes(1);
    });
  });
});