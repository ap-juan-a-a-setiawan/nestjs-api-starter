import { Test } from '@nestjs/testing';
import { UserRefactoring1606680965185 } from './1606680965185-UserRefactoring';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

describe('UserRefactoring1606680965185', () => {
  let migration: UserRefactoring1606680965185;
  let mockQueryRunner: jest.Mocked<QueryRunner>;

  beforeEach(async () => {
    mockQueryRunner = {
      createTable: jest.fn().mockResolvedValue(undefined),
      dropTable: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<QueryRunner>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        UserRefactoring1606680965185,
        {
          provide: QueryRunner,
          useValue: mockQueryRunner,
        },
      ],
    }).compile();

    migration = moduleRef.get<UserRefactoring1606680965185>(UserRefactoring1606680965185);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('up', () => {
    it('should create users table with correct schema', async () => {
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
      expect(tableArg.columns[0]).toEqual({
        name: 'id',
        type: 'int',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment'
      });

      // Test first_name column
      expect(tableArg.columns[1]).toEqual({
        name: 'first_name',
        type: 'varchar',
      });

      // Test last_name column
      expect(tableArg.columns[2]).toEqual({
        name: 'last_name',
        type: 'varchar',
      });

      // Test email column
      expect(tableArg.columns[3]).toEqual({
        name: 'email',
        type: 'varchar',
      });

      // Test password column
      expect(tableArg.columns[4]).toEqual({
        name: 'password',
        type: 'varchar',
      });

      // Test status column
      expect(tableArg.columns[5]).toEqual({
        name: 'status',
        type: 'enum',
        enum: ['active', 'inactive', 'block'],
        enumName: 'statusEnum',
        default: '"active"'
      });
    });

    it('should create table with ifNotExists set to true', async () => {
      await migration.up(mockQueryRunner);

      expect(mockQueryRunner.createTable).toHaveBeenCalledWith(
        expect.any(Table),
        true
      );
    });

    it('should handle errors when createTable fails', async () => {
      const error = new Error('Database error');
      mockQueryRunner.createTable.mockRejectedValueOnce(error);

      await expect(migration.up(mockQueryRunner)).rejects.toThrow('Database error');
      expect(mockQueryRunner.createTable).toHaveBeenCalledTimes(1);
    });

    it('should handle undefined queryRunner gracefully', async () => {
      await expect(migration.up(undefined as unknown as QueryRunner)).rejects.toThrow();
    });
  });

  describe('down', () => {
    it('should drop users table', async () => {
      await migration.down(mockQueryRunner);

      expect(mockQueryRunner.dropTable).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.dropTable).toHaveBeenCalledWith('users');
    });

    it('should handle errors when dropTable fails', async () => {
      const error = new Error('Drop table error');
      mockQueryRunner.dropTable.mockRejectedValueOnce(error);

      await expect(migration.down(mockQueryRunner)).rejects.toThrow('Drop table error');
      expect(mockQueryRunner.dropTable).toHaveBeenCalledTimes(1);
    });

    it('should handle undefined queryRunner gracefully', async () => {
      await expect(migration.down(undefined as unknown as QueryRunner)).rejects.toThrow();
    });

    it('should not call dropTable if queryRunner is null', async () => {
      await expect(migration.down(null as unknown as QueryRunner)).rejects.toThrow();
      expect(mockQueryRunner.dropTable).not.toHaveBeenCalled();
    });
  });

  describe('class structure', () => {
    it('should implement MigrationInterface', () => {
      expect(migration).toBeDefined();
      expect(typeof migration.up).toBe('function');
      expect(typeof migration.down).toBe('function');
    });

    it('should have correct class name', () => {
      expect(migration.constructor.name).toBe('UserRefactoring1606680965185');
    });
  });
});