import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { BarangService } from './barang.service';
import { Barang } from '../entities/barang.entity';
import { BarangRepository } from '../repositories/barang.repository';
import { CreateBarangDto } from '../dto/create-barang.dto';

describe('BarangService', () => {
  let service: BarangService;
  let barangRepository: jest.Mocked<BarangRepository>;
  let queryBuilderMock: any;

  const mockBarang: Barang = {
    id: '1',
    nama: 'Test Barang',
    harga: 10000,
    stok: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockCreateBarangDto: CreateBarangDto = {
    nama: 'Test Barang',
    harga: 10000,
    stok: 10
  };

  beforeEach(async () => {
    queryBuilderMock = {
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BarangService,
        {
          provide: getRepositoryToken(Barang),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<BarangService>(BarangService);
    barangRepository = module.get(getRepositoryToken(Barang));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return an array of barang', async () => {
      const expectedResult = [mockBarang];
      barangRepository.find.mockResolvedValue(expectedResult);

      const result = await service.getAll();

      expect(result).toEqual(expectedResult);
      expect(barangRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no barang exists', async () => {
      barangRepository.find.mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual([]);
      expect(barangRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      barangRepository.find.mockRejectedValue(error);

      await expect(service.getAll()).rejects.toThrow(error);
      expect(barangRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('should return a barang by id', async () => {
      const id = '1';
      barangRepository.findOne.mockResolvedValue(mockBarang);

      const result = await service.getById(id);

      expect(result).toEqual(mockBarang);
      expect(barangRepository.findOne).toHaveBeenCalledWith(id);
      expect(barangRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return null when barang is not found', async () => {
      const id = 'nonexistent-id';
      barangRepository.findOne.mockResolvedValue(null);

      const result = await service.getById(id);

      expect(result).toBeNull();
      expect(barangRepository.findOne).toHaveBeenCalledWith(id);
      expect(barangRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors', async () => {
      const id = '1';
      const error = new Error('Database error');
      barangRepository.findOne.mockRejectedValue(error);

      await expect(service.getById(id)).rejects.toThrow(error);
      expect(barangRepository.findOne).toHaveBeenCalledWith(id);
      expect(barangRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    beforeEach(() => {
      jest.mock('typeorm', () => ({
        getRepository: jest.fn().mockReturnValue({
          createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock)
        })
      }));
    });

    it('should create a new barang successfully', async () => {
      queryBuilderMock.getOne.mockResolvedValue(null);
      barangRepository.save.mockResolvedValue(mockBarang);

      const result = await service.create(mockCreateBarangDto);

      expect(result).toEqual(mockBarang);
      expect(queryBuilderMock.where).toHaveBeenCalledWith(
        'barang.nama = :nama',
        { nama: mockCreateBarangDto.nama }
      );
      expect(queryBuilderMock.getOne).toHaveBeenCalledTimes(1);
      expect(barangRepository.save).toHaveBeenCalledWith(mockCreateBarangDto);
      expect(barangRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpException when barang name already exists', async () => {
      queryBuilderMock.getOne.mockResolvedValue(mockBarang);

      try {
        await service.create(mockCreateBarangDto);
        fail('Expected HttpException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.response).toEqual({
          statusCode: HttpStatus.BAD_REQUEST,
          errors: ['Nama barang must be unique.'],
          error: 'Bad Request'
        });
      }

      expect(queryBuilderMock.where).toHaveBeenCalledWith(
        'barang.nama = :nama',
        { nama: mockCreateBarangDto.nama }
      );
      expect(queryBuilderMock.getOne).toHaveBeenCalledTimes(1);
      expect(barangRepository.save).not.toHaveBeenCalled();
    });

    it('should handle database errors during uniqueness check', async () => {
      const error = new Error('Database error');
      queryBuilderMock.getOne.mockRejectedValue(error);

      await expect(service.create(mockCreateBarangDto)).rejects.toThrow(error);
      expect(queryBuilderMock.where).toHaveBeenCalledWith(
        'barang.nama = :nama',
        { nama: mockCreateBarangDto.nama }
      );
      expect(queryBuilderMock.getOne).toHaveBeenCalledTimes(1);
      expect(barangRepository.save).not.toHaveBeenCalled();
    });

    it('should handle save errors', async () => {
      queryBuilderMock.getOne.mockResolvedValue(null);
      const error = new Error('Database error');
      barangRepository.save.mockRejectedValue(error);

      await expect(service.create(mockCreateBarangDto)).rejects.toThrow(error);
      expect(queryBuilderMock.getOne).toHaveBeenCalledTimes(1);
      expect(barangRepository.save).toHaveBeenCalledWith(mockCreateBarangDto);
      expect(barangRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should handle empty nama in create dto', async () => {
      const emptyDto: CreateBarangDto = {
        nama: '',
        harga: 10000,
        stok: 10
      };

      queryBuilderMock.getOne.mockResolvedValue(null);
      barangRepository.save.mockResolvedValue({ ...mockBarang, nama: '' });

      const result = await service.create(emptyDto);

      expect(result).toEqual({ ...mockBarang, nama: '' });
      expect(queryBuilderMock.where).toHaveBeenCalledWith(
        'barang.nama = :nama',
        { nama: '' }
      );
      expect(barangRepository.save).toHaveBeenCalledWith(emptyDto);
    });

    it('should handle special characters in nama', async () => {
      const specialDto: CreateBarangDto = {
        nama: 'Barang @#$%^&*()',
        harga: 10000,
        stok: 10
      };

      queryBuilderMock.getOne.mockResolvedValue(null);
      barangRepository.save.mockResolvedValue({ ...mockBarang, nama: specialDto.nama });

      const result = await service.create(specialDto);

      expect(result).toEqual({ ...mockBarang, nama: specialDto.nama });
      expect(queryBuilderMock.where).toHaveBeenCalledWith(
        'barang.nama = :nama',
        { nama: specialDto.nama }
      );
      expect(barangRepository.save).toHaveBeenCalledWith(specialDto);
    });
  });
});