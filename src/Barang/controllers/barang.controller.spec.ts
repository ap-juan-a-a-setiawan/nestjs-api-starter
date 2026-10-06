import { Test, TestingModule } from '@nestjs/testing';
import { BarangController } from './barang.controller';
import { BarangService } from '../services/barang.service';
import { JwtAuthGuard } from '../../Auth/guards/jwt-auth.guard';
import { CreateBarangDto } from '../dto/create-barang.dto';
import { HttpStatus } from '@nestjs/common';

describe('BarangController', () => {
  let controller: BarangController;
  let barangService: jest.Mocked<BarangService>;

  const mockBarangService = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarangController],
      providers: [
        {
          provide: BarangService,
          useValue: mockBarangService,
        },
        {
          provide: JwtAuthGuard,
          useValue: mockJwtAuthGuard,
        },
      ],
    }).compile();

    controller = module.get<BarangController>(BarangController);
    barangService = module.get(BarangService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all barang items', async () => {
      const expectedResult = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];
      mockBarangService.getAll.mockResolvedValue(expectedResult);

      const result = await controller.getAll();

      expect(result).toEqual(expectedResult);
      expect(mockBarangService.getAll).toHaveBeenCalled();
      expect(mockBarangService.getAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no items exist', async () => {
      mockBarangService.getAll.mockResolvedValue([]);

      const result = await controller.getAll();

      expect(result).toEqual([]);
      expect(mockBarangService.getAll).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const error = new Error('Database connection failed');
      mockBarangService.getAll.mockRejectedValue(error);

      await expect(controller.getAll()).rejects.toThrow(error);
      expect(mockBarangService.getAll).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return a single barang item by id', async () => {
      const expectedResult = { id: 1, name: 'Item 1' };
      const params = { id: '1' };
      mockBarangService.getById.mockResolvedValue(expectedResult);

      const result = await controller.getById(params);

      expect(result).toEqual(expectedResult);
      expect(mockBarangService.getById).toHaveBeenCalledWith('1');
      expect(mockBarangService.getById).toHaveBeenCalledTimes(1);
    });

    it('should return null when item not found', async () => {
      const params = { id: '999' };
      mockBarangService.getById.mockResolvedValue(null);

      const result = await controller.getById(params);

      expect(result).toBeNull();
      expect(mockBarangService.getById).toHaveBeenCalledWith('999');
    });

    it('should handle service errors', async () => {
      const params = { id: '1' };
      const error = new Error('Item not found');
      mockBarangService.getById.mockRejectedValue(error);

      await expect(controller.getById(params)).rejects.toThrow(error);
      expect(mockBarangService.getById).toHaveBeenCalledWith('1');
    });

    it('should handle invalid id format', async () => {
      const params = { id: 'invalid' };
      mockBarangService.getById.mockResolvedValue(null);

      const result = await controller.getById(params);

      expect(result).toBeNull();
      expect(mockBarangService.getById).toHaveBeenCalledWith('invalid');
    });
  });

  describe('create', () => {
    it('should create a new barang and return success response', async () => {
      const createBarangDto: CreateBarangDto = {
        name: 'New Item',
        price: 100,
        stock: 10,
      };
      const createdBarang = { id: 1, ...createBarangDto };
      mockBarangService.create.mockResolvedValue(createdBarang);

      const result = await controller.create(createBarangDto);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        barang: createdBarang,
      });
      expect(mockBarangService.create).toHaveBeenCalledWith(createBarangDto);
      expect(mockBarangService.create).toHaveBeenCalledTimes(1);
    });

    it('should handle empty DTO', async () => {
      const createBarangDto = {} as CreateBarangDto;
      const createdBarang = { id: 2 };
      mockBarangService.create.mockResolvedValue(createdBarang);

      const result = await controller.create(createBarangDto);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        barang: createdBarang,
      });
      expect(mockBarangService.create).toHaveBeenCalledWith(createBarangDto);
    });

    it('should handle service errors during creation', async () => {
      const createBarangDto: CreateBarangDto = {
        name: 'New Item',
        price: 100,
        stock: 10,
      };
      const error = new Error('Validation failed');
      mockBarangService.create.mockRejectedValue(error);

      await expect(controller.create(createBarangDto)).rejects.toThrow(error);
      expect(mockBarangService.create).toHaveBeenCalledWith(createBarangDto);
    });

    it('should handle null DTO', async () => {
      const createBarangDto = null as unknown as CreateBarangDto;
      const error = new Error('Invalid input');
      mockBarangService.create.mockRejectedValue(error);

      await expect(controller.create(createBarangDto)).rejects.toThrow(error);
      expect(mockBarangService.create).toHaveBeenCalledWith(createBarangDto);
    });
  });

  describe('Guard integration', () => {
    it('should have JwtAuthGuard applied to controller', () => {
      const guards = Reflect.getMetadata('__guards__', BarangController);
      expect(guards).toBeDefined();
      expect(guards).toContain(JwtAuthGuard);
    });

    it('should have JwtAuthGuard applied to getAll method', () => {
      const guards = Reflect.getMetadata('__guards__', BarangController.prototype.getAll);
      expect(guards).toBeDefined();
      expect(guards).toContain(JwtAuthGuard);
    });

    it('should have JwtAuthGuard applied to getById method', () => {
      const guards = Reflect.getMetadata('__guards__', BarangController.prototype.getById);
      expect(guards).toBeDefined();
      expect(guards).toContain(JwtAuthGuard);
    });

    it('should have JwtAuthGuard applied to create method', () => {
      const guards = Reflect.getMetadata('__guards__', BarangController.prototype.create);
      expect(guards).toBeDefined();
      expect(guards).toContain(JwtAuthGuard);
    });
  });
});