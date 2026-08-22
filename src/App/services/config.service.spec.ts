import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { configService } from './config.service';

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

jest.mock('@nestjs/typeorm', () => ({
  TypeOrmModuleOptions: jest.fn(),
}));

const ConfigService = configService.constructor as any;
const CONFIG_SERVICE = 'CONFIG_SERVICE';

describe('ConfigService', () => {
  let service: any;

  const createService = async (env: Record<string, string | undefined>) => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: CONFIG_SERVICE,
          useFactory: () => new ConfigService(env),
        },
      ],
    }).compile();

    return moduleRef.get(CONFIG_SERVICE);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPort', () => {
    it('should return the PORT value', async () => {
      service = await createService({ PORT: '3000' });
      expect(service.getPort()).toBe('3000');
    });

    it('should throw if PORT is missing', async () => {
      service = await createService({});
      expect(() => service.getPort()).toThrow('Config error missing env PORT.');
    });

    it('should throw if PORT is an empty string', async () => {
      service = await createService({ PORT: '' });
      expect(() => service.getPort()).toThrow('Config error missing env PORT.');
    });
  });

  describe('isProduction', () => {
    it('should return false when MODE is DEV', async () => {
      service = await createService({ MODE: 'DEV' });
      expect(service.isProduction()).toBe(false);
    });

    it('should return true when MODE is not DEV', async () => {
      service = await createService({ MODE: 'PROD' });
      expect(service.isProduction()).toBe(true);
    });

    it('should return true when MODE is missing', async () => {
      service = await createService({});
      expect(service.isProduction()).toBe(true);
    });

    it('should return true when MODE is lowercase dev', async () => {
      service = await createService({ MODE: 'dev' });
      expect(service.isProduction()).toBe(true);
    });

    it('should return true when MODE is an empty string', async () => {
      service = await createService({ MODE: '' });
      expect(service.isProduction()).toBe(true);
    });
  });

  describe('getTypeOrmConfig', () => {
    it('should return the TypeORM config with ssl true in production', async () => {
      service = await createService({
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_DATABASE: 'db',
        MODE: 'PROD',
      });

      expect(service.getTypeOrmConfig()).toEqual({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'user',
        password: 'pass',
        database: 'db',
        entities: ["**/*.entity{.ts,.js}"],
        migrationsTableName: 'migrations',
        migrations: ['src/App/migrations/*.ts'],
        cli: {
          migrationsDir: 'src/App/migrations',
        },
        ssl: true,
      });
    });

    it('should return ssl false when MODE is DEV', async () => {
      service = await createService({
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_DATABASE: 'db',
        MODE: 'DEV',
      });

      expect(service.getTypeOrmConfig().ssl).toBe(false);
    });

    it('should default ssl to true when MODE is missing', async () => {
      service = await createService({
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_DATABASE: 'db',
      });

      expect(service.getTypeOrmConfig().ssl).toBe(true);
    });

    it('should parse DB_PORT as an integer', async () => {
      service = await createService({
        DB_HOST: 'localhost',
        DB_PORT: '3307',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_DATABASE: 'db',
      });

      const config = service.getTypeOrmConfig();
      expect(config.port).toBe(3307);
      expect(typeof config.port).toBe('number');
    });

    it('should return NaN for non-numeric DB_PORT', async () => {
      service = await createService({
        DB_HOST: 'localhost',
        DB_PORT: 'abc',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_DATABASE: 'db',
      });

      expect(service.getTypeOrmConfig().port).toBeNaN();
    });

    it('should throw if DB_HOST is missing', async () => {
      service = await createService({
        DB_PORT: '3306',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_DATABASE: 'db',
      });

      expect(() => service.getTypeOrmConfig()).toThrow('Config error missing env DB_HOST.');
    });

    it('should throw if DB_HOST is an empty string', async () => {
      service = await createService({
        DB_HOST: '',
        DB_PORT: '3306',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_DATABASE: 'db',
      });

      expect(() => service.getTypeOrmConfig()).toThrow('Config error missing env DB_HOST.');
    });

    it('should throw if DB_PORT is missing', async () => {
      service = await createService({
        DB_HOST: 'localhost',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_DATABASE: 'db',
      });

      expect(() => service.getTypeOrmConfig()).toThrow('Config error missing env DB_PORT.');
    });

    it('should throw if DB_PORT is an empty string', async () => {
      service = await createService({
        DB_HOST: 'localhost',
        DB_PORT: '',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_DATABASE: 'db',
      });

      expect(() => service.getTypeOrmConfig()).toThrow('Config error missing env DB_PORT.');
    });

    it('should throw if DB_USERNAME is missing', async () => {
      service = await createService({
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_PASSWORD: 'pass',
        DB_DATABASE: 'db',
      });

      expect(() => service.getTypeOrmConfig()).toThrow('Config error missing env DB_USERNAME.');
    });

    it('should throw if DB_USERNAME is an empty string', async () => {
      service = await createService({
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_USERNAME: '',
        DB_PASSWORD: 'pass',
        DB_DATABASE: 'db',
      });

      expect(() => service.getTypeOrmConfig()).toThrow('Config error missing env DB_USERNAME.');
    });

    it('should throw if DB_PASSWORD is missing', async () => {
      service = await createService({
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_USERNAME: 'user',
        DB_DATABASE: 'db',
      });

      expect(() => service.getTypeOrmConfig()).toThrow('Config error missing env DB_PASSWORD.');
    });

    it('should throw if DB_PASSWORD is an empty string', async () => {
      service = await createService({
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_USERNAME: 'user',
        DB_PASSWORD: '',
        DB_DATABASE: 'db',
      });

      expect(() => service.getTypeOrmConfig()).toThrow('Config error missing env DB_PASSWORD.');
    });

    it('should throw if DB_DATABASE is missing', async () => {
      service = await createService({
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
      });

      expect(() => service.getTypeOrmConfig()).toThrow('Config error missing env DB_DATABASE.');
    });

    it('should throw if DB_DATABASE is an empty string', async () => {
      service = await createService({
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_DATABASE: '',
      });

      expect(() => service.getTypeOrmConfig()).toThrow('Config error missing env DB_DATABASE.');
    });
  });

  describe('exported configService', () => {
    it('should be an instance of ConfigService', () => {
      expect(configService).toBeInstanceOf(ConfigService);
    });
  });
});