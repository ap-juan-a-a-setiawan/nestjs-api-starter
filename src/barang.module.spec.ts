import { Test } from '@nestjs/testing';
import { BarangModule } from './barang.module';
import { BarangController } from './controllers/barang.controller';
import { BarangService } from './services/barang.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarangRepository } from './repositories/barang.repository';

describe('BarangModule', () => {
  let module: BarangModule;

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

    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([BarangRepository]),
      ],
      controllers: [BarangController],
      providers: [BarangService],
      exports: [BarangService],
    })
      .overrideProvider(BarangController)
      .useValue(mockBarangController)
      .overrideProvider(BarangService)
      .useValue(mockBarangService)
      .overrideProvider(BarangRepository)
      .useValue(mockBarangRepository)
      .compile();

    module = moduleRef.get<BarangModule>(BarangModule);
  });

  describe('Module Definition', () => {
    it('should be defined', () => {
      expect(module).toBeDefined();
    });

    it('should have the correct imports', () => {
      const metadata = Reflect.getMetadata('imports', BarangModule);
      expect(metadata).toBeDefined();
      expect(metadata).toHaveLength(1);
      expect(metadata[0]).toEqual(TypeOrmModule.forFeature([BarangRepository]));
    });

    it('should have the correct controllers', () => {
      const controllers = Reflect.getMetadata('controllers', BarangModule);
      expect(controllers).toBeDefined();
      expect(controllers).toHaveLength(1);
      expect(controllers[0]).toBe(BarangController);
    });

    it('should have the correct providers', () => {
      const providers = Reflect.getMetadata('providers', BarangModule);
      expect(providers).toBeDefined();
      expect(providers).toHaveLength(1);
      expect(providers[0]).toBe(BarangService);
    });

    it('should have the correct exports', () => {
      const exports = Reflect.getMetadata('exports', BarangModule);
      expect(exports).toBeDefined();
      expect(exports).toHaveLength(1);
      expect(exports[0]).toBe(BarangService);
    });
  });

  describe('Module Integration', () => {
    it('should provide BarangService', () => {
      const service = moduleRef.get<BarangService>(BarangService);
      expect(service).toBeDefined();
      expect(service).toBe(mockBarangService);
    });

    it('should provide BarangController', () => {
      const controller = moduleRef.get<BarangController>(BarangController);
      expect(controller).toBeDefined();
      expect(controller).toBe(mockBarangController);
    });

    it('should provide BarangRepository', () => {
      const repository = moduleRef.get<BarangRepository>(BarangRepository);
      expect(repository).toBeDefined();
      expect(repository).toBe(mockBarangRepository);
    });
  });

  describe('Module Metadata Validation', () => {
    it('should have BarangController as a controller', () => {
      const controllers = Reflect.getMetadata('controllers', BarangModule);
      expect(controllers).toContain(BarangController);
    });

    it('should have BarangService as a provider', () => {
      const providers = Reflect.getMetadata('providers', BarangModule);
      expect(providers).toContain(BarangService);
    });

    it('should have BarangService as an export', () => {
      const exports = Reflect.getMetadata('exports', BarangModule);
      expect(exports).toContain(BarangService);
    });

    it('should have BarangRepository in TypeOrmModule imports', () => {
      const imports = Reflect.getMetadata('imports', BarangModule);
      const typeOrmImport = imports.find(
        (imp: any) => imp && imp.module && imp.module.name === 'TypeOrmModule',
      );
      expect(typeOrmImport).toBeDefined();
    });
  });

  describe('Module Dependencies', () => {
    it('should have all required dependencies', () => {
      const controllers = Reflect.getMetadata('controllers', BarangModule);
      const providers = Reflect.getMetadata('providers', BarangModule);
      const exports = Reflect.getMetadata('exports', BarangModule);
      const imports = Reflect.getMetadata('imports', BarangModule);

      expect(controllers).toBeDefined();
      expect(providers).toBeDefined();
      expect(exports).toBeDefined();
      expect(imports).toBeDefined();
    });

    it('should not have any undefined dependencies', () => {
      const controllers = Reflect.getMetadata('controllers', BarangModule);
      const providers = Reflect.getMetadata('providers', BarangModule);
      const exports = Reflect.getMetadata('exports', BarangModule);
      const imports = Reflect.getMetadata('imports', BarangModule);

      expect(controllers.every((c: any) => c !== undefined)).toBe(true);
      expect(providers.every((p: any) => p !== undefined)).toBe(true);
      expect(exports.every((e: any) => e !== undefined)).toBe(true);
      expect(imports.every((i: any) => i !== undefined)).toBe(true);
    });
  });

  describe('Module Structure', () => {
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

    it('should have exactly one import', () => {
      const imports = Reflect.getMetadata('imports', BarangModule);
      expect(imports).toHaveLength(1);
    });
  });

  describe('Module Functionality', () => {
    it('should be able to instantiate the module', () => {
      expect(module).toBeInstanceOf(BarangModule);
    });

    it('should have the correct module name', () => {
      expect(BarangModule.name).toBe('BarangModule');
    });

    it('should be decorated with @Module', () => {
      const isModule = Reflect.getMetadata('isGlobal', BarangModule) !== undefined || 
                       Reflect.getMetadata('imports', BarangModule) !== undefined;
      expect(isModule).toBe(true);
    });
  });
});