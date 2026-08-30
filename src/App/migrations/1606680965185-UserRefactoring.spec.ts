import { Test, TestingModule } from '@nestjs/testing';
import { UserRefactoring1606680965185 } from './1606680965185-UserRefactoring';
import { QueryRunner, Table } from 'typeorm';

describe('UserRefactoring1606680965185', () => {
  let migration: UserRefactoring1606680965185;
  let mockQueryRunner: jest.Mocked<QueryRunner>;

  beforeEach(async () => {
    mockQueryRunner = {
      createTable: jest.fn().mockResolvedValue(undefined),
      dropTable: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<QueryRunner>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRefactoring1606680965185,
        {
          provide: QueryRunner,
          useValue: mockQueryRunner,
        },
      ],
    }).compile();

    migration = module.get<UserRefactoring1606680965185>(UserRefactoring1606680965185);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('up', () => {
    it('should create the users table with correct schema', async () => {
      await migration.up(mockQueryRunner);

      expect(mockQueryRunner.createTable).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.createTable).toHaveBeenCalledWith(
        expect.any(Table),
        true
      );

      const tableArg = mockQueryRunner.createTable.mock.calls[0][0] as Table;
      expect(tableArg.name).toBe('users');
      expect(tableArg.columns).toHaveLength(6);

      // Test id column
      expect(tableArg.columns[0]).toMatchObject({
        name: 'id',
        type: 'int',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment'
      });

      // Test first_name column
      expect(tableArg.columns[1]).toMatchObject({
        name: 'first_name',
        type: 'varchar'
      });

      // Test last_name column
      expect(tableArg.columns[2]).toMatchObject({
        name: 'last_name',
        type: 'varchar'
      });

      // Test email column
      expect(tableArg.columns[3]).toMatchObject({
        name: 'email',
        type: 'varchar'
      });

      // Test password column
      expect(tableArg.columns[4]).toMatchObject({
        name: 'password',
        type: 'varchar'
      });

      // Test status column
      expect(tableArg.columns[5]).toMatchObject({
        name: 'status',
        type: 'enum',
        enum: ['active', 'inactive', 'block'],
        enumName: 'statusEnum',
        default: '"active"'
      });
    });

    it('should create table with ifNotExists flag set to true', async () => {
      await migration.up(mockQueryRunner);

      expect(mockQueryRunner.createTable).toHaveBeenCalledWith(
        expect.any(Table),
        true
      );
    });

    it('should handle errors when creating table fails', async () => {
      const error = new Error('Database connection failed');
      mockQueryRunner.createTable.mockRejectedValueOnce(error);

      await expect(migration.up(mockQueryRunner)).rejects.toThrow(error);
      expect(mockQueryRunner.createTable).toHaveBeenCalledTimes(1);
    });

    it('should handle empty query runner gracefully', async () => {
      const emptyQueryRunner = {} as QueryRunner;
      await expect(migration.up(emptyQueryRunner)).rejects.toThrow();
    });
  });

  describe('down', () => {
    it('should drop the users table', async () => {
      await migration.down(mockQueryRunner);

      expect(mockQueryRunner.dropTable).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.dropTable).toHaveBeenCalledWith('users');
    });

    it('should handle errors when dropping table fails', async () => {
      const error = new Error('Table does not exist');
      mockQueryRunner.dropTable.mockRejectedValueOnce(error);

      await expect(migration.down(mockQueryRunner)).rejects.toThrow(error);
      expect(mockQueryRunner.dropTable).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.dropTable).toHaveBeenCalledWith('users');
    });

    it('should handle empty query runner gracefully', async () => {
      const emptyQueryRunner = {} as QueryRunner;
      await expect(migration.down(emptyQueryRunner)).rejects.toThrow();
    });
  });

  describe('migration integrity', () => {
    it('should have the correct class name', () => {
      expect(migration.constructor.name).toBe('UserRefactoring1606680965185');
    });

    it('should implement MigrationInterface', () => {
      expect(typeof migration.up).toBe('function');
      expect(typeof migration.down).toBe('function');
    });

    it('should return promises from up and down methods', () => {
      const upResult = migration.up(mockQueryRunner);
      const downResult = migration.down(mockQueryRunner);

      expect(upResult).toBeInstanceOf(Promise);
      expect(downResult).toBeInstanceOf(Promise);
    });
  });
});