import { Test } from '@nestjs/testing';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '../src/App/services/config.service';

describe('ConfigService', () => {
  let configService: ConfigService;
  let mockEnv: { [k: string]: string | undefined };

  beforeEach(() => {
    mockEnv = {};
    configService = new ConfigService(mockEnv);
  });

  describe('getValue', () => {
    it('should return the value when it exists', () => {
      mockEnv['TEST_KEY'] = 'test-value';
      const result = (configService as any).getValue('TEST_KEY');
      expect(result).toBe('test-value');
    });

    it('should throw an error when value is missing and throwOnMissing is true', () => {
      expect(() => (configService as any).getValue('MISSING_KEY')).toThrow(
        'Config error missing env MISSING_KEY.'
      );
    });

    it('should return undefined when value is missing and throwOnMissing is false', () => {
      const result = (configService as any).getValue('MISSING_KEY', false);
      expect(result).toBeUndefined();
    });

    it('should return empty string when value is empty string', () => {
      mockEnv['EMPTY_KEY'] = '';
      const result = (configService as any).getValue('EMPTY_KEY');
      expect(result).toBe('');
    });

    it('should return undefined when value is undefined and throwOnMissing is false', () => {
      mockEnv['UNDEFINED_KEY'] = undefined;
      const result = (configService as any).getValue('UNDEFINED_KEY', false);
      expect(result).toBeUndefined();
    });
  });

  describe('getPort', () => {
    it('should return the port value', () => {
      mockEnv['PORT'] = '3000';
      const result = configService.getPort();
      expect(result).toBe('3000');
    });

    it('should throw an error when PORT is missing', () => {
      expect(() => configService.getPort()).toThrow(
        'Config error missing env PORT.'
      );
    });
  });

  describe('isProduction', () => {
    it('should return true when MODE is not DEV', () => {
      mockEnv['MODE'] = 'PRODUCTION';
      const result = configService.isProduction();
      expect(result).toBe(true);
    });

    it('should return false when MODE is DEV', () => {
      mockEnv['MODE'] = 'DEV';
      const result = configService.isProduction();
      expect(result).toBe(false);
    });

    it('should return true when MODE is missing', () => {
      const result = configService.isProduction();
      expect(result).toBe(true);
    });

    it('should return true when MODE is empty string', () => {
      mockEnv['MODE'] = '';
      const result = configService.isProduction();
      expect(result).toBe(true);
    });
  });

  describe('getTypeOrmConfig', () => {
    beforeEach(() => {
      mockEnv['DB_HOST'] = 'localhost';
      mockEnv['DB_PORT'] = '3306';
      mockEnv['DB_USERNAME'] = 'root';
      mockEnv['DB_PASSWORD'] = 'password';
      mockEnv['DB_DATABASE'] = 'test_db';
    });

    it('should return the correct TypeORM configuration', () => {
      const result = configService.getTypeOrmConfig();
      
      expect(result).toEqual({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'password',
        database: 'test_db',
        entities: ["**/*.entity{.ts,.js}"],
        migrationsTableName: 'migrations',
        migrations: ['src/App/migrations/*.ts'],
        cli: {
          migrationsDir: 'src/App/migrations',
        },
        ssl: true
      });
    });

    it('should parse DB_PORT as an integer', () => {
      mockEnv['DB_PORT'] = '3307';
      const result = configService.getTypeOrmConfig();
      expect(result.port).toBe(3307);
    });

    it('should set ssl to false when MODE is DEV', () => {
      mockEnv['MODE'] = 'DEV';
      const result = configService.getTypeOrmConfig();
      expect(result.ssl).toBe(false);
    });

    it('should set ssl to true when MODE is not DEV', () => {
      mockEnv['MODE'] = 'PRODUCTION';
      const result = configService.getTypeOrmConfig();
      expect(result.ssl).toBe(true);
    });

    it('should throw an error when DB_HOST is missing', () => {
      delete mockEnv['DB_HOST'];
      expect(() => configService.getTypeOrmConfig()).toThrow(
        'Config error missing env DB_HOST.'
      );
    });

    it('should throw an error when DB_PORT is missing', () => {
      delete mockEnv['DB_PORT'];
      expect(() => configService.getTypeOrmConfig()).toThrow(
        'Config error missing env DB_PORT.'
      );
    });

    it('should throw an error when DB_USERNAME is missing', () => {
      delete mockEnv['DB_USERNAME'];
      expect(() => configService.getTypeOrmConfig()).toThrow(
        'Config error missing env DB_USERNAME.'
      );
    });

    it('should throw an error when DB_PASSWORD is missing', () => {
      delete mockEnv['DB_PASSWORD'];
      expect(() => configService.getTypeOrmConfig()).toThrow(
        'Config error missing env DB_PASSWORD.'
      );
    });

    it('should throw an error when DB_DATABASE is missing', () => {
      delete mockEnv['DB_DATABASE'];
      expect(() => configService.getTypeOrmConfig()).toThrow(
        'Config error missing env DB_DATABASE.'
      );
    });

    it('should handle non-numeric DB_PORT', () => {
      mockEnv['DB_PORT'] = 'not-a-number';
      const result = configService.getTypeOrmConfig();
      expect(result.port).toBeNaN();
    });
  });

  describe('exported configService', () => {
    it('should be an instance of ConfigService', () => {
      const { configService: exportedService } = require('../src/App/services/config.service');
      expect(exportedService).toBeInstanceOf(ConfigService);
    });

    it('should have process.env as its environment', () => {
      const { configService: exportedService } = require('../src/App/services/config.service');
      expect((exportedService as any).env).toBe(process.env);
    });
  });
});