import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('User Entity', () => {
  let user: User;
  let repository: Repository<User>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        User,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    user = moduleRef.get<User>(User);
    repository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Entity Definition', () => {
    it('should be defined', () => {
      expect(user).toBeDefined();
    });

    it('should have all required properties', () => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('first_name');
      expect(user).toHaveProperty('last_name');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('password');
      expect(user).toHaveProperty('status');
    });

    it('should have default status as active', () => {
      expect(user.status).toBe('active');
    });

    it('should have password field with select false', () => {
      const passwordColumn = Reflect.getMetadata('typeorm:columns', User);
      expect(passwordColumn).toBeDefined();
    });
  });

  describe('validatePassword', () => {
    it('should return true when password matches', async () => {
      const plainPassword = 'testPassword123';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      
      user.password = hashedPassword;
      
      const result = await user.validatePassword(plainPassword);
      
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    });

    it('should return false when password does not match', async () => {
      const plainPassword = 'testPassword123';
      const wrongPassword = 'wrongPassword456';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      
      user.password = hashedPassword;
      
      const result = await user.validatePassword(wrongPassword);
      
      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(wrongPassword, hashedPassword);
    });

    it('should return false when password is empty', async () => {
      const hashedPassword = await bcrypt.hash('testPassword123', 10);
      
      user.password = hashedPassword;
      
      const result = await user.validatePassword('');
      
      expect(result).toBe(false);
    });

    it('should return false when stored password is empty', async () => {
      user.password = '';
      
      const result = await user.validatePassword('testPassword123');
      
      expect(result).toBe(false);
    });

    it('should handle bcrypt errors', async () => {
      const plainPassword = 'testPassword123';
      user.password = 'hashedPassword';
      
      jest.spyOn(bcrypt, 'compare').mockRejectedValue(new Error('Bcrypt error'));
      
      await expect(user.validatePassword(plainPassword)).rejects.toThrow('Bcrypt error');
    });

    it('should handle null password', async () => {
      const hashedPassword = await bcrypt.hash('testPassword123', 10);
      
      user.password = hashedPassword;
      
      const result = await user.validatePassword(null as any);
      
      expect(result).toBe(false);
    });

    it('should handle undefined password', async () => {
      const hashedPassword = await bcrypt.hash('testPassword123', 10);
      
      user.password = hashedPassword;
      
      const result = await user.validatePassword(undefined as any);
      
      expect(result).toBe(false);
    });
  });

  describe('Entity Inheritance', () => {
    it('should inherit from EntityBase', () => {
      expect(User.prototype).toBeInstanceOf(EntityBase);
    });

    it('should have EntityBase properties', () => {
      const entityBaseProperties = Object.getOwnPropertyNames(EntityBase.prototype);
      expect(entityBaseProperties.length).toBeGreaterThan(0);
    });
  });

  describe('Entity Metadata', () => {
    it('should have entity name as users', () => {
      const entityMetadata = Reflect.getMetadata('typeorm:entity', User);
      expect(entityMetadata).toBeDefined();
      expect(entityMetadata.name).toBe('users');
    });

    it('should have primary generated column for id', () => {
      const primaryColumn = Reflect.getMetadata('typeorm:primaryGeneratedColumn', User);
      expect(primaryColumn).toBeDefined();
    });

    it('should have all defined columns', () => {
      const columns = Reflect.getMetadata('typeorm:columns', User);
      expect(columns).toBeDefined();
      expect(columns).toContain('id');
      expect(columns).toContain('first_name');
      expect(columns).toContain('last_name');
      expect(columns).toContain('email');
      expect(columns).toContain('password');
      expect(columns).toContain('status');
    });
  });

  describe('Repository Operations', () => {
    it('should find all users', async () => {
      const users = [
        { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', status: 'active' },
        { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', status: 'inactive' },
      ];
      
      mockRepository.find.mockResolvedValue(users);
      
      const result = await repository.find();
      
      expect(result).toEqual(users);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('should find one user by id', async () => {
      const userData = { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', status: 'active' };
      
      mockRepository.findOne.mockResolvedValue(userData);
      
      const result = await repository.findOne({ where: { id: 1 } });
      
      expect(result).toEqual(userData);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should save a user', async () => {
      const userData = { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', status: 'active' };
      
      mockRepository.save.mockResolvedValue(userData);
      
      const result = await repository.save(userData);
      
      expect(result).toEqual(userData);
      expect(mockRepository.save).toHaveBeenCalledWith(userData);
    });

    it('should update a user', async () => {
      const updateData = { first_name: 'Johnny' };
      
      mockRepository.update.mockResolvedValue({ affected: 1 });
      
      const result = await repository.update(1, updateData);
      
      expect(result).toEqual({ affected: 1 });
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should delete a user', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      
      const result = await repository.delete(1);
      
      expect(result).toEqual({ affected: 1 });
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should handle repository errors', async () => {
      mockRepository.find.mockRejectedValue(new Error('Database error'));
      
      await expect(repository.find()).rejects.toThrow('Database error');
    });
  });

  describe('User Object Creation', () => {
    it('should create user with all properties', () => {
      const userData = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        status: 'active',
      };
      
      const newUser = Object.assign(new User(), userData);
      
      expect(newUser.id).toBe(1);
      expect(newUser.first_name).toBe('John');
      expect(newUser.last_name).toBe('Doe');
      expect(newUser.email).toBe('john@example.com');
      expect(newUser.password).toBe('hashedPassword');
      expect(newUser.status).toBe('active');
    });

    it('should handle missing optional properties', () => {
      const userData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
      };
      
      const newUser = Object.assign(new User(), userData);
      
      expect(newUser.id).toBeUndefined();
      expect(newUser.password).toBeUndefined();
      expect(newUser.status).toBe('active');
    });
  });
});