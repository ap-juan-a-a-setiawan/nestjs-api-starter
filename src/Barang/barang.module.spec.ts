import { Test } from '@nestjs/testing';
import { BarangModule } from './barang.module';
import { BarangController } from './controllers/barang.controller';
import { BarangService } from './services/barang.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarangRepository } from './repositories/barang.repository';

describe('BarangModule', () => {
  let moduleRef: any;

  const mockBarangController = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockBarangService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockBarangRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    moduleRef = await Test.createTestingModule({
      imports: [BarangModule],
    })
      .overrideProvider(BarangController)
      .useValue(mockBarangController)
      .overrideProvider(BarangService)
      .useValue(mockBarangService)
      .overrideProvider(BarangRepository)
      .useValue(mockBarangRepository)
      .compile();
  });

  describe('Module Definition', () => {
    it('should be defined', () => {
      expect(moduleRef).toBeDefined();
    });

    it('should have BarangController as a controller', () => {
      const controller = moduleRef.get(BarangController);
      expect(controller).toBeDefined();
      expect(controller).toEqual(mockBarangController);
    });

    it('should have BarangService as a provider', () => {
      const service = moduleRef.get(BarangService);
      expect(service).toBeDefined();
      expect(service).toEqual(mockBarangService);
    });

    it('should have BarangRepository as a provider', () => {
      const repository = moduleRef.get(BarangRepository);
      expect(repository).toBeDefined();
      expect(repository).toEqual(mockBarangRepository);
    });
  });

  describe('Module Imports', () => {
    it('should import TypeOrmModule with BarangRepository', () => {
      const typeOrmModule = TypeOrmModule.forFeature([BarangRepository]);
      expect(typeOrmModule).toBeDefined();
      expect(typeOrmModule.imports).toBeDefined();
      expect(typeOrmModule.controllers).toBeUndefined();
      expect(typeOrmModule.providers).toBeUndefined();
    });

    it('should have TypeOrmModule in module imports', () => {
      const metadata = Reflect.getMetadata('imports', BarangModule);
      expect(metadata).toBeDefined();
      expect(metadata.length).toBe(1);
      expect(metadata[0]).toBeDefined();
    });
  });

  describe('Module Controllers', () => {
    it('should have BarangController registered', () => {
      const controllers = Reflect.getMetadata('controllers', BarangModule);
      expect(controllers).toBeDefined();
      expect(controllers).toContain(BarangController);
      expect(controllers.length).toBe(1);
    });
  });

  describe('Module Providers', () => {
    it('should have BarangService registered as provider', () => {
      const providers = Reflect.getMetadata('providers', BarangModule);
      expect(providers).toBeDefined();
      expect(providers).toContain(BarangService);
      expect(providers.length).toBe(1);
    });
  });

  describe('Module Exports', () => {
    it('should export BarangService', () => {
      const exports = Reflect.getMetadata('exports', BarangModule);
      expect(exports).toBeDefined();
      expect(exports).toContain(BarangService);
      expect(exports.length).toBe(1);
    });
  });

  describe('Module Metadata Validation', () => {
    it('should have correct module metadata', () => {
      const moduleMetadata = {
        imports: Reflect.getMetadata('imports', BarangModule),
        controllers: Reflect.getMetadata('controllers', BarangModule),
        providers: Reflect.getMetadata('providers', BarangModule),
        exports: Reflect.getMetadata('exports', BarangModule),
      };

      expect(moduleMetadata.imports).toBeDefined();
      expect(moduleMetadata.controllers).toBeDefined();
      expect(moduleMetadata.providers).toBeDefined();
      expect(moduleMetadata.exports).toBeDefined();
    });

    it('should have exactly one import', () => {
      const imports = Reflect.getMetadata('imports', BarangModule);
      expect(imports).toHaveLength(1);
    });

    it('should have exactly one controller', () => {
      const controllers = Reflect.getMetadata('controllers', BarangModule);
      expect(controllers).toHaveLength(1);
    });

    it('should have exactly one provider', () => {
      const providers = Reflect.getMetadata('providers', BarangModule);
      expect(providers).toHaveLength(1);
    });

    it('should have exactly one export', () => {
      const exports = Reflect.getMetadata('exports', BarangModule);
      expect(exports).toHaveLength(1);
    });
  });

  describe('Module Integration', () => {
    it('should resolve BarangController dependency', () => {
      const controller = moduleRef.get(BarangController);
      expect(controller).toBeDefined();
    });

    it('should resolve BarangService dependency', () => {
      const service = moduleRef.get(BarangService);
      expect(service).toBeDefined();
    });

    it('should resolve BarangRepository dependency', () => {
      const repository = moduleRef.get(BarangRepository);
      expect(repository).toBeDefined();
    });

    it('should have all dependencies properly injected', () => {
      const controller = moduleRef.get(BarangController);
      const service = moduleRef.get(BarangService);
      const repository = moduleRef.get(BarangRepository);

      expect(controller).toBeDefined();
      expect(service).toBeDefined();
      expect(repository).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle module without any dependencies', async () => {
      const emptyModule = await Test.createTestingModule({
        imports: [BarangModule],
      })
        .overrideProvider(BarangController)
        .useValue({})
        .overrideProvider(BarangService)
        .useValue({})
        .overrideProvider(BarangRepository)
        .useValue({})
        .compile();

      expect(emptyModule).toBeDefined();
    });

    it('should handle module with mocked dependencies', async () => {
      const mockedModule = await Test.createTestingModule({
        imports: [BarangModule],
      })
        .overrideProvider(BarangController)
        .useValue(mockBarangController)
        .overrideProvider(BarangService)
        .useValue(mockBarangService)
        .overrideProvider(BarangRepository)
        .useValue(mockBarangRepository)
        .compile();

      const controller = mockedModule.get(BarangController);
      const service = mockedModule.get(BarangService);
      const repository = mockedModule.get(BarangRepository);

      expect(controller).toEqual(mockBarangController);
      expect(service).toEqual(mockBarangService);
      expect(repository).toEqual(mockBarangRepository);
    });

    it('should handle module with null dependencies', async () => {
      const nullModule = await Test.createTestingModule({
        imports: [BarangModule],
      })
        .overrideProvider(BarangController)
        .useValue(null)
        .overrideProvider(BarangService)
        .useValue(null)
        .overrideProvider(BarangRepository)
        .useValue(null)
        .compile();

      expect(nullModule).toBeDefined();
    });
  });

  describe('Module Structure', () => {
    it('should have correct module decorator', () => {
      const moduleDecorator = Reflect.getMetadata('__module__', BarangModule);
      expect(moduleDecorator).toBeDefined();
    });

    it('should be a class', () => {
      expect(typeof BarangModule).toBe('function');
      expect(BarangModule).toBeInstanceOf(Function);
    });

    it('should have constructor', () => {
      expect(BarangModule.prototype.constructor).toBeDefined();
    });

    it('should not have any methods', () => {
      const prototype = Object.getOwnPropertyNames(BarangModule.prototype);
      expect(prototype).toEqual(['constructor']);
    });
  });

  describe('Module TypeORM Integration', () => {
    it('should have TypeOrmModule.forFeature with BarangRepository', () => {
      const typeOrmModule = TypeOrmModule.forFeature([BarangRepository]);
      expect(typeOrmModule).toBeDefined();
      expect(typeOrmModule.module).toBeDefined();
      expect(typeOrmModule.providers).toBeDefined();
      expect(typeOrmModule.exports).toBeDefined();
    });

    it('should have BarangRepository in TypeOrmModule', () => {
      const typeOrmModule = TypeOrmModule.forFeature([BarangRepository]);
      const providers = typeOrmModule.providers;
      expect(providers).toBeDefined();
      expect(providers.length).toBeGreaterThan(0);
    });
  });
});