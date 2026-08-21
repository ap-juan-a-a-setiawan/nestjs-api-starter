import { Test } from '@nestjs/testing';
import { UserRefactoring1606680965185 } from './1606680965185-UserRefactoring';
import { QueryRunner, Table } from 'typeorm';

describe('UserRefactoring1606680965185', () => {
  let migration: UserRefactoring1606680965185;
  let mockQueryRunner: {
    createTable: jest.Mock;
    dropTable: jest.Mock;
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UserRefactoring1606680965185],
    }).compile();

    migration = moduleRef.get(UserRefactoring1606680965185);

    mockQueryRunner = {
      createTable: jest.fn().mockResolvedValue(undefined),
      dropTable: jest.fn().mockResolvedValue(undefined),
    };
  });

  it('should be defined', () => {
    expect(migration).toBeDefined();
  });

  describe('up', () => {
    it('should create the users table with the expected schema', async () => {
      await migration.up(mockQueryRunner as unknown as QueryRunner);

      expect(mockQueryRunner.createTable).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.createTable).toHaveBeenCalledWith(
        expect.any(Table),
        true,
      );

      const table = mockQueryRunner.createTable.mock.calls[0][0] as Table;
      expect(table.name).toBe('users');
      expect(table.columns).toHaveLength(6);

      expect(table.columns[0]).toMatchObject({
        name: 'id',
        type: 'int',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      });
      expect(table.columns[1]).toMatchObject({
        name: 'first_name',
        type: 'varchar',
      });
      expect(table.columns[2]).toMatchObject({
        name: 'last_name',
        type: 'varchar',
      });
      expect(table.columns[3]).toMatchObject({
        name: 'email',
        type: 'varchar',
      });
      expect(table.columns[4]).toMatchObject({
        name: 'password',
        type: 'varchar',
      });
      expect(table.columns[5]).toMatchObject({
        name: 'status',
        type: 'enum',
        enum: ['active', 'inactive', 'block'],
        enumName: 'statusEnum',
        default: '"active"',
      });
    });

    it('should include the ifNotExist flag as true', async () => {
      await migration.up(mockQueryRunner as unknown as QueryRunner);

      expect(mockQueryRunner.createTable).toHaveBeenCalledWith(
        expect.any(Table),
        true,
      );
    });

    it('should return a Promise', () => {
      const result = migration.up(mockQueryRunner as unknown as QueryRunner);
      expect(result).toBeInstanceOf(Promise);
    });

    it('should propagate errors from queryRunner.createTable', async () => {
      const error = new Error('createTable failed');
      mockQueryRunner.createTable.mockRejectedValueOnce(error);

      await expect(
        migration.up(mockQueryRunner as unknown as QueryRunner),
      ).rejects.toThrow('createTable failed');
    });
  });

  describe('down', () => {
    it('should drop the users table', async () => {
      await migration.down(mockQueryRunner as unknown as QueryRunner);

      expect(mockQueryRunner.dropTable).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.dropTable).toHaveBeenCalledWith('users');
    });

    it('should return a Promise', () => {
      const result = migration.down(mockQueryRunner as unknown as QueryRunner);
      expect(result).toBeInstanceOf(Promise);
    });

    it('should propagate errors from queryRunner.dropTable', async () => {
      const error = new Error('dropTable failed');
      mockQueryRunner.dropTable.mockRejectedValueOnce(error);

      await expect(
        migration.down(mockQueryRunner as unknown as QueryRunner),
      ).rejects.toThrow('dropTable failed');
    });
  });
});