typescript
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

        it('should throw an error when the key is missing and throwOnMissing is true', () => {
            delete mockEnv['MISSING_KEY'];
            expect(() => (configService as any).getValue('MISSING_KEY')).toThrow(
                'Config error missing env MISSING_KEY.'
            );
        });

        it('should return undefined when the key is missing and throwOnMissing is false', () => {
            delete mockEnv['MISSING_KEY'];
            const result = (configService as any).getValue('MISSING_KEY', false);
            expect(result).toBeUndefined();
        });

        it('should return empty string when value is empty string', () => {
            mockEnv['EMPTY_KEY'] = '';
            const result = (configService as any).getValue('EMPTY_KEY');
            expect(result).toBe('');
        });

        it('should throw error when value is empty string and throwOnMissing is true', () => {
            mockEnv['EMPTY_KEY'] = '';
            expect(() => (configService as any).getValue('EMPTY_KEY')).toThrow(
                'Config error missing env EMPTY_KEY.'
            );
        });
    });

    describe('getPort', () => {
        it('should return the port from environment variables', () => {
            const result = configService.getPort();
            expect(result).toBe('3000');
        });

        it('should throw error when PORT is not set', () => {
            delete mockEnv['PORT'];
            expect(() => configService.getPort()).toThrow(
                'Config error missing env PORT.'
            );
        });
    });

    describe('isProduction', () => {
        it('should return false when MODE is DEV', () => {
            mockEnv['MODE'] = 'DEV';
            const result = configService.isProduction();
            expect(result).toBe(false);
        });

        it('should return true when MODE is not DEV', () => {
            mockEnv['MODE'] = 'PRODUCTION';
            const result = configService.isProduction();
            expect(result).toBe(true);
        });

        it('should return true when MODE is not set', () => {
            delete mockEnv['MODE'];
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

        it('should return ssl true when in production mode', () => {
            mockEnv['MODE'] = 'PRODUCTION';
            const result = configService.getTypeOrmConfig();
            expect(result.ssl).toBe(true);
        });

        it('should return ssl false when in development mode', () => {
            mockEnv['MODE'] = 'DEV';
            const result = configService.getTypeOrmConfig();
            expect(result.ssl).toBe(false);
        });

        it('should parse DB_PORT as integer', () => {
            mockEnv['DB_PORT'] = '3307';
            const result = configService.getTypeOrmConfig();
            expect(result.port).toBe(3307);
        });

        it('should throw error when DB_HOST is missing', () => {
            delete mockEnv['DB_HOST'];
            expect(() => configService.getTypeOrmConfig()).toThrow(
                'Config error missing env DB_HOST.'
            );
        });

        it('should throw error when DB_PORT is missing', () => {
            delete mockEnv['DB_PORT'];
            expect(() => configService.getTypeOrmConfig()).toThrow(
                'Config error missing env DB_PORT.'
            );
        });

        it('should throw error when DB_USERNAME is missing', () => {
            delete mockEnv['DB_USERNAME'];
            expect(() => configService.getTypeOrmConfig()).toThrow(
                'Config error missing env DB_USERNAME.'
            );
        });

        it('should throw error when DB_PASSWORD is missing', () => {
            delete mockEnv['DB_PASSWORD'];
            expect(() => configService.getTypeOrmConfig()).toThrow(
                'Config error missing env DB_PASSWORD.'
            );
        });

        it('should throw error when DB_DATABASE is missing', () => {
            delete mockEnv['DB_DATABASE'];
            expect(() => configService.getTypeOrmConfig()).toThrow(
                'Config error missing env DB_DATABASE.'
            );
        });

        it('should handle invalid DB_PORT gracefully', () => {
            mockEnv['DB_PORT'] = 'invalid';
            const result = configService.getTypeOrmConfig();
            expect(result.port).toBeNaN();
        });
    });

    describe('configService export', () => {
        it('should export a ConfigService instance', () => {
            const { configService: exportedService } = require('../src/App/services/config.service');
            expect(exportedService).toBeInstanceOf(ConfigService);
        });

        it('should have process.env as the environment', () => {
            const { configService: exportedService } = require('../src/App/services/config.service');
            expect((exportedService as any).env).toBe(process.env);
        });
    });
});