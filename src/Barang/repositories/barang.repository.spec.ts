import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral, EntityManager, QueryRunner, SelectQueryBuilder } from 'typeorm';
import { BarangRepository } from './barang.repository';
import { Barang } from '../entities/barang.entity';
import { RepositoryBase } from '../../App/abstracts/repository.base';

describe('BarangRepository', () => {
  let repository: BarangRepository;
  let mockRepository: jest.Mocked<Partial<Repository<Barang>>>;
  let mockEntityManager: jest.Mocked<Partial<EntityManager>>;
  let mockQueryRunner: jest.Mocked<Partial<QueryRunner>>;
  let mockQueryBuilder: jest.Mocked<Partial<SelectQueryBuilder<Barang>>>;

  const mockBarang: Barang = {
    id: 1,
    nama: 'Test Barang',
    harga: 10000,
    stok: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBarangList: Barang[] = [
    mockBarang,
    {
      id: 2,
      nama: 'Test Barang 2',
      harga: 20000,
      stok: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockBarangList),
      getOne: jest.fn().mockResolvedValue(mockBarang),
      getRawMany: jest.fn().mockResolvedValue([{ id: 1 }]),
      getRawOne: jest.fn().mockResolvedValue({ id: 1 }),
      getCount: jest.fn().mockResolvedValue(2),
      execute: jest.fn().mockResolvedValue({ affected: 1 }),
      set: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      into: jest.fn().mockReturnThis(),
    } as any;

    mockQueryRunner = {
      connect: jest.fn().mockResolvedValue(undefined),
      startTransaction: jest.fn().mockResolvedValue(undefined),
      commitTransaction: jest.fn().mockResolvedValue(undefined),
      rollbackTransaction: jest.fn().mockResolvedValue(undefined),
      release: jest.fn().mockResolvedValue(undefined),
      manager: {
        save: jest.fn().mockResolvedValue(mockBarang),
        find: jest.fn().mockResolvedValue(mockBarangList),
        findOne: jest.fn().mockResolvedValue(mockBarang),
        delete: jest.fn().mockResolvedValue({ affected: 1 }),
        update: jest.fn().mockResolvedValue({ affected: 1 }),
        insert: jest.fn().mockResolvedValue({ identifiers: [{ id: 1 }] }),
        createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
        count: jest.fn().mockResolvedValue(2),
        increment: jest.fn().mockResolvedValue({ affected: 1 }),
        decrement: jest.fn().mockResolvedValue({ affected: 1 }),
      } as any,
    } as any;

    mockEntityManager = {
      save: jest.fn().mockResolvedValue(mockBarang),
      find: jest.fn().mockResolvedValue(mockBarangList),
      findOne: jest.fn().mockResolvedValue(mockBarang),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      insert: jest.fn().mockResolvedValue({ identifiers: [{ id: 1 }] }),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      count: jest.fn().mockResolvedValue(2),
      increment: jest.fn().mockResolvedValue({ affected: 1 }),
      decrement: jest.fn().mockResolvedValue({ affected: 1 }),
      transaction: jest.fn().mockImplementation(async (cb: any) => {
        return cb(mockEntityManager);
      }),
      queryRunner: mockQueryRunner,
    } as any;

    mockRepository = {
      save: jest.fn().mockResolvedValue(mockBarang),
      find: jest.fn().mockResolvedValue(mockBarangList),
      findOne: jest.fn().mockResolvedValue(mockBarang),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      insert: jest.fn().mockResolvedValue({ identifiers: [{ id: 1 }] }),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      count: jest.fn().mockResolvedValue(2),
      increment: jest.fn().mockResolvedValue({ affected: 1 }),
      decrement: jest.fn().mockResolvedValue({ affected: 1 }),
      manager: mockEntityManager,
      metadata: {
        target: Barang,
        name: 'Barang',
        tableName: 'barang',
        columns: [],
        relations: [],
      } as any,
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BarangRepository,
        {
          provide: getRepositoryToken(Barang),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<BarangRepository>(BarangRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Inheritance', () => {
    it('should be defined', () => {
      expect(repository).toBeDefined();
    });

    it('should extend RepositoryBase<Barang>', () => {
      expect(repository).toBeInstanceOf(RepositoryBase);
    });
  });

  describe('Repository methods', () => {
    describe('save', () => {
      it('should save a single entity', async () => {
        const result = await repository.save(mockBarang);
        expect(mockRepository.save).toHaveBeenCalledWith(mockBarang);
        expect(result).toEqual(mockBarang);
      });

      it('should save multiple entities', async () => {
        mockRepository.save = jest.fn().mockResolvedValue(mockBarangList);
        const result = await repository.save(mockBarangList);
        expect(mockRepository.save).toHaveBeenCalledWith(mockBarangList);
        expect(result).toEqual(mockBarangList);
      });

      it('should handle save errors', async () => {
        const error = new Error('Save failed');
        mockRepository.save = jest.fn().mockRejectedValue(error);
        await expect(repository.save(mockBarang)).rejects.toThrow('Save failed');
      });
    });

    describe('find', () => {
      it('should find all entities', async () => {
        const result = await repository.find();
        expect(mockRepository.find).toHaveBeenCalled();
        expect(result).toEqual(mockBarangList);
      });

      it('should find entities with options', async () => {
        const options = { where: { nama: 'Test' } };
        const result = await repository.find(options);
        expect(mockRepository.find).toHaveBeenCalledWith(options);
        expect(result).toEqual(mockBarangList);
      });

      it('should handle find errors', async () => {
        const error = new Error('Find failed');
        mockRepository.find = jest.fn().mockRejectedValue(error);
        await expect(repository.find()).rejects.toThrow('Find failed');
      });
    });

    describe('findOne', () => {
      it('should find one entity by id', async () => {
        const result = await repository.findOne(1);
        expect(mockRepository.findOne).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockBarang);
      });

      it('should find one entity with options', async () => {
        const options = { where: { nama: 'Test' } };
        const result = await repository.findOne(options);
        expect(mockRepository.findOne).toHaveBeenCalledWith(options);
        expect(result).toEqual(mockBarang);
      });

      it('should return null when entity not found', async () => {
        mockRepository.findOne = jest.fn().mockResolvedValue(null);
        const result = await repository.findOne(999);
        expect(result).toBeNull();
      });

      it('should handle findOne errors', async () => {
        const error = new Error('FindOne failed');
        mockRepository.findOne = jest.fn().mockRejectedValue(error);
        await expect(repository.findOne(1)).rejects.toThrow('FindOne failed');
      });
    });

    describe('delete', () => {
      it('should delete an entity by id', async () => {
        const result = await repository.delete(1);
        expect(mockRepository.delete).toHaveBeenCalledWith(1);
        expect(result).toEqual({ affected: 1 });
      });

      it('should delete multiple entities', async () => {
        const criteria = [1, 2, 3];
        const result = await repository.delete(criteria);
        expect(mockRepository.delete).toHaveBeenCalledWith(criteria);
        expect(result).toEqual({ affected: 1 });
      });

      it('should handle delete errors', async () => {
        const error = new Error('Delete failed');
        mockRepository.delete = jest.fn().mockRejectedValue(error);
        await expect(repository.delete(1)).rejects.toThrow('Delete failed');
      });
    });

    describe('update', () => {
      it('should update an entity', async () => {
        const criteria = 1;
        const partialEntity = { nama: 'Updated' };
        const result = await repository.update(criteria, partialEntity);
        expect(mockRepository.update).toHaveBeenCalledWith(criteria, partialEntity);
        expect(result).toEqual({ affected: 1 });
      });

      it('should handle update errors', async () => {
        const error = new Error('Update failed');
        mockRepository.update = jest.fn().mockRejectedValue(error);
        await expect(repository.update(1, { nama: 'Test' })).rejects.toThrow('Update failed');
      });
    });

    describe('insert', () => {
      it('should insert an entity', async () => {
        const result = await repository.insert(mockBarang);
        expect(mockRepository.insert).toHaveBeenCalledWith(mockBarang);
        expect(result).toEqual({ identifiers: [{ id: 1 }] });
      });

      it('should insert multiple entities', async () => {
        const result = await repository.insert(mockBarangList);
        expect(mockRepository.insert).toHaveBeenCalledWith(mockBarangList);
        expect(result).toEqual({ identifiers: [{ id: 1 }] });
      });

      it('should handle insert errors', async () => {
        const error = new Error('Insert failed');
        mockRepository.insert = jest.fn().mockRejectedValue(error);
        await expect(repository.insert(mockBarang)).rejects.toThrow('Insert failed');
      });
    });

    describe('count', () => {
      it('should count all entities', async () => {
        const result = await repository.count();
        expect(mockRepository.count).toHaveBeenCalled();
        expect(result).toBe(2);
      });

      it('should count entities with options', async () => {
        const options = { where: { nama: 'Test' } };
        const result = await repository.count(options);
        expect(mockRepository.count).toHaveBeenCalledWith(options);
        expect(result).toBe(2);
      });

      it('should handle count errors', async () => {
        const error = new Error('Count failed');
        mockRepository.count = jest.fn().mockRejectedValue(error);
        await expect(repository.count()).rejects.toThrow('Count failed');
      });
    });

    describe('increment', () => {
      it('should increment a column', async () => {
        const result = await repository.increment({ id: 1 }, 'stok', 5);
        expect(mockRepository.increment).toHaveBeenCalledWith({ id: 1 }, 'stok', 5);
        expect(result).toEqual({ affected: 1 });
      });

      it('should handle increment errors', async () => {
        const error = new Error('Increment failed');
        mockRepository.increment = jest.fn().mockRejectedValue(error);
        await expect(repository.increment({ id: 1 }, 'stok', 5)).rejects.toThrow('Increment failed');
      });
    });

    describe('decrement', () => {
      it('should decrement a column', async () => {
        const result = await repository.decrement({ id: 1 }, 'stok', 5);
        expect(mockRepository.decrement).toHaveBeenCalledWith({ id: 1 }, 'stok', 5);
        expect(result).toEqual({ affected: 1 });
      });

      it('should handle decrement errors', async () => {
        const error = new Error('Decrement failed');
        mockRepository.decrement = jest.fn().mockRejectedValue(error);
        await expect(repository.decrement({ id: 1 }, 'stok', 5)).rejects.toThrow('Decrement failed');
      });
    });

    describe('createQueryBuilder', () => {
      it('should create a query builder', () => {
        const result = repository.createQueryBuilder('barang');
        expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('barang');
        expect(result).toBe(mockQueryBuilder);
      });

      it('should create a query builder without alias', () => {
        const result = repository.createQueryBuilder();
        expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith();
        expect(result).toBe(mockQueryBuilder);
      });
    });

    describe('manager', () => {
      it('should return the entity manager', () => {
        expect(repository.manager).toBe(mockEntityManager);
      });
    });

    describe('metadata', () => {
      it('should return the entity metadata', () => {
        expect(repository.metadata).toBeDefined();
        expect(repository.metadata.target).toBe(Barang);
        expect(repository.metadata.name).toBe('Barang');
        expect(repository.metadata.tableName).toBe('barang');
      });
    });
  });

  describe('Transaction methods', () => {
    describe('transaction', () => {
      it('should execute a transaction', async () => {
        const callback = jest.fn().mockResolvedValue('result');
        const result = await repository.transaction(callback);
        expect(mockEntityManager.transaction).toHaveBeenCalled();
        expect(result).toBe('result');
      });

      it('should handle transaction errors', async () => {
        const error = new Error('Transaction failed');
        mockEntityManager.transaction = jest.fn().mockRejectedValue(error);
        await expect(repository.transaction(jest.fn())).rejects.toThrow('Transaction failed');
      });
    });

    describe('queryRunner', () => {
      it('should return the query runner', () => {
        expect(repository.queryRunner).toBe(mockQueryRunner);
      });
    });
  });

  describe('Query builder methods', () => {
    it('should execute query builder operations', async () => {
      const qb = repository.createQueryBuilder('barang');
      
      const result = await qb.where('barang.id = :id', { id: 1 })
        .andWhere('barang.stok > :stok', { stok: 0 })
        .orderBy('barang.createdAt', 'DESC')
        .skip(0)
        .take(10)
        .getMany();

      expect(mockQueryBuilder.where).toHaveBeenCalledWith('barang.id = :id', { id: 1 });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('barang.stok > :stok', { stok: 0 });
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('barang.createdAt', 'DESC');
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(result).toEqual(mockBarangList);
    });

    it('should handle query builder errors', async () => {
      const error = new Error('Query failed');
      mockQueryBuilder.getMany = jest.fn().mockRejectedValue(error);
      const qb = repository.createQueryBuilder('barang');
      await expect(qb.getMany()).rejects.toThrow('Query failed');
    });
  });
});