import { Test } from '@nestjs/testing';
import { ConfigService } from '../src/App/services/config.service';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

describe('ConfigService', () => {
  let configService: ConfigService;
  let mockEnv: { [k: string]: string | undefined };

  beforeEach(async () => {
    mockEnv = {
      PORT: '3000',
      MODE: 'DEV',
      DB_HOST: 'localhost',
      DB_PORT: '3306',
      DB_USERNAME: 'testuser',
      DB_PASSWORD: 'testpassword',
      DB_DATABASE: 'testdb'
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: new ConfigService(mockEnv)
        }
      ]
    }).compile();

    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  describe('getValue', () => {
    it('should return the value when the key exists', () => {
      const result = (configService as any).getValue('PORT');
      expect(result).toBe('3000');
    });

    it('should return undefined when the key does not exist and throwOnMissing is false', () => {
      const result = (configService as any).getValue('NON_EXISTENT_KEY', false);
      expect(result).toBeUndefined();
    });

    it('should throw an error when the key does not exist and throwOnMissing is true', () => {
      expect(() => (configService as any).getValue('NON_EXISTENT_KEY')).toThrow(
        'Config error missing env NON_EXISTENT_KEY.'
      );
    });

    it('should throw an error when the value is empty string and throwOnMissing is true', () => {
      mockEnv.EMPTY_KEY = '';
      const serviceWithEmptyKey = new ConfigService(mockEnv);
      expect(() => (serviceWithEmptyKey as any).getValue('EMPTY_KEY')).toThrow(
        'Config error missing env EMPTY_KEY.'
      );
    });

    it('should return empty string when the value is empty string and throwOnMissing is false', () => {
      mockEnv.EMPTY_KEY = '';
      const serviceWithEmptyKey = new ConfigService(mockEnv);
      const result = (serviceWithEmptyKey as any).getValue('EMPTY_KEY', false);
      expect(result).toBe('');
    });
  });

  describe('getPort', () => {
    it('should return the port from environment variables', () => {
      const result = configService.getPort();
      expect(result).toBe('3000');
    });

    it('should throw an error when PORT is not defined', () => {
      delete mockEnv.PORT;
      const serviceWithoutPort = new ConfigService(mockEnv);
      expect(() => serviceWithoutPort.getPort()).toThrow(
        'Config error missing env PORT.'
      );
    });
  });

  describe('isProduction', () => {
    it('should return false when MODE is DEV', () => {
      mockEnv.MODE = 'DEV';
      const service = new ConfigService(mockEnv);
      expect(service.isProduction()).toBe(false);
    });

    it('should return true when MODE is not DEV', () => {
      mockEnv.MODE = 'PRODUCTION';
      const service = new ConfigService(mockEnv);
      expect(service.isProduction()).toBe(true);
    });

    it('should return true when MODE is undefined', () => {
      delete mockEnv.MODE;
      const service = new ConfigService(mockEnv);
      expect(service.isProduction()).toBe(true);
    });

    it('should return true when MODE is empty string', () => {
      mockEnv.MODE = '';
      const service = new ConfigService(mockEnv);
      expect(service.isProduction()).toBe(true);
    });
  });

  describe('getTypeOrmConfig', () => {
    it('should return the correct TypeORM configuration', () => {
      const result = configService.getTypeOrmConfig();
      
      expect(result).toEqual({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'testuser',
        password: 'testpassword',
        database: 'testdb',
        entities: ["**/*.entity{.ts,.js}"],
        migrationsTableName: 'migrations',
        migrations: ['src/App/migrations/*.ts'],
        cli: {
          migrationsDir: 'src/App/migrations',
        },
        ssl: false
      });
    });

    it('should parse DB_PORT as an integer', () => {
      mockEnv.DB_PORT = '3307';
      const service = new ConfigService(mockEnv);
      const result = service.getTypeOrmConfig();
      expect(result.port).toBe(3307);
    });

    it('should set ssl to true when in production mode', () => {
      mockEnv.MODE = 'PRODUCTION';
      const service = new ConfigService(mockEnv);
      const result = service.getTypeOrmConfig();
      expect(result.ssl).toBe(true);
    });

    it('should set ssl to false when in development mode', () => {
      mockEnv.MODE = 'DEV';
      const service = new ConfigService(mockEnv);
      const result = service.getTypeOrmConfig();
      expect(result.ssl).toBe(false);
    });

    it('should throw an error when DB_HOST is missing', () => {
      delete mockEnv.DB_HOST;
      const service = new ConfigService(mockEnv);
      expect(() => service.getTypeOrmConfig()).toThrow(
        'Config error missing env DB_HOST.'
      );
    });

    it('should throw an error when DB_PORT is missing', () => {
      delete mockEnv.DB_PORT;
      const service = new ConfigService(mockEnv);
      expect(() => service.getTypeOrmConfig()).toThrow(
        'Config error missing env DB_PORT.'
      );
    });

    it('should throw an error when DB_USERNAME is missing', () => {
      delete mockEnv.DB_USERNAME;
      const service = new ConfigService(mockEnv);
      expect(() => service.getTypeOrmConfig()).toThrow(
        'Config error missing env DB_USERNAME.'
      );
    });

    it('should throw an error when DB_PASSWORD is missing', () => {
      delete mockEnv.DB_PASSWORD;
      const service = new ConfigService(mockEnv);
      expect(() => service.getTypeOrmConfig()).toThrow(
        'Config error missing env DB_PASSWORD.'
      );
    });

    it('should throw an error when DB_DATABASE is missing', () => {
      delete mockEnv.DB_DATABASE;
      const service = new ConfigService(mockEnv);
      expect(() => service.getTypeOrmConfig()).toThrow(
        'Config error missing env DB_DATABASE.'
      );
    });

    it('should handle non-numeric DB_PORT gracefully', () => {
      mockEnv.DB_PORT = 'not-a-number';
      const service = new ConfigService(mockEnv);
      const result = service.getTypeOrmConfig();
      expect(result.port).toBeNaN();
    });
  });

  describe('configService singleton', () => {
    it('should be exported as a singleton instance', () => {
      const { configService: exportedConfigService } = require('../src/App/services/config.service');
      expect(exportedConfigService).toBeInstanceOf(ConfigService);
    });

    it('should have access to process.env', () => {
      const { configService: exportedConfigService } = require('../src/App/services/config.service');
      expect(exportedConfigService.getPort()).toBeDefined();
    });
  });
});