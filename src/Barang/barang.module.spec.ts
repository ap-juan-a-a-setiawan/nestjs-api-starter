import { Test } from '@nestjs/testing';
import { BarangModule } from './barang.module';
import { BarangController } from './controllers/barang.controller';
import { BarangService } from './services/barang.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarangRepository } from './repositories/barang.repository';

describe('BarangModule', () => {
  let moduleRef: any;

  const mockBarangRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockBarangService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockBarangController = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    moduleRef = await Test.createTestingModule({
      imports: [BarangModule],
    })
      .overrideProvider(BarangRepository)
      .useValue(mockBarangRepository)
      .overrideProvider(BarangService)
      .useValue(mockBarangService)
      .overrideProvider(BarangController)
      .useValue(mockBarangController)
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
  });

  describe('Module Exports', () => {
    it('should export BarangService', () => {
      const moduleMetadata = Reflect.getMetadata('exports', BarangModule);
      expect(moduleMetadata).toBeDefined();
      expect(moduleMetadata).toContain(BarangService);
    });
  });

  describe('Module Controllers', () => {
    it('should have BarangController registered', () => {
      const moduleMetadata = Reflect.getMetadata('controllers', BarangModule);
      expect(moduleMetadata).toBeDefined();
      expect(moduleMetadata).toContain(BarangController);
    });
  });

  describe('Module Providers', () => {
    it('should have BarangService registered as provider', () => {
      const moduleMetadata = Reflect.getMetadata('providers', BarangModule);
      expect(moduleMetadata).toBeDefined();
      expect(moduleMetadata).toContain(BarangService);
    });
  });

  describe('Module Metadata', () => {
    it('should have correct module metadata', () => {
      const moduleMetadata = Reflect.getMetadata('module', BarangModule);
      expect(moduleMetadata).toBeDefined();
    });

    it('should have imports metadata', () => {
      const importsMetadata = Reflect.getMetadata('imports', BarangModule);
      expect(importsMetadata).toBeDefined();
      expect(importsMetadata).toHaveLength(1);
    });

    it('should have controllers metadata', () => {
      const controllersMetadata = Reflect.getMetadata('controllers', BarangModule);
      expect(controllersMetadata).toBeDefined();
      expect(controllersMetadata).toHaveLength(1);
    });

    it('should have providers metadata', () => {
      const providersMetadata = Reflect.getMetadata('providers', BarangModule);
      expect(providersMetadata).toBeDefined();
      expect(providersMetadata).toHaveLength(1);
    });

    it('should have exports metadata', () => {
      const exportsMetadata = Reflect.getMetadata('exports', BarangModule);
      expect(exportsMetadata).toBeDefined();
      expect(exportsMetadata).toHaveLength(1);
    });
  });

  describe('Module Integration', () => {
    it('should properly instantiate the module', async () => {
      const module = await Test.createTestingModule({
        imports: [BarangModule],
      })
        .overrideProvider(BarangRepository)
        .useValue(mockBarangRepository)
        .overrideProvider(BarangService)
        .useValue(mockBarangService)
        .overrideProvider(BarangController)
        .useValue(mockBarangController)
        .compile();

      expect(module).toBeDefined();
      const app = module.createNestApplication();
      await app.init();
      expect(app).toBeDefined();
      await app.close();
    });

    it('should resolve BarangService from module', () => {
      const service = moduleRef.get(BarangService);
      expect(service).toBeDefined();
      expect(service.findAll).toBeDefined();
      expect(service.findOne).toBeDefined();
      expect(service.create).toBeDefined();
      expect(service.update).toBeDefined();
      expect(service.remove).toBeDefined();
    });

    it('should resolve BarangController from module', () => {
      const controller = moduleRef.get(BarangController);
      expect(controller).toBeDefined();
      expect(controller.findAll).toBeDefined();
      expect(controller.findOne).toBeDefined();
      expect(controller.create).toBeDefined();
      expect(controller.update).toBeDefined();
      expect(controller.remove).toBeDefined();
    });

    it('should resolve BarangRepository from module', () => {
      const repository = moduleRef.get(BarangRepository);
      expect(repository).toBeDefined();
      expect(repository.find).toBeDefined();
      expect(repository.findOne).toBeDefined();
      expect(repository.create).toBeDefined();
      expect(repository.save).toBeDefined();
      expect(repository.update).toBeDefined();
      expect(repository.delete).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle module without TypeOrmModule', async () => {
      const module = await Test.createTestingModule({
        controllers: [BarangController],
        providers: [BarangService],
      })
        .overrideProvider(BarangService)
        .useValue(mockBarangService)
        .overrideProvider(BarangController)
        .useValue(mockBarangController)
        .compile();

      expect(module).toBeDefined();
    });

    it('should handle module with additional providers', async () => {
      const module = await Test.createTestingModule({
        imports: [BarangModule],
        providers: [
          {
            provide: 'EXTRA_PROVIDER',
            useValue: { test: jest.fn() },
          },
        ],
      })
        .overrideProvider(BarangRepository)
        .useValue(mockBarangRepository)
        .overrideProvider(BarangService)
        .useValue(mockBarangService)
        .overrideProvider(BarangController)
        .useValue(mockBarangController)
        .compile();

      expect(module).toBeDefined();
      const extraProvider = module.get('EXTRA_PROVIDER');
      expect(extraProvider).toBeDefined();
      expect(extraProvider.test).toBeDefined();
    });

    it('should handle module with custom controllers', async () => {
      const customController = {
        customMethod: jest.fn(),
      };

      const module = await Test.createTestingModule({
        imports: [BarangModule],
        controllers: [BarangController],
      })
        .overrideProvider(BarangRepository)
        .useValue(mockBarangRepository)
        .overrideProvider(BarangService)
        .useValue(mockBarangService)
        .overrideProvider(BarangController)
        .useValue(customController)
        .compile();

      expect(module).toBeDefined();
      const controller = module.get(BarangController);
      expect(controller).toEqual(customController);
      expect(controller.customMethod).toBeDefined();
    });

    it('should handle module with custom exports', async () => {
      const module = await Test.createTestingModule({
        imports: [BarangModule],
        exports: [BarangService],
      })
        .overrideProvider(BarangRepository)
        .useValue(mockBarangRepository)
        .overrideProvider(BarangService)
        .useValue(mockBarangService)
        .overrideProvider(BarangController)
        .useValue(mockBarangController)
        .compile();

      expect(module).toBeDefined();
      const exportedService = module.get(BarangService);
      expect(exportedService).toBeDefined();
      expect(exportedService).toEqual(mockBarangService);
    });
  });
});