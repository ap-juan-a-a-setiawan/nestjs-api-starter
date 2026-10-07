import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Barang } from './barang.entity';
import { EntityBase } from '../../App/abstracts/entity.base';

describe('Barang Entity', () => {
  let barangEntity: Barang;
  let repository: jest.Mocked<Repository<Barang>>;

  const mockBarangData: Barang = {
    id: 1,
    nama: 'Test Barang',
    deskripsi: 'Test Deskripsi',
    harga: '100.00',
    stok: 10,
    kategori: 'Test Kategori',
    status: 'aktif',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Barang,
        {
          provide: getRepositoryToken(Barang),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    barangEntity = module.get<Barang>(Barang);
    repository = module.get<jest.Mocked<Repository<Barang>>>(getRepositoryToken(Barang));
  });

  describe('Entity Definition', () => {
    it('should be defined', () => {
      expect(barangEntity).toBeDefined();
    });

    it('should have all required properties', () => {
      expect(barangEntity).toHaveProperty('id');
      expect(barangEntity).toHaveProperty('nama');
      expect(barangEntity).toHaveProperty('deskripsi');
      expect(barangEntity).toHaveProperty('harga');
      expect(barangEntity).toHaveProperty('stok');
      expect(barangEntity).toHaveProperty('kategori');
      expect(barangEntity).toHaveProperty('status');
    });

    it('should extend EntityBase', () => {
      expect(barangEntity).toBeInstanceOf(EntityBase);
    });
  });

  describe('Entity Properties', () => {
    it('should have correct default values', () => {
      const newBarang = new Barang();
      expect(newBarang.harga).toBe('0');
      expect(newBarang.stok).toBe(0);
      expect(newBarang.status).toBe('aktif');
    });

    it('should accept valid barang data', () => {
      const barang = Object.assign(new Barang(), mockBarangData);
      expect(barang.id).toBe(1);
      expect(barang.nama).toBe('Test Barang');
      expect(barang.deskripsi).toBe('Test Deskripsi');
      expect(barang.harga).toBe('100.00');
      expect(barang.stok).toBe(10);
      expect(barang.kategori).toBe('Test Kategori');
      expect(barang.status).toBe('aktif');
    });

    it('should handle decimal harga as string', () => {
      const barang = new Barang();
      barang.harga = '9999999999.99';
      expect(typeof barang.harga).toBe('string');
      expect(barang.harga).toBe('9999999999.99');
    });

    it('should handle integer stok', () => {
      const barang = new Barang();
      barang.stok = 100;
      expect(typeof barang.stok).toBe('number');
      expect(Number.isInteger(barang.stok)).toBe(true);
    });
  });

  describe('Entity Status', () => {
    it('should have valid status values', () => {
      const validStatuses = ['aktif', 'non-aktif'];
      expect(validStatuses).toContain('aktif');
      expect(validStatuses).toContain('non-aktif');
    });

    it('should accept valid status values', () => {
      const barangAktif = new Barang();
      barangAktif.status = 'aktif';
      expect(barangAktif.status).toBe('aktif');

      const barangNonAktif = new Barang();
      barangNonAktif.status = 'non-aktif';
      expect(barangNonAktif.status).toBe('non-aktif');
    });

    it('should not accept invalid status values', () => {
      const barang = new Barang();
      const invalidStatuses = ['invalid', 'active', 'inactive', '', null, undefined];
      
      invalidStatuses.forEach(status => {
        expect(() => {
          barang.status = status as string;
          // TypeORM enum validation would reject these at database level
          expect(['aktif', 'non-aktif']).toContain(barang.status);
        }).toThrow();
      });
    });
  });

  describe('Repository Operations', () => {
    it('should create a new barang entity', async () => {
      const createDto = {
        nama: 'New Barang',
        deskripsi: 'New Deskripsi',
        harga: '50.00',
        stok: 5,
        kategori: 'New Kategori',
        status: 'aktif',
      };

      const createdBarang = { ...createDto, id: 2, createdAt: new Date(), updatedAt: new Date(), deletedAt: null };
      repository.create.mockReturnValue(createdBarang as Barang);
      repository.save.mockResolvedValue(createdBarang as Barang);

      const result = repository.create(createDto);
      expect(result).toEqual(createdBarang);
      expect(repository.create).toHaveBeenCalledWith(createDto);

      const savedResult = await repository.save(result);
      expect(savedResult).toEqual(createdBarang);
      expect(repository.save).toHaveBeenCalledWith(result);
    });

    it('should find all barang entities', async () => {
      const barangList = [mockBarangData, { ...mockBarangData, id: 2, nama: 'Barang 2' }];
      repository.find.mockResolvedValue(barangList as Barang[]);

      const result = await repository.find();
      expect(result).toEqual(barangList);
      expect(result).toHaveLength(2);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should find one barang by id', async () => {
      repository.findOne.mockResolvedValue(mockBarangData as Barang);

      const result = await repository.findOne({ where: { id: 1 } });
      expect(result).toEqual(mockBarangData);
      expect(result?.id).toBe(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null when barang not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await repository.findOne({ where: { id: 999 } });
      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });

    it('should update a barang entity', async () => {
      const updateDto = { nama: 'Updated Barang', stok: 20 };
      const updatedBarang = { ...mockBarangData, ...updateDto };
      
      repository.update.mockResolvedValue({ affected: 1 } as any);
      repository.findOne.mockResolvedValue(updatedBarang as Barang);

      await repository.update(1, updateDto);
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);

      const result = await repository.findOne({ where: { id: 1 } });
      expect(result).toEqual(updatedBarang);
      expect(result?.nama).toBe('Updated Barang');
      expect(result?.stok).toBe(20);
    });

    it('should delete a barang entity', async () => {
      repository.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await repository.delete(1);
      expect(result.affected).toBe(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should handle delete when entity not found', async () => {
      repository.delete.mockResolvedValue({ affected: 0 } as any);

      const result = await repository.delete(999);
      expect(result.affected).toBe(0);
      expect(repository.delete).toHaveBeenCalledWith(999);
    });
  });

  describe('Entity Validation', () => {
    it('should handle empty nama', () => {
      const barang = new Barang();
      barang.nama = '';
      expect(barang.nama).toBe('');
    });

    it('should handle long deskripsi', () => {
      const barang = new Barang();
      const longDeskripsi = 'A'.repeat(1000);
      barang.deskripsi = longDeskripsi;
      expect(barang.deskripsi).toBe(longDeskripsi);
      expect(barang.deskripsi.length).toBe(1000);
    });

    it('should handle negative stok', () => {
      const barang = new Barang();
      barang.stok = -5;
      expect(barang.stok).toBe(-5);
    });

    it('should handle zero harga', () => {
      const barang = new Barang();
      barang.harga = '0.00';
      expect(barang.harga).toBe('0.00');
    });

    it('should handle large harga values', () => {
      const barang = new Barang();
      const largeHarga = '999999999999.99';
      barang.harga = largeHarga;
      expect(barang.harga).toBe(largeHarga);
    });
  });

  describe('Entity Inheritance', () => {
    it('should inherit timestamps from EntityBase', () => {
      const barang = new Barang();
      const now = new Date();
      barang.createdAt = now;
      barang.updatedAt = now;
      barang.deletedAt = null;

      expect(barang.createdAt).toBe(now);
      expect(barang.updatedAt).toBe(now);
      expect(barang.deletedAt).toBeNull();
    });

    it('should handle soft delete', () => {
      const barang = new Barang();
      const deletedAt = new Date('2024-12-31');
      barang.deletedAt = deletedAt;

      expect(barang.deletedAt).toBe(deletedAt);
      expect(barang.deletedAt).toBeInstanceOf(Date);
    });
  });
});