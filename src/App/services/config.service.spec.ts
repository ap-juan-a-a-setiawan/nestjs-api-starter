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
            DB_PASSWORD: 'testpass',
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
        it('should return the value when key exists', () => {
            const result = (configService as any).getValue('PORT');
            expect(result).toBe('3000');
        });

        it('should throw error when key is missing and throwOnMissing is true', () => {
            expect(() => (configService as any).getValue('MISSING_KEY')).toThrow(
                'Config error missing env MISSING_KEY.'
            );
        });

        it('should return undefined when key is missing and throwOnMissing is false', () => {
            const result = (configService as any).getValue('MISSING_KEY', false);
            expect(result).toBeUndefined();
        });

        it('should return empty string when value is empty string', () => {
            mockEnv.EMPTY_KEY = '';
            const result = (configService as any).getValue('EMPTY_KEY');
            expect(result).toBe('');
        });

        it('should return undefined when value is undefined and throwOnMissing is false', () => {
            mockEnv.UNDEFINED_KEY = undefined;
            const result = (configService as any).getValue('UNDEFINED_KEY', false);
            expect(result).toBeUndefined();
        });
    });

    describe('getPort', () => {
        it('should return the port value', () => {
            const result = configService.getPort();
            expect(result).toBe('3000');
        });

        it('should throw error when PORT is missing', () => {
            delete mockEnv.PORT;
            expect(() => configService.getPort()).toThrow('Config error missing env PORT.');
        });
    });

    describe('isProduction', () => {
        it('should return false when MODE is DEV', () => {
            mockEnv.MODE = 'DEV';
            const result = configService.isProduction();
            expect(result).toBe(false);
        });

        it('should return true when MODE is not DEV', () => {
            mockEnv.MODE = 'PRODUCTION';
            const result = configService.isProduction();
            expect(result).toBe(true);
        });

        it('should return true when MODE is missing', () => {
            delete mockEnv.MODE;
            const result = configService.isProduction();
            expect(result).toBe(true);
        });

        it('should return true when MODE is empty string', () => {
            mockEnv.MODE = '';
            const result = configService.isProduction();
            expect(result).toBe(true);
        });

        it('should return true when MODE is lowercase dev', () => {
            mockEnv.MODE = 'dev';
            const result = configService.isProduction();
            expect(result).toBe(true);
        });
    });

    describe('getTypeOrmConfig', () => {
        it('should return correct TypeORM configuration', () => {
            const result = configService.getTypeOrmConfig();
            
            expect(result).toEqual({
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'testuser',
                password: 'testpass',
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

        it('should parse DB_PORT as integer', () => {
            mockEnv.DB_PORT = '3307';
            const result = configService.getTypeOrmConfig();
            expect(result.port).toBe(3307);
        });

        it('should set ssl to true when in production mode', () => {
            mockEnv.MODE = 'PRODUCTION';
            const result = configService.getTypeOrmConfig();
            expect(result.ssl).toBe(true);
        });

        it('should set ssl to false when in development mode', () => {
            mockEnv.MODE = 'DEV';
            const result = configService.getTypeOrmConfig();
            expect(result.ssl).toBe(false);
        });

        it('should throw error when DB_HOST is missing', () => {
            delete mockEnv.DB_HOST;
            expect(() => configService.getTypeOrmConfig()).toThrow(
                'Config error missing env DB_HOST.'
            );
        });

        it('should throw error when DB_PORT is missing', () => {
            delete mockEnv.DB_PORT;
            expect(() => configService.getTypeOrmConfig()).toThrow(
                'Config error missing env DB_PORT.'
            );
        });

        it('should throw error when DB_USERNAME is missing', () => {
            delete mockEnv.DB_USERNAME;
            expect(() => configService.getTypeOrmConfig()).toThrow(
                'Config error missing env DB_USERNAME.'
            );
        });

        it('should throw error when DB_PASSWORD is missing', () => {
            delete mockEnv.DB_PASSWORD;
            expect(() => configService.getTypeOrmConfig()).toThrow(
                'Config error missing env DB_PASSWORD.'
            );
        });

        it('should throw error when DB_DATABASE is missing', () => {
            delete mockEnv.DB_DATABASE;
            expect(() => configService.getTypeOrmConfig()).toThrow(
                'Config error missing env DB_DATABASE.'
            );
        });

        it('should handle invalid DB_PORT gracefully', () => {
            mockEnv.DB_PORT = 'invalid';
            const result = configService.getTypeOrmConfig();
            expect(result.port).toBeNaN();
        });

        it('should handle empty DB_PORT', () => {
            mockEnv.DB_PORT = '';
            const result = configService.getTypeOrmConfig();
            expect(result.port).toBe(0);
        });
    });

    describe('configService singleton', () => {
        it('should be exported as a singleton instance', () => {
            const { configService: exportedConfigService } = require('../src/App/services/config.service');
            expect(exportedConfigService).toBeInstanceOf(ConfigService);
        });

        it('should have process.env as its environment', () => {
            const { configService: exportedConfigService } = require('../src/App/services/config.service');
            expect((exportedConfigService as any).env).toBe(process.env);
        });
    });
});