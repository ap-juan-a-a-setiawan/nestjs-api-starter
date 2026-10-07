import { Test } from '@nestjs/testing';
import { getRepository } from 'typeorm';
import { BarangService } from './barang.service';
import { Barang } from '../entities/barang.entity';
import { CreateBarangDto } from '../dto/create-barang.dto';
import { BarangRepository } from '../repositories/barang.repository';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('typeorm', () => ({
  getRepository: jest.fn()
}));

describe('BarangService', () => {
  let service: BarangService;
  let mockBarangRepository: jest.Mocked<BarangRepository>;
  let mockQueryBuilder: any;
  let mockGetRepository: jest.Mock;

  const mockBarang: Barang = {
    id: '1',
    nama: 'Test Barang',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockCreateBarangDto: CreateBarangDto = {
    nama: 'Test Barang'
  };

  beforeEach(async () => {
    mockBarangRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn()
    } as jest.Mocked<BarangRepository>;

    mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn()
    };

    mockGetRepository = jest.fn().mockReturnValue({
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder)
    });

    (getRepository as jest.Mock) = mockGetRepository;

    const moduleRef = await Test.createTestingModule({
      providers: [
        BarangService,
        {
          provide: BarangRepository,
          useValue: mockBarangRepository
        }
      ]
    }).compile();

    service = moduleRef.get<BarangService>(BarangService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all barang records', async () => {
      const mockBarangs: Barang[] = [mockBarang];
      mockBarangRepository.find.mockResolvedValue(mockBarangs);

      const result = await service.getAll();

      expect(result).toEqual(mockBarangs);
      expect(mockBarangRepository.find).toHaveBeenCalledTimes(1);
      expect(mockBarangRepository.find).toHaveBeenCalledWith();
    });

    it('should return empty array when no records exist', async () => {
      mockBarangRepository.find.mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual([]);
      expect(mockBarangRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Database connection failed');
      mockBarangRepository.find.mockRejectedValue(error);

      expect(service.getAll()).rejects.toThrow(error);
      expect(mockBarangRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('should return a barang by id', async () => {
      mockBarangRepository.findOne.mockResolvedValue(mockBarang);

      const result = await service.getById('1');

      expect(result).toEqual(mockBarang);
      expect(mockBarangRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockBarangRepository.findOne).toHaveBeenCalledWith('1');
    });

    it('should return null when barang not found', async () => {
      mockBarangRepository.findOne.mockResolvedValue(null);

      const result = await service.getById('nonexistent');

      expect(result).toBeNull();
      expect(mockBarangRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockBarangRepository.findOne).toHaveBeenCalledWith('nonexistent');
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Database connection failed');
      mockBarangRepository.findOne.mockRejectedValue(error);

      expect(service.getById('1')).rejects.toThrow(error);
      expect(mockBarangRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockBarangRepository.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new barang when nama is unique', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);
      mockBarangRepository.save.mockResolvedValue(mockBarang);

      const result = await service.create(mockCreateBarangDto);

      expect(result).toEqual(mockBarang);
      expect(mockGetRepository).toHaveBeenCalledTimes(1);
      expect(mockGetRepository).toHaveBeenCalledWith(Barang);
      expect(mockQueryBuilder.where).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('barang.nama = :nama', { nama: mockCreateBarangDto.nama });
      expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1);
      expect(mockBarangRepository.save).toHaveBeenCalledTimes(1);
      expect(mockBarangRepository.save).toHaveBeenCalledWith(mockCreateBarangDto);
    });

    it('should throw HttpException when nama already exists', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(mockBarang);

      const expectedError = new HttpException({
        statusCode: HttpStatus.BAD_REQUEST,
        errors: ['Nama barang must be unique.'],
        error: 'Bad Request'
      }, HttpStatus.BAD_REQUEST);

      try {
        await service.create(mockCreateBarangDto);
        fail('Expected HttpException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        expect(error.getResponse()).toEqual({
          statusCode: HttpStatus.BAD_REQUEST,
          errors: ['Nama barang must be unique.'],
          error: 'Bad Request'
        });
      }

      expect(mockGetRepository).toHaveBeenCalledTimes(1);
      expect(mockGetRepository).toHaveBeenCalledWith(Barang);
      expect(mockQueryBuilder.where).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('barang.nama = :nama', { nama: mockCreateBarangDto.nama });
      expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1);
      expect(mockBarangRepository.save).not.toHaveBeenCalled();
    });

    it('should propagate errors from query builder', async () => {
      const error = new Error('Database query failed');
      mockQueryBuilder.getOne.mockRejectedValue(error);

      expect(service.create(mockCreateBarangDto)).rejects.toThrow(error);
      expect(mockGetRepository).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.where).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1);
      expect(mockBarangRepository.save).not.toHaveBeenCalled();
    });

    it('should propagate errors from save operation', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);
      const error = new Error('Database save failed');
      mockBarangRepository.save.mockRejectedValue(error);

      expect(service.create(mockCreateBarangDto)).rejects.toThrow(error);
      expect(mockGetRepository).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.where).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1);
      expect(mockBarangRepository.save).toHaveBeenCalledTimes(1);
      expect(mockBarangRepository.save).toHaveBeenCalledWith(mockCreateBarangDto);
    });

    it('should handle empty nama in DTO', async () => {
      const emptyDto: CreateBarangDto = { nama: '' };
      mockQueryBuilder.getOne.mockResolvedValue(null);
      mockBarangRepository.save.mockResolvedValue({ ...mockBarang, nama: '' });

      const result = await service.create(emptyDto);

      expect(result).toEqual({ ...mockBarang, nama: '' });
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('barang.nama = :nama', { nama: '' });
      expect(mockBarangRepository.save).toHaveBeenCalledWith(emptyDto);
    });
  });
});