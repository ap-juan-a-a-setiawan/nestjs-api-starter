import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BarangRepository } from './barang.repository';
import { Barang } from '../entities/barang.entity';
import { RepositoryBase } from '../../App/abstracts/repository.base';

describe('BarangRepository', () => {
  let repository: BarangRepository;
  let mockRepositoryBase: jest.Mocked<Partial<RepositoryBase<Barang>>>;

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
    mockRepositoryBase = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      createQueryBuilder: jest.fn(),
      count: jest.fn(),
      findAndCount: jest.fn(),
      softDelete: jest.fn(),
      restore: jest.fn(),
      preload: jest.fn(),
      merge: jest.fn(),
      remove: jest.fn(),
      softRemove: jest.fn(),
      increment: jest.fn(),
      decrement: jest.fn(),
      query: jest.fn(),
      clear: jest.fn(),
      insert: jest.fn(),
      upsert: jest.fn(),
      exists: jest.fn(),
      existsBy: jest.fn(),
      findOneBy: jest.fn(),
      findOneOrFail: jest.fn(),
      findOneByOrFail: jest.fn(),
      findBy: jest.fn(),
      findAndCountBy: jest.fn(),
      countBy: jest.fn(),
      sum: jest.fn(),
      average: jest.fn(),
      minimum: jest.fn(),
      maximum: jest.fn(),
      extend: jest.fn(),
      getId: jest.fn(),
      createEntityId: jest.fn(),
      getEntityId: jest.fn(),
      setEntityId: jest.fn(),
      getEntityName: jest.fn(),
      getEntityTarget: jest.fn(),
      getEntityManager: jest.fn(),
      getRepository: jest.fn(),
      getMetadata: jest.fn(),
      getTarget: jest.fn(),
      getConnection: jest.fn(),
      getManager: jest.fn(),
      getTreeRepository: jest.fn(),
      getMongoRepository: jest.fn(),
      getCustomRepository: jest.fn(),
      transaction: jest.fn(),
      findOneWithDeleted: jest.fn(),
      findWithDeleted: jest.fn(),
      findOneByWithDeleted: jest.fn(),
      findByWithDeleted: jest.fn(),
      findAndCountWithDeleted: jest.fn(),
      countWithDeleted: jest.fn(),
      countByWithDeleted: jest.fn(),
      existsWithDeleted: jest.fn(),
      existsByWithDeleted: jest.fn(),
      sumWithDeleted: jest.fn(),
      averageWithDeleted: jest.fn(),
      minimumWithDeleted: jest.fn(),
      maximumWithDeleted: jest.fn(),
      softDeleteBy: jest.fn(),
      restoreBy: jest.fn(),
      softRemoveBy: jest.fn(),
      removeBy: jest.fn(),
      updateBy: jest.fn(),
      saveBy: jest.fn(),
      insertBy: jest.fn(),
      upsertBy: jest.fn(),
      deleteBy: jest.fn(),
      clearBy: jest.fn(),
      queryBy: jest.fn(),
      incrementBy: jest.fn(),
      decrementBy: jest.fn(),
      createQueryBuilderBy: jest.fn(),
      getMany: jest.fn(),
      getOne: jest.fn(),
      getRawMany: jest.fn(),
      getRawOne: jest.fn(),
      getManyAndCount: jest.fn(),
      getOneOrFail: jest.fn(),
      getRawManyAndCount: jest.fn(),
      getRawOneOrFail: jest.fn(),
      getCount: jest.fn(),
      getExists: jest.fn(),
      getExistsBy: jest.fn(),
      getSum: jest.fn(),
      getAverage: jest.fn(),
      getMinimum: jest.fn(),
      getMaximum: jest.fn(),
      getManyWithDeleted: jest.fn(),
      getOneWithDeleted: jest.fn(),
      getRawManyWithDeleted: jest.fn(),
      getRawOneWithDeleted: jest.fn(),
      getManyAndCountWithDeleted: jest.fn(),
      getOneOrFailWithDeleted: jest.fn(),
      getRawManyAndCountWithDeleted: jest.fn(),
      getRawOneOrFailWithDeleted: jest.fn(),
      getCountWithDeleted: jest.fn(),
      getExistsWithDeleted: jest.fn(),
      getExistsByWithDeleted: jest.fn(),
      getSumWithDeleted: jest.fn(),
      getAverageWithDeleted: jest.fn(),
      getMinimumWithDeleted: jest.fn(),
      getMaximumWithDeleted: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BarangRepository,
        {
          provide: RepositoryBase,
          useValue: mockRepositoryBase,
        },
        {
          provide: getRepositoryToken(Barang),
          useValue: mockRepositoryBase,
        },
      ],
    }).compile();

    repository = module.get<BarangRepository>(BarangRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Inheritance and initialization', () => {
    it('should be defined', () => {
      expect(repository).toBeDefined();
    });

    it('should extend RepositoryBase<Barang>', () => {
      expect(repository).toBeInstanceOf(RepositoryBase);
    });

    it('should have the correct entity target', () => {
      expect(repository.target).toBe(Barang);
    });
  });

  describe('Inherited methods from RepositoryBase', () => {
    describe('find', () => {
      it('should call find with no arguments and return all barang', async () => {
        mockRepositoryBase.find.mockResolvedValue(mockBarangList);

        const result = await repository.find();

        expect(mockRepositoryBase.find).toHaveBeenCalled();
        expect(mockRepositoryBase.find).toHaveBeenCalledWith();
        expect(result).toEqual(mockBarangList);
      });

      it('should call find with options and return filtered barang', async () => {
        const options = { where: { nama: 'Test Barang' } };
        mockRepositoryBase.find.mockResolvedValue([mockBarang]);

        const result = await repository.find(options);

        expect(mockRepositoryBase.find).toHaveBeenCalledWith(options);
        expect(result).toEqual([mockBarang]);
      });

      it('should return empty array when no barang found', async () => {
        mockRepositoryBase.find.mockResolvedValue([]);

        const result = await repository.find();

        expect(result).toEqual([]);
      });

      it('should throw error when find fails', async () => {
        const error = new Error('Database error');
        mockRepositoryBase.find.mockRejectedValue(error);

        await expect(repository.find()).rejects.toThrow('Database error');
      });
    });

    describe('findOne', () => {
      it('should call findOne with id and return a single barang', async () => {
        mockRepositoryBase.findOne.mockResolvedValue(mockBarang);

        const result = await repository.findOne(1);

        expect(mockRepositoryBase.findOne).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockBarang);
      });

      it('should call findOne with options and return a single barang', async () => {
        const options = { where: { nama: 'Test Barang' } };
        mockRepositoryBase.findOne.mockResolvedValue(mockBarang);

        const result = await repository.findOne(options);

        expect(mockRepositoryBase.findOne).toHaveBeenCalledWith(options);
        expect(result).toEqual(mockBarang);
      });

      it('should return null when barang not found', async () => {
        mockRepositoryBase.findOne.mockResolvedValue(null);

        const result = await repository.findOne(999);

        expect(result).toBeNull();
      });

      it('should throw error when findOne fails', async () => {
        const error = new Error('Database error');
        mockRepositoryBase.findOne.mockRejectedValue(error);

        await expect(repository.findOne(1)).rejects.toThrow('Database error');
      });
    });

    describe('save', () => {
      it('should call save with entity and return saved barang', async () => {
        mockRepositoryBase.save.mockResolvedValue(mockBarang);

        const result = await repository.save(mockBarang);

        expect(mockRepositoryBase.save).toHaveBeenCalledWith(mockBarang);
        expect(result).toEqual(mockBarang);
      });

      it('should call save with array of entities and return saved barang array', async () => {
        mockRepositoryBase.save.mockResolvedValue(mockBarangList);

        const result = await repository.save(mockBarangList);

        expect(mockRepositoryBase.save).toHaveBeenCalledWith(mockBarangList);
        expect(result).toEqual(mockBarangList);
      });

      it('should throw error when save fails', async () => {
        const error = new Error('Database error');
        mockRepositoryBase.save.mockRejectedValue(error);

        await expect(repository.save(mockBarang)).rejects.toThrow('Database error');
      });
    });

    describe('update', () => {
      it('should call update with criteria and partial entity', async () => {
        const criteria = 1;
        const partialEntity = { nama: 'Updated Barang' };
        const updateResult = { affected: 1, raw: {}, generatedMaps: [] };
        mockRepositoryBase.update.mockResolvedValue(updateResult);

        const result = await repository.update(criteria, partialEntity);

        expect(mockRepositoryBase.update).toHaveBeenCalledWith(criteria, partialEntity);
        expect(result).toEqual(updateResult);
      });

      it('should throw error when update fails', async () => {
        const error = new Error('Database error');
        mockRepositoryBase.update.mockRejectedValue(error);

        await expect(repository.update(1, { nama: 'Updated' })).rejects.toThrow('Database error');
      });
    });

    describe('delete', () => {
      it('should call delete with criteria', async () => {
        const deleteResult = { affected: 1, raw: {} };
        mockRepositoryBase.delete.mockResolvedValue(deleteResult);

        const result = await repository.delete(1);

        expect(mockRepositoryBase.delete).toHaveBeenCalledWith(1);
        expect(result).toEqual(deleteResult);
      });

      it('should throw error when delete fails', async () => {
        const error = new Error('Database error');
        mockRepositoryBase.delete.mockRejectedValue(error);

        await expect(repository.delete(1)).rejects.toThrow('Database error');
      });
    });

    describe('create', () => {
      it('should call create with entity and return created entity', () => {
        mockRepositoryBase.create.mockReturnValue(mockBarang);

        const result = repository.create(mockBarang);

        expect(mockRepositoryBase.create).toHaveBeenCalledWith(mockBarang);
        expect(result).toEqual(mockBarang);
      });

      it('should call create with no arguments and return empty entity', () => {
        const emptyEntity = {} as Barang;
        mockRepositoryBase.create.mockReturnValue(emptyEntity);

        const result = repository.create();

        expect(mockRepositoryBase.create).toHaveBeenCalledWith();
        expect(result).toEqual(emptyEntity);
      });
    });

    describe('count', () => {
      it('should call count and return number of barang', async () => {
        mockRepositoryBase.count.mockResolvedValue(2);

        const result = await repository.count();

        expect(mockRepositoryBase.count).toHaveBeenCalled();
        expect(result).toBe(2);
      });

      it('should call count with options and return filtered count', async () => {
        const options = { where: { stok: 10 } };
        mockRepositoryBase.count.mockResolvedValue(1);

        const result = await repository.count(options);

        expect(mockRepositoryBase.count).toHaveBeenCalledWith(options);
        expect(result).toBe(1);
      });

      it('should return 0 when no barang found', async () => {
        mockRepositoryBase.count.mockResolvedValue(0);

        const result = await repository.count();

        expect(result).toBe(0);
      });
    });

    describe('findAndCount', () => {
      it('should call findAndCount and return barang list with count', async () => {
        const result = [mockBarangList, 2];
        mockRepositoryBase.findAndCount.mockResolvedValue(result);

        const [items, count] = await repository.findAndCount();

        expect(mockRepositoryBase.findAndCount).toHaveBeenCalled();
        expect(items).toEqual(mockBarangList);
        expect(count).toBe(2);
      });

      it('should call findAndCount with options', async () => {
        const options = { skip: 0, take: 10 };
        const result = [mockBarangList, 2];
        mockRepositoryBase.findAndCount.mockResolvedValue(result);

        const [items, count] = await repository.findAndCount(options);

        expect(mockRepositoryBase.findAndCount).toHaveBeenCalledWith(options);
        expect(items).toEqual(mockBarangList);
        expect(count).toBe(2);
      });
    });

    describe('softDelete', () => {
      it('should call softDelete with criteria', async () => {
        const deleteResult = { affected: 1, raw: {} };
        mockRepositoryBase.softDelete.mockResolvedValue(deleteResult);

        const result = await repository.softDelete(1);

        expect(mockRepositoryBase.softDelete).toHaveBeenCalledWith(1);
        expect(result).toEqual(deleteResult);
      });

      it('should throw error when softDelete fails', async () => {
        const error = new Error('Database error');
        mockRepositoryBase.softDelete.mockRejectedValue(error);

        await expect(repository.softDelete(1)).rejects.toThrow('Database error');
      });
    });

    describe('restore', () => {
      it('should call restore with criteria', async () => {
        const restoreResult = { affected: 1, raw: {} };
        mockRepositoryBase.restore.mockResolvedValue(restoreResult);

        const result = await repository.restore(1);

        expect(mockRepositoryBase.restore).toHaveBeenCalledWith(1);
        expect(result).toEqual(restoreResult);
      });

      it('should throw error when restore fails', async () => {
        const error = new Error('Database error');
        mockRepositoryBase.restore.mockRejectedValue(error);

        await expect(repository.restore(1)).rejects.toThrow('Database error');
      });
    });

    describe('preload', () => {
      it('should call preload with partial entity and return merged entity', async () => {
        const partialEntity = { id: 1, nama: 'Updated' };
        const mergedEntity = { ...mockBarang, ...partialEntity };
        mockRepositoryBase.preload.mockResolvedValue(mergedEntity);

        const result = await repository.preload(partialEntity);

        expect(mockRepositoryBase.preload).toHaveBeenCalledWith(partialEntity);
        expect(result).toEqual(mergedEntity);
      });

      it('should return null when entity not found', async () => {
        mockRepositoryBase.preload.mockResolvedValue(null);

        const result = await repository.preload({ id: 999 });

        expect(result).toBeNull();
      });
    });

    describe('merge', () => {
      it('should call merge with entities and return merged entity', () => {
        const mergeEntity = { ...mockBarang, nama: 'Merged' };
        mockRepositoryBase.merge.mockReturnValue(mergeEntity);

        const result = repository.merge(mockBarang, { nama: 'Merged' });

        expect(mockRepositoryBase.merge).toHaveBeenCalledWith(mockBarang, { nama: 'Merged' });
        expect(result).toEqual(mergeEntity);
      });
    });

    describe('remove', () => {
      it('should call remove with entity', async () => {
        mockRepositoryBase.remove.mockResolvedValue(mockBarang);

        const result = await repository.remove(mockBarang);

        expect(mockRepositoryBase.remove).toHaveBeenCalledWith(mockBarang);
        expect(result).toEqual(mockBarang);
      });

      it('should throw error when remove fails', async () => {
        const error = new Error('Database error');
        mockRepositoryBase.remove.mockRejectedValue(error);

        await expect(repository.remove(mockBarang)).rejects.toThrow('Database error');
      });
    });

    describe('softRemove', () => {
      it('should call softRemove with entity', async () => {
        mockRepositoryBase.softRemove.mockResolvedValue(mockBarang);

        const result = await repository.softRemove(mockBarang);

        expect(mockRepositoryBase.softRemove).toHaveBeenCalledWith(mockBarang);
        expect(result).toEqual(mockBarang);
      });

      it('should throw error when softRemove fails', async () => {
        const error = new Error('Database error');
        mockRepositoryBase.softRemove.mockRejectedValue(error);

        await expect(repository.softRemove(mockBarang)).rejects.toThrow('Database error');
      });
    });

    describe('increment', () => {
      it('should call increment with criteria, property and value', async () => {
        const incrementResult = { affected: 1, raw: {} };
        mockRepositoryBase.increment.mockResolvedValue(incrementResult);

        const result = await repository.increment({ id: 1 }, 'stok', 5);

        expect(mockRepositoryBase.increment).toHaveBeenCalledWith({ id: 1 }, 'stok', 5);
        expect(result).toEqual(incrementResult);
      });
    });

    describe('decrement', () => {
      it('should call decrement with criteria, property and value', async () => {
        const decrementResult = { affected: 1, raw: {} };
        mockRepositoryBase.decrement.mockResolvedValue(decrementResult);

        const result = await repository.decrement({ id: 1 }, 'stok', 5);

        expect(mockRepositoryBase.decrement).toHaveBeenCalledWith({ id: 1 }, 'stok', 5);
        expect(result).toEqual(decrementResult);
      });
    });

    describe('query', () => {
      it('should call query with SQL string', async () => {
        const queryResult = [{ id: 1 }];
        mockRepositoryBase.query.mockResolvedValue(queryResult);

        const result = await repository.query('SELECT * FROM barang');

        expect(mockRepositoryBase.query).toHaveBeenCalledWith('SELECT * FROM barang');
        expect(result).toEqual(queryResult);
      });
    });

    describe('clear', () => {
      it('should call clear', async () => {
        mockRepositoryBase.clear.mockResolvedValue(undefined);

        await repository.clear();

        expect(mockRepositoryBase.clear).toHaveBeenCalled();
      });
    });

    describe('insert', () => {
      it('should call insert with entity', async () => {
        const insertResult = { identifiers: [{ id: 1 }], generatedMaps: [mockBarang], raw: {} };
        mockRepositoryBase.insert.mockResolvedValue(insertResult);

        const result = await repository.insert(mockBarang);

        expect(mockRepositoryBase.insert).toHaveBeenCalledWith(mockBarang);
        expect(result).toEqual(insertResult);
      });
    });

    describe('upsert', () => {
      it('should call upsert with entity and conflict paths', async () => {
        const upsertResult = { identifiers: [{ id: 1 }], generatedMaps: [mockBarang], raw: {} };
        mockRepositoryBase.upsert.mockResolvedValue(upsertResult);

        const result = await repository.upsert(mockBarang, ['id']);

        expect(mockRepositoryBase.upsert).toHaveBeenCalledWith(mockBarang, ['id']);
        expect(result).toEqual(upsertResult);
      });
    });

    describe('exists', () => {
      it('should call exists and return boolean', async () => {
        mockRepositoryBase.exists.mockResolvedValue(true);

        const result = await repository.exists();

        expect(mockRepositoryBase.exists).toHaveBeenCalled();
        expect(result).toBe(true);
      });

      it('should return false when entity does not exist', async () => {
        mockRepositoryBase.exists.mockResolvedValue(false);

        const result = await repository.exists();

        expect(result).toBe(false);
      });
    });

    describe('existsBy', () => {
      it('should call existsBy with criteria', async () => {
        mockRepositoryBase.existsBy.mockResolvedValue(true);

        const result = await repository.existsBy({ id: 1 });

        expect(mockRepositoryBase.existsBy).toHaveBeenCalledWith({ id: 1 });
        expect(result).toBe(true);
      });
    });

    describe('findOneBy', () => {
      it('should call findOneBy with criteria', async () => {
        mockRepositoryBase.findOneBy.mockResolvedValue(mockBarang);

        const result = await repository.findOneBy({ id: 1 });

        expect(mockRepositoryBase.findOneBy).toHaveBeenCalledWith({ id: 1 });
        expect(result).toEqual(mockBarang);
      });
    });

    describe('findOneOrFail', () => {
      it('should call findOneOrFail and return entity', async () => {
        mockRepositoryBase.findOneOrFail.mockResolvedValue(mockBarang);

        const result = await repository.findOneOrFail(1);

        expect(mockRepositoryBase.findOneOrFail).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockBarang);
      });

      it('should throw error when entity not found', async () => {
        const error = new Error('Entity not found');
        mockRepositoryBase.findOneOrFail.mockRejectedValue(error);

        await expect(repository.findOneOrFail(999)).rejects.toThrow('Entity not found');
      });
    });

    describe('findOneByOrFail', () => {
      it('should call findOneByOrFail with criteria', async () => {
        mockRepositoryBase.findOneByOrFail.mockResolvedValue(mockBarang);

        const result = await repository.findOneByOrFail({ id: 1 });

        expect(mockRepositoryBase.findOneByOrFail).toHaveBeenCalledWith({ id: 1 });
        expect(result).toEqual(mockBarang);
      });
    });

    describe('findBy', () => {
      it('should call findBy with criteria', async () => {
        mockRepositoryBase.findBy.mockResolvedValue(mockBarangList);

        const result = await repository.findBy({ stok: 10 });

        expect(mockRepositoryBase.findBy).toHaveBeenCalledWith({ stok: 10 });
        expect(result).toEqual(mockBarangList);
      });
    });

    describe('findAndCountBy', () => {
      it('should call findAndCountBy with criteria', async () => {
        const result = [mockBarangList, 2];
        mockRepositoryBase.findAndCountBy.mockResolvedValue(result);

        const [items, count] = await repository.findAndCountBy({ stok: 10 });

        expect(mockRepositoryBase.findAndCountBy).toHaveBeenCalledWith({ stok: 10 });
        expect(items).toEqual(mockBarangList);
        expect(count).toBe(2);
      });
    });

    describe('countBy', () => {
      it('should call countBy with criteria', async () => {
        mockRepositoryBase.countBy.mockResolvedValue(2);

        const result = await repository.countBy({ stok: 10 });

        expect(mockRepositoryBase.countBy).toHaveBeenCalledWith({ stok: 10 });
        expect(result).toBe(2);
      });
    });

    describe('sum', () => {
      it('should call sum with property and criteria', async () => {
        mockRepositoryBase.sum.mockResolvedValue(100);

        const result = await repository.sum('harga', { id: 1 });

        expect(mockRepositoryBase.sum).toHaveBeenCalledWith('harga', { id: 1 });
        expect(result).toBe(100);
      });
    });

    describe('average', () => {
      it('should call average with property and criteria', async () => {
        mockRepositoryBase.average.mockResolvedValue(50);

        const result = await repository.average('harga', { id: 1 });

        expect(mockRepositoryBase.average).toHaveBeenCalledWith('harga', { id: 1 });
        expect(result).toBe(50);
      });
    });

    describe('minimum', () => {
      it('should call minimum with property and criteria', async () => {
        mockRepositoryBase.minimum.mockResolvedValue(10);

        const result = await repository.minimum('harga', { id: 1 });

        expect(mockRepositoryBase.minimum).toHaveBeenCalledWith('harga', { id: 1 });
        expect(result).toBe(10);
      });
    });

    describe('maximum', () => {
      it('should call maximum with property and criteria', async () => {
        mockRepositoryBase.maximum.mockResolvedValue(100);

        const result = await repository.maximum('harga', { id: 1 });

        expect(mockRepositoryBase.maximum).toHaveBeenCalledWith('harga', { id: 1 });
        expect(result).toBe(100);
      });
    });

    describe('createQueryBuilder', () => {
      it('should call createQueryBuilder with alias', () => {
        const queryBuilder = {};
        mockRepositoryBase.createQueryBuilder.mockReturnValue(queryBuilder);

        const result = repository.createQueryBuilder('barang');

        expect(mockRepositoryBase.createQueryBuilder).toHaveBeenCalledWith('barang');
        expect(result).toEqual(queryBuilder);
      });
    });

    describe('transaction', () => {
      it('should call transaction with callback', async () => {
        const transactionResult = 'result';
        mockRepositoryBase.transaction.mockResolvedValue(transactionResult);

        const callback = jest.fn().mockResolvedValue(transactionResult);
        const result = await repository.transaction(callback);

        expect(mockRepositoryBase.transaction).toHaveBeenCalledWith(callback);
        expect(result).toBe(transactionResult);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle null values in findOne', async () => {
      mockRepositoryBase.findOne.mockResolvedValue(null);

      const result = await repository.findOne(null);

      expect(result).toBeNull();
    });

    it('should handle undefined values in find', async () => {
      mockRepositoryBase.find.mockResolvedValue([]);

      const result = await repository.find(undefined);

      expect(result).toEqual([]);
    });

    it('should handle empty array in save', async () => {
      mockRepositoryBase.save.mockResolvedValue([]);

      const result = await repository.save([]);

      expect(result).toEqual([]);
    });

    it('should handle special characters in query', async () => {
      const specialQuery = "SELECT * FROM barang WHERE nama = 'O''Brien'";
      mockRepositoryBase.query.mockResolvedValue([]);

      const result = await repository.query(specialQuery);

      expect(mockRepositoryBase.query).toHaveBeenCalledWith(specialQuery);
      expect(result).toEqual([]);
    });

    it('should handle large numbers in increment/decrement', async () => {
      const largeNumber = Number.MAX_SAFE_INTEGER;
      mockRepositoryBase.increment.mockResolvedValue({ affected: 1, raw: {} });
      mockRepositoryBase.decrement.mockResolvedValue({ affected: 1, raw: {} });

      await repository.increment({ id: 1 }, 'stok', largeNumber);
      await repository.decrement({ id: 1 }, 'stok', largeNumber);

      expect(mockRepositoryBase.increment).toHaveBeenCalledWith({ id: 1 }, 'stok', largeNumber);
      expect(mockRepositoryBase.decrement).toHaveBeenCalledWith({ id: 1 }, 'stok', largeNumber);
    });

    it('should handle negative numbers in increment/decrement', async () => {
      mockRepositoryBase.increment.mockResolvedValue({ affected: 1, raw: {} });
      mockRepositoryBase.decrement.mockResolvedValue({ affected: 1, raw: {} });

      await repository.increment({ id: 1 }, 'stok', -5);
      await repository.decrement({ id: 1 }, 'stok', -5);

      expect(mockRepositoryBase.increment).toHaveBeenCalledWith({ id: 1 }, 'stok', -5);
      expect(mockRepositoryBase.decrement).toHaveBeenCalledWith({ id: 1 }, 'stok', -5);
    });

    it('should handle complex criteria objects', async () => {
      const complexCriteria = {
        where: {
          id: 1,
          nama: 'Test',
          harga: { $gt: 1000 },
        },
        order: { id: 'DESC' },
        take: 10,
        skip: 5,
      };
      mockRepositoryBase.find.mockResolvedValue(mockBarangList);

      const result = await repository.find(complexCriteria);

      expect(mockRepositoryBase.find).toHaveBeenCalledWith(complexCriteria);
      expect(result).toEqual(mockBarangList);
    });

    it('should handle multiple entities in remove', async () => {
      mockRepositoryBase.remove.mockResolvedValue(mockBarangList);

      const result = await repository.remove(mockBarangList);

      expect(mockRepositoryBase.remove).toHaveBeenCalledWith(mockBarangList);
      expect(result).toEqual(mockBarangList);
    });

    it('should handle multiple entities in softRemove', async () => {
      mockRepositoryBase.softRemove.mockResolvedValue(mockBarangList);

      const result = await repository.softRemove(mockBarangList);

      expect(mockRepositoryBase.softRemove).toHaveBeenCalledWith(mockBarangList);
      expect(result).toEqual(mockBarangList);
    });

    it('should handle array of entities in save with options', async () => {
      const options = { chunk: 100 };
      mockRepositoryBase.save.mockResolvedValue(mockBarangList);

      const result = await repository.save(mockBarangList, options);

      expect(mockRepositoryBase.save).toHaveBeenCalledWith(mockBarangList, options);
      expect(result).toEqual(mockBarangList);
    });

    it('should handle upsert with multiple conflict paths', async () => {
      const upsertResult = { identifiers: [{ id: 1 }], generatedMaps: [mockBarang], raw: {} };
      mockRepositoryBase.upsert.mockResolvedValue(upsertResult);

      const result = await repository.upsert(mockBarang, ['id', 'nama']);

      expect(mockRepositoryBase.upsert).toHaveBeenCalledWith(mockBarang, ['id', 'nama']);
      expect(result).toEqual(upsertResult);
    });

    it('should handle update with complex criteria', async () => {
      const criteria = { id: 1, nama: 'Test' };
      const partialEntity = { harga: 15000 };
      const updateResult = { affected: 1, raw: {}, generatedMaps: [] };
      mockRepositoryBase.update.mockResolvedValue(updateResult);

      const result = await repository.update(criteria, partialEntity);

      expect(mockRepositoryBase.update).toHaveBeenCalledWith(criteria, partialEntity);
      expect(result).toEqual(updateResult);
    });

    it('should handle delete with complex criteria', async () => {
      const criteria = { id: 1, nama: 'Test' };
      const deleteResult = { affected: 1, raw: {} };
      mockRepositoryBase.delete.mockResolvedValue(deleteResult);

      const result = await repository.delete(criteria);

      expect(mockRepositoryBase.delete).toHaveBeenCalledWith(criteria);
      expect(result).toEqual(deleteResult);
    });

    it('should handle softDelete with complex criteria', async () => {
      const criteria = { id: 1, nama: 'Test' };
      const deleteResult = { affected: 1, raw: {} };
      mockRepositoryBase.softDelete.mockResolvedValue(deleteResult);

      const result = await repository.softDelete(criteria);

      expect(mockRepositoryBase.softDelete).toHaveBeenCalledWith(criteria);
      expect(result).toEqual(deleteResult);
    });

    it('should handle restore with complex criteria', async () => {
      const criteria = { id: 1, nama: 'Test' };
      const restoreResult = { affected: 1, raw: {} };
      mockRepositoryBase.restore.mockResolvedValue(restoreResult);

      const result = await repository.restore(criteria);

      expect(mockRepositoryBase.restore).toHaveBeenCalledWith(criteria);
      expect(result).toEqual(restoreResult);
    });
  });
});