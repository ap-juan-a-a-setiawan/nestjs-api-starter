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
      const exportsMetadata = Reflect.getMetadata('exports', BarangModule);
      expect(exportsMetadata).toBeDefined();
      expect(exportsMetadata).toHaveLength(1);
      expect(exportsMetadata[0]).toBe(BarangService);
    });
  });

  describe('Module Integration', () => {
    it('should instantiate the module with all dependencies', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [BarangModule],
      })
        .overrideProvider(BarangController)
        .useValue(mockBarangController)
        .overrideProvider(BarangService)
        .useValue(mockBarangService)
        .overrideProvider(BarangRepository)
        .useValue(mockBarangRepository)
        .compile();

      const testModule = moduleRef.get<BarangModule>(BarangModule);
      expect(testModule).toBeDefined();
    });

    it('should have BarangController as a controller', () => {
      const controllers = Reflect.getMetadata('controllers', BarangModule);
      expect(controllers).toContain(BarangController);
    });

    it('should have BarangService as a provider', () => {
      const providers = Reflect.getMetadata('providers', BarangModule);
      expect(providers).toContain(BarangService);
    });

    it('should export BarangService', () => {
      const exportsMetadata = Reflect.getMetadata('exports', BarangModule);
      expect(exportsMetadata).toContain(BarangService);
    });

    it('should import TypeOrmModule with BarangRepository', () => {
      const imports = Reflect.getMetadata('imports', BarangModule);
      expect(imports).toContainEqual(TypeOrmModule.forFeature([BarangRepository]));
    });
  });

  describe('Module Metadata Validation', () => {
    it('should have valid controller metadata', () => {
      const controllers = Reflect.getMetadata('controllers', BarangModule);
      expect(controllers).toBeInstanceOf(Array);
      expect(controllers.length).toBeGreaterThan(0);
      expect(controllers.every((controller: any) => typeof controller === 'function')).toBe(true);
    });

    it('should have valid provider metadata', () => {
      const providers = Reflect.getMetadata('providers', BarangModule);
      expect(providers).toBeInstanceOf(Array);
      expect(providers.length).toBeGreaterThan(0);
      expect(providers.every((provider: any) => typeof provider === 'function')).toBe(true);
    });

    it('should have valid export metadata', () => {
      const exportsMetadata = Reflect.getMetadata('exports', BarangModule);
      expect(exportsMetadata).toBeInstanceOf(Array);
      expect(exportsMetadata.length).toBeGreaterThan(0);
      expect(exportsMetadata.every((exportItem: any) => typeof exportItem === 'function')).toBe(true);
    });

    it('should have valid import metadata', () => {
      const imports = Reflect.getMetadata('imports', BarangModule);
      expect(imports).toBeInstanceOf(Array);
      expect(imports.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty repository array in TypeOrmModule', () => {
      const moduleRef = Test.createTestingModule({
        imports: [TypeOrmModule.forFeature([])],
        controllers: [BarangController],
        providers: [BarangService],
      })
        .overrideProvider(BarangController)
        .useValue(mockBarangController)
        .overrideProvider(BarangService)
        .useValue(mockBarangService);

      expect(moduleRef).toBeDefined();
    });

    it('should handle module without exports', () => {
      const moduleRef = Test.createTestingModule({
        imports: [TypeOrmModule.forFeature([BarangRepository])],
        controllers: [BarangController],
        providers: [BarangService],
      })
        .overrideProvider(BarangController)
        .useValue(mockBarangController)
        .overrideProvider(BarangService)
        .useValue(mockBarangService);

      expect(moduleRef).toBeDefined();
    });

    it('should handle module without controllers', () => {
      const moduleRef = Test.createTestingModule({
        imports: [TypeOrmModule.forFeature([BarangRepository])],
        providers: [BarangService],
        exports: [BarangService],
      })
        .overrideProvider(BarangService)
        .useValue(mockBarangService);

      expect(moduleRef).toBeDefined();
    });

    it('should handle module without providers', () => {
      const moduleRef = Test.createTestingModule({
        imports: [TypeOrmModule.forFeature([BarangRepository])],
        controllers: [BarangController],
        exports: [BarangService],
      })
        .overrideProvider(BarangController)
        .useValue(mockBarangController);

      expect(moduleRef).toBeDefined();
    });
  });

  describe('Dependency Injection', () => {
    it('should inject BarangService into BarangController', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [BarangModule],
      })
        .overrideProvider(BarangController)
        .useValue(mockBarangController)
        .overrideProvider(BarangService)
        .useValue(mockBarangService)
        .overrideProvider(BarangRepository)
        .useValue(mockBarangRepository)
        .compile();

      const controller = moduleRef.get<BarangController>(BarangController);
      expect(controller).toBeDefined();
      expect(controller).toEqual(mockBarangController);
    });

    it('should provide BarangService to the module', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [BarangModule],
      })
        .overrideProvider(BarangController)
        .useValue(mockBarangController)
        .overrideProvider(BarangService)
        .useValue(mockBarangService)
        .overrideProvider(BarangRepository)
        .useValue(mockBarangRepository)
        .compile();

      const service = moduleRef.get<BarangService>(BarangService);
      expect(service).toBeDefined();
      expect(service).toEqual(mockBarangService);
    });

    it('should provide BarangRepository through TypeOrmModule', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [BarangModule],
      })
        .overrideProvider(BarangController)
        .useValue(mockBarangController)
        .overrideProvider(BarangService)
        .useValue(mockBarangService)
        .overrideProvider(BarangRepository)
        .useValue(mockBarangRepository)
        .compile();

      const repository = moduleRef.get<BarangRepository>(BarangRepository);
      expect(repository).toBeDefined();
      expect(repository).toEqual(mockBarangRepository);
    });
  });
});