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
      mockBarangService.getAll.mockReturnValue(expectedResult);

      const result = controller.getAll();

      expect(result).toEqual(expectedResult);
      expect(mockBarangService.getAll).toHaveBeenCalled();
      expect(mockBarangService.getAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no items exist', async () => {
      mockBarangService.getAll.mockReturnValue([]);

      const result = controller.getAll();

      expect(result).toEqual([]);
      expect(mockBarangService.getAll).toHaveBeenCalled();
    });

    it('should propagate service errors', async () => {
      const error = new Error('Database connection failed');
      mockBarangService.getAll.mockRejectedValue(error);

      await expect(controller.getAll()).rejects.toThrow(error);
    });
  });

  describe('getById', () => {
    it('should return a single barang item by id', async () => {
      const expectedResult = { id: 1, name: 'Item 1' };
      const params = { id: '1' };
      mockBarangService.getById.mockReturnValue(expectedResult);

      const result = controller.getById(params);

      expect(result).toEqual(expectedResult);
      expect(mockBarangService.getById).toHaveBeenCalledWith('1');
      expect(mockBarangService.getById).toHaveBeenCalledTimes(1);
    });

    it('should handle string id conversion', async () => {
      const expectedResult = { id: 2, name: 'Item 2' };
      const params = { id: '2' };
      mockBarangService.getById.mockReturnValue(expectedResult);

      const result = controller.getById(params);

      expect(result).toEqual(expectedResult);
      expect(mockBarangService.getById).toHaveBeenCalledWith('2');
    });

    it('should handle non-numeric id', async () => {
      const expectedResult = null;
      const params = { id: 'abc' };
      mockBarangService.getById.mockReturnValue(expectedResult);

      const result = controller.getById(params);

      expect(result).toBeNull();
      expect(mockBarangService.getById).toHaveBeenCalledWith('abc');
    });

    it('should propagate service errors', async () => {
      const params = { id: '1' };
      const error = new Error('Item not found');
      mockBarangService.getById.mockRejectedValue(error);

      await expect(controller.getById(params)).rejects.toThrow(error);
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
      const createdBarang = { id: 2, ...createBarangDto };
      mockBarangService.create.mockResolvedValue(createdBarang);

      const result = await controller.create(createBarangDto);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        barang: createdBarang,
      });
      expect(mockBarangService.create).toHaveBeenCalledWith(createBarangDto);
    });

    it('should handle DTO with all fields', async () => {
      const createBarangDto: CreateBarangDto = {
        name: 'Complete Item',
        price: 250.5,
        stock: 25,
        description: 'A complete item description',
        category: 'Electronics',
      };
      const createdBarang = { id: 3, ...createBarangDto };
      mockBarangService.create.mockResolvedValue(createdBarang);

      const result = await controller.create(createBarangDto);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        barang: createdBarang,
      });
      expect(mockBarangService.create).toHaveBeenCalledWith(createBarangDto);
    });

    it('should propagate service errors', async () => {
      const createBarangDto: CreateBarangDto = {
        name: 'Invalid Item',
        price: -100,
        stock: -5,
      };
      const error = new Error('Invalid barang data');
      mockBarangService.create.mockRejectedValue(error);

      await expect(controller.create(createBarangDto)).rejects.toThrow(error);
      expect(mockBarangService.create).toHaveBeenCalledWith(createBarangDto);
    });

    it('should handle service returning null', async () => {
      const createBarangDto: CreateBarangDto = {
        name: 'Null Item',
        price: 100,
        stock: 10,
      };
      mockBarangService.create.mockResolvedValue(null);

      const result = await controller.create(createBarangDto);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        barang: null,
      });
      expect(mockBarangService.create).toHaveBeenCalledWith(createBarangDto);
    });
  });

  describe('Guard configuration', () => {
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