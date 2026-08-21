typescript
import { Test, TestingModule } from '@nestjs/testing';
import { configService } from './config.service';

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

const ENV_KEYS = ['PORT', 'MODE', 'DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE'];

function setEnv(env: { [key: string]: string | undefined }): void {
  ENV_KEYS.forEach((key) => delete process.env[key]);
  Object.entries(env).forEach(([key, value]) => {
    if (value !== undefined) {
      process.env[key] = value;
    }
  });
}

describe('ConfigService', () => {
  let testingModule: TestingModule;
  let service: typeof configService;

  beforeEach(async () => {
    setEnv({
      PORT: '3000',
      MODE: 'DEV',
      DB_HOST: 'localhost',
      DB_PORT: '3306',
      DB_USERNAME: 'user',
      DB_PASSWORD: 'password',
      DB_DATABASE: 'test_db',
    });

    testingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'ConfigService',
          useValue: configService,
        },
      ],
    }).compile();

    service = testingModule.get<typeof configService>('ConfigService');
  });

  describe('getPort', () => {
    it('should return the port from environment variables', () => {
      setEnv({ PORT: '8080' });

      expect(service.getPort()).toBe('8080');
    });

    it('should throw an error if PORT is missing', () => {
      setEnv({});

      expect(() => service.getPort()).toThrow('Config error missing env PORT.');
    });

    it('should throw an error if PORT is an empty string', () => {
      setEnv({ PORT: '' });

      expect(() => service.getPort()).toThrow('Config error missing env PORT.');
    });
  });

  describe('isProduction', () => {
    it('should return false when MODE is DEV', () => {
      setEnv({ MODE: 'DEV' });

      expect(service.isProduction()).toBe(false);
    });

    it('should return true when MODE is PROD', () => {
      setEnv({ MODE: 'PROD' });

      expect(service.isProduction()).toBe(true);
    });

    it('should return true when MODE is missing', () => {
      setEnv({});

      expect(service.isProduction()).toBe(true);
    });

    it('should return true for lowercase dev because comparison is case-sensitive', () => {
      setEnv({ MODE: 'dev' });

      expect(service.isProduction()).toBe(true);
    });

    it('should return true when MODE is an empty string', () => {
      setEnv({ MODE: '' });

      expect(service.isProduction()).toBe(true);
    });
  });

  describe('getTypeOrmConfig', () => {
    it('should return a TypeORM configuration with the expected values', () => {
      setEnv({
        MODE: 'PROD',
        DB_HOST: 'db.example.com',
        DB_PORT: '5432',
        DB_USERNAME: 'admin',
        DB_PASSWORD: 'secret',
        DB_DATABASE: 'mydb',
      });

      expect(service.getTypeOrmConfig()).toEqual({
        type: 'mysql',
        host: 'db.example.com',
        port: 5432,
        username: 'admin',
        password: 'secret',
        database: 'mydb',
        entities: ['**/*.entity{.ts,.js}'],
        migrationsTableName: 'migrations',
        migrations: ['src/App/migrations/*.ts'],
        cli: {
          migrationsDir: 'src/App/migrations',
        },
        ssl: true,
      });
    });

    it('should set ssl to false when MODE is DEV', () => {
      setEnv({
        MODE: 'DEV',
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_DATABASE: 'db',
      });

      expect(service.getTypeOrmConfig().ssl).toBe(false);
    });

    it('should parse DB_PORT as a number', () => {
      setEnv({
        DB_HOST: 'localhost',
        DB_PORT: '3307',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_DATABASE: 'db',
      });

      expect(service.getTypeOrmConfig().port).toBe(3307);
    });

    it('should return NaN for non-numeric DB_PORT', () => {
      setEnv({
        DB_HOST: 'localhost',
        DB_PORT: 'abc',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_DATABASE: 'db',
      });

      const config = service.getTypeOrmConfig();

      expect(Number.isNaN(config.port)).toBe(true);
    });

    it('should throw an error if DB_HOST is missing', () => {
      setEnv({
        DB_PORT: '3306',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_DATABASE: 'db',
      });

      expect(() => service.getTypeOrmConfig()).toThrow(
        'Config error missing env DB_HOST.',
      );
    });

    it('should throw an error if DB_PORT is missing', () => {
      setEnv({
        DB_HOST: 'localhost',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_DATABASE: 'db',
      });

      expect(() => service.getTypeOrmConfig()).toThrow(
        'Config error missing env DB_PORT.',
      );
    });

    it('should throw an error if DB_USERNAME is missing', () => {
      setEnv({
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_PASSWORD: 'pass',
        DB_DATABASE: 'db',
      });

      expect(() => service.getTypeOrmConfig()).toThrow(
        'Config error missing env DB_USERNAME.',
      );
    });

    it('should throw an error if DB_PASSWORD is missing', () => {
      setEnv({
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_USERNAME: 'user',
        DB_DATABASE: 'db',
      });

      expect(() => service.getTypeOrmConfig()).toThrow(
        'Config error missing env DB_PASSWORD.',
      );
    });

    it('should throw an error if DB_DATABASE is missing', () => {
      setEnv({
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
      });

      expect(() => service.getTypeOrmConfig()).toThrow(
        'Config error missing env DB_DATABASE.',
      );
    });
  });
});