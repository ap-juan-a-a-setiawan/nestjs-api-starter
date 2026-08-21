typescript
import { Test } from '@nestjs/testing';
import { configService } from './config.service';

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('ConfigService', () => {
  let service: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: 'CONFIG_SERVICE',
          useValue: configService,
        },
      ],
    }).compile();

    service = moduleRef.get('CONFIG_SERVICE');
  });

  afterEach(() => {
    delete process.env.PORT;
    delete process.env.MODE;
    delete process.env.DB_HOST;
    delete process.env.DB_PORT;
    delete process.env.DB_USERNAME;
    delete process.env.DB_PASSWORD;
    delete process.env.DB_DATABASE;
    jest.clearAllMocks();
  });

  describe('getPort', () => {
    it('returns the PORT value from environment', () => {
      process.env.PORT = '8080';
      expect(service.getPort()).toBe('8080');
    });

    it('returns "0" when PORT is "0"', () => {
      process.env.PORT = '0';
      expect(service.getPort()).toBe('0');
    });

    it('throws error if PORT is missing', () => {
      delete process.env.PORT;
      expect(() => service.getPort()).toThrow('Config error missing env PORT.');
    });

    it('throws error if PORT is an empty string', () => {
      process.env.PORT = '';
      expect(() => service.getPort()).toThrow('Config error missing env PORT.');
    });
  });

  describe('isProduction', () => {
    it('returns false when MODE is DEV', () => {
      process.env.MODE = 'DEV';
      expect(service.isProduction()).toBe(false);
    });

    it('returns true when MODE is not DEV', () => {
      process.env.MODE = 'PROD';
      expect(service.isProduction()).toBe(true);
    });

    it('returns true when MODE is missing', () => {
      delete process.env.MODE;
      expect(service.isProduction()).toBe(true);
    });

    it('returns true when MODE is lowercase dev', () => {
      process.env.MODE = 'dev';
      expect(service.isProduction()).toBe(true);
    });
  });

  describe('getTypeOrmConfig', () => {
    beforeEach(() => {
      process.env.MODE = 'DEV';
      process.env.DB_HOST = 'localhost';
      process.env.DB_PORT = '3306';
      process.env.DB_USERNAME = 'root';
      process.env.DB_PASSWORD = 'secret';
      process.env.DB_DATABASE = 'test';
    });

    it('returns the mysql connection config', () => {
      expect(service.getTypeOrmConfig()).toEqual({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'secret',
        database: 'test',
        entities: ['**/*.entity{.ts,.js}'],
        migrationsTableName: 'migrations',
        migrations: ['src/App/migrations/*.ts'],
        cli: { migrationsDir: 'src/App/migrations' },
        ssl: false,
      });
    });

    it('sets ssl to true when in production', () => {
      process.env.MODE = 'PROD';
      expect(service.getTypeOrmConfig().ssl).toBe(true);
    });

    it('throws error when DB_HOST is missing', () => {
      delete process.env.DB_HOST;
      expect(() => service.getTypeOrmConfig()).toThrow(
        'Config error missing env DB_HOST.',
      );
    });

    it('throws error when DB_PORT is missing', () => {
      delete process.env.DB_PORT;
      expect(() => service.getTypeOrmConfig()).toThrow(
        'Config error missing env DB_PORT.',
      );
    });

    it('throws error when DB_USERNAME is missing', () => {
      delete process.env.DB_USERNAME;
      expect(() => service.getTypeOrmConfig()).toThrow(
        'Config error missing env DB_USERNAME.',
      );
    });

    it('throws error when DB_PASSWORD is missing', () => {
      delete process.env.DB_PASSWORD;
      expect(() => service.getTypeOrmConfig()).toThrow(
        'Config error missing env DB_PASSWORD.',
      );
    });

    it('throws error when DB_DATABASE is missing', () => {
      delete process.env.DB_DATABASE;
      expect(() => service.getTypeOrmConfig()).toThrow(
        'Config error missing env DB_DATABASE.',
      );
    });

    it('parses DB_PORT as an integer', () => {
      process.env.DB_PORT = '3307';
      expect(service.getTypeOrmConfig().port).toBe(3307);
    });

    it('returns NaN when DB_PORT is non-numeric', () => {
      process.env.DB_PORT = 'not-a-number';
      expect(service.getTypeOrmConfig().port).toBeNaN();
    });
  });
});