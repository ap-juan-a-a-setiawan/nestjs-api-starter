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
    it('should create users table with all required columns', async () => {
      await migration.up(mockQueryRunner);

      expect(mockQueryRunner.createTable).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.createTable).toHaveBeenCalledWith(
        expect.any(Table),
        true
      );

      const tableArg = (mockQueryRunner.createTable as jest.Mock).mock.calls[0][0] as Table;
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

    it('should handle createTable errors', async () => {
      const error = new Error('Database connection failed');
      mockQueryRunner.createTable.mockRejectedValueOnce(error);

      await expect(migration.up(mockQueryRunner)).rejects.toThrow(error);
      expect(mockQueryRunner.createTable).toHaveBeenCalledTimes(1);
    });

    it('should pass ifNotExists parameter as true', async () => {
      await migration.up(mockQueryRunner);

      const createTableMock = mockQueryRunner.createTable as jest.Mock;
      expect(createTableMock.mock.calls[0][1]).toBe(true);
    });
  });

  describe('down', () => {
    it('should drop users table', async () => {
      await migration.down(mockQueryRunner);

      expect(mockQueryRunner.dropTable).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.dropTable).toHaveBeenCalledWith('users');
    });

    it('should handle dropTable errors', async () => {
      const error = new Error('Table does not exist');
      mockQueryRunner.dropTable.mockRejectedValueOnce(error);

      await expect(migration.down(mockQueryRunner)).rejects.toThrow(error);
      expect(mockQueryRunner.dropTable).toHaveBeenCalledTimes(1);
    });

    it('should call dropTable with correct table name', async () => {
      await migration.down(mockQueryRunner);

      const dropTableMock = mockQueryRunner.dropTable as jest.Mock;
      expect(dropTableMock.mock.calls[0][0]).toBe('users');
    });
  });

  describe('Migration interface implementation', () => {
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