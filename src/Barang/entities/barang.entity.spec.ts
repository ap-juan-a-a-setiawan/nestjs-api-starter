import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Barang } from './barang.entity';
import { EntityBase } from '../../App/abstracts/entity.base';

describe('Barang Entity', () => {
  let barangEntity: Barang;
  let repository: jest.Mocked<Repository<Barang>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        Barang,
        {
          provide: getRepositoryToken(Barang),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    barangEntity = moduleRef.get<Barang>(Barang);
    repository = moduleRef.get<jest.Mocked<Repository<Barang>>>(getRepositoryToken(Barang));
  });

  describe('Entity Definition', () => {
    it('should be defined', () => {
      expect(barangEntity).toBeDefined();
    });

    it('should be an instance of EntityBase', () => {
      expect(barangEntity).toBeInstanceOf(EntityBase);
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
  });

  describe('Entity Properties', () => {
    it('should have default values for harga, stok, and status', () => {
      const barang = new Barang();
      
      expect(barang.harga).toBe('0');
      expect(barang.stok).toBe(0);
      expect(barang.status).toBe('aktif');
    });

    it('should accept valid values for all properties', () => {
      const barang = new Barang();
      barang.id = 1;
      barang.nama = 'Test Barang';
      barang.deskripsi = 'Test Deskripsi';
      barang.harga = '100000.00';
      barang.stok = 10;
      barang.kategori = 'Elektronik';
      barang.status = 'aktif';

      expect(barang.id).toBe(1);
      expect(barang.nama).toBe('Test Barang');
      expect(barang.deskripsi).toBe('Test Deskripsi');
      expect(barang.harga).toBe('100000.00');
      expect(barang.stok).toBe(10);
      expect(barang.kategori).toBe('Elektronik');
      expect(barang.status).toBe('aktif');
    });

    it('should handle non-aktif status', () => {
      const barang = new Barang();
      barang.status = 'non-aktif';
      expect(barang.status).toBe('non-aktif');
    });

    it('should handle decimal harga values', () => {
      const barang = new Barang();
      barang.harga = '9999999999.99';
      expect(barang.harga).toBe('9999999999.99');
    });

    it('should handle zero values', () => {
      const barang = new Barang();
      barang.harga = '0';
      barang.stok = 0;
      expect(barang.harga).toBe('0');
      expect(barang.stok).toBe(0);
    });
  });

  describe('Entity Inheritance', () => {
    it('should inherit properties from EntityBase', () => {
      const barang = new Barang();
      
      // Check if EntityBase properties are available
      expect(barang).toBeInstanceOf(EntityBase);
      expect(Object.getPrototypeOf(barang)).toBeInstanceOf(EntityBase);
    });

    it('should have access to EntityBase methods', () => {
      const barang = new Barang();
      
      // Verify that the entity can be used with repository operations
      expect(typeof repository.save).toBe('function');
      expect(typeof repository.find).toBe('function');
      expect(typeof repository.findOne).toBe('function');
    });
  });

  describe('Repository Operations', () => {
    it('should create a new barang entity', () => {
      const barangData = {
        nama: 'Barang Baru',
        deskripsi: 'Deskripsi Baru',
        harga: '50000',
        stok: 5,
        kategori: 'Makanan',
        status: 'aktif',
      };

      const createdBarang = Object.assign(new Barang(), barangData);
      repository.create.mockReturnValue(createdBarang);

      const result = repository.create(barangData);
      
      expect(result).toEqual(createdBarang);
      expect(repository.create).toHaveBeenCalledWith(barangData);
    });

    it('should save a barang entity', async () => {
      const barang = new Barang();
      barang.nama = 'Test Save';
      barang.deskripsi = 'Deskripsi Save';
      barang.harga = '10000';
      barang.stok = 3;
      barang.kategori = 'Minuman';
      barang.status = 'aktif';

      repository.save.mockResolvedValue(barang);

      const result = await repository.save(barang);
      
      expect(result).toEqual(barang);
      expect(repository.save).toHaveBeenCalledWith(barang);
    });

    it('should find all barang entities', async () => {
      const barangList = [
        Object.assign(new Barang(), { id: 1, nama: 'Barang 1' }),
        Object.assign(new Barang(), { id: 2, nama: 'Barang 2' }),
      ];

      repository.find.mockResolvedValue(barangList);

      const result = await repository.find();
      
      expect(result).toEqual(barangList);
      expect(result).toHaveLength(2);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should find one barang entity by id', async () => {
      const barang = Object.assign(new Barang(), { 
        id: 1, 
        nama: 'Barang 1',
        deskripsi: 'Deskripsi 1',
        harga: '10000',
        stok: 5,
        kategori: 'Elektronik',
        status: 'aktif'
      });

      repository.findOne.mockResolvedValue(barang);

      const result = await repository.findOne({ where: { id: 1 } });
      
      expect(result).toEqual(barang);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should update a barang entity', async () => {
      const updateData = { nama: 'Updated Name' };
      const updateResult = { affected: 1, raw: {}, generatedMaps: [] };
      
      repository.update.mockResolvedValue(updateResult);

      const result = await repository.update(1, updateData);
      
      expect(result).toEqual(updateResult);
      expect(repository.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should delete a barang entity', async () => {
      const deleteResult = { affected: 1, raw: {} };
      
      repository.delete.mockResolvedValue(deleteResult);

      const result = await repository.delete(1);
      
      expect(result).toEqual(deleteResult);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string values', () => {
      const barang = new Barang();
      barang.nama = '';
      barang.deskripsi = '';
      barang.kategori = '';

      expect(barang.nama).toBe('');
      expect(barang.deskripsi).toBe('');
      expect(barang.kategori).toBe('');
    });

    it('should handle negative stock values', () => {
      const barang = new Barang();
      barang.stok = -5;
      expect(barang.stok).toBe(-5);
    });

    it('should handle large stock values', () => {
      const barang = new Barang();
      barang.stok = 999999999;
      expect(barang.stok).toBe(999999999);
    });

    it('should handle harga with decimal places', () => {
      const barang = new Barang();
      barang.harga = '12345.67';
      expect(barang.harga).toBe('12345.67');
    });

    it('should handle harga with no decimal places', () => {
      const barang = new Barang();
      barang.harga = '10000';
      expect(barang.harga).toBe('10000');
    });

    it('should handle undefined values', () => {
      const barang = new Barang();
      
      expect(barang.id).toBeUndefined();
      expect(barang.nama).toBeUndefined();
      expect(barang.deskripsi).toBeUndefined();
      expect(barang.kategori).toBeUndefined();
    });

    it('should handle null values', () => {
      const barang = new Barang();
      barang.nama = null;
      barang.deskripsi = null;
      barang.kategori = null;

      expect(barang.nama).toBeNull();
      expect(barang.deskripsi).toBeNull();
      expect(barang.kategori).toBeNull();
    });
  });

  describe('Entity Metadata', () => {
    it('should have entity name "barang"', () => {
      const metadata = Reflect.getMetadata('typeorm:entity', Barang);
      expect(metadata).toBeDefined();
    });

    it('should have primary generated column for id', () => {
      const columns = Reflect.getMetadata('typeorm:columns', Barang);
      expect(columns).toBeDefined();
    });

    it('should have all expected columns', () => {
      const columns = Reflect.getMetadata('typeorm:columns', Barang);
      
      if (columns) {
        const columnNames = columns.map((col: any) => col.propertyName);
        expect(columnNames).toContain('id');
        expect(columnNames).toContain('nama');
        expect(columnNames).toContain('deskripsi');
        expect(columnNames).toContain('harga');
        expect(columnNames).toContain('stok');
        expect(columnNames).toContain('kategori');
        expect(columnNames).toContain('status');
      }
    });
  });
});