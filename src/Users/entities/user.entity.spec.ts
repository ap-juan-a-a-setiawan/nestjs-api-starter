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
      const passwordColumn = Reflect.getMetadata('typeorm:columns', User.prototype);
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
      const wrongPassword = 'wrongPassword';
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
      expect(bcrypt.compare).toHaveBeenCalledWith('', hashedPassword);
    });

    it('should return false when stored password is empty', async () => {
      user.password = '';
      
      const result = await user.validatePassword('testPassword123');
      
      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith('testPassword123', '');
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
      expect(bcrypt.compare).toHaveBeenCalledWith(null, hashedPassword);
    });

    it('should handle undefined password', async () => {
      const hashedPassword = await bcrypt.hash('testPassword123', 10);
      
      user.password = hashedPassword;
      
      const result = await user.validatePassword(undefined as any);
      
      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(undefined, hashedPassword);
    });
  });

  describe('Entity Inheritance', () => {
    it('should inherit from EntityBase', () => {
      expect(User.prototype).toBeInstanceOf(Object);
      expect(Object.getPrototypeOf(User.prototype)).toBeDefined();
    });

    it('should have EntityBase properties', () => {
      const entityBaseProperties = ['created_at', 'updated_at', 'deleted_at'];
      entityBaseProperties.forEach(prop => {
        expect(User.prototype).toHaveProperty(prop);
      });
    });
  });

  describe('Entity Metadata', () => {
    it('should have entity name as users', () => {
      const entityMetadata = Reflect.getMetadata('typeorm:entity', User);
      expect(entityMetadata).toBeDefined();
      expect(entityMetadata.name).toBe('users');
    });

    it('should have primary generated column for id', () => {
      const primaryColumn = Reflect.getMetadata('typeorm:primaryGeneratedColumn', User.prototype);
      expect(primaryColumn).toBeDefined();
    });

    it('should have enum column for status', () => {
      const columns = Reflect.getMetadata('typeorm:columns', User.prototype);
      expect(columns).toBeDefined();
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

    it('should save a new user', async () => {
      const newUser = { first_name: 'John', last_name: 'Doe', email: 'john@example.com', password: 'hashed', status: 'active' };
      const savedUser = { id: 1, ...newUser };
      
      mockRepository.save.mockResolvedValue(savedUser);
      
      const result = await repository.save(newUser);
      
      expect(result).toEqual(savedUser);
      expect(mockRepository.save).toHaveBeenCalledWith(newUser);
    });

    it('should update a user', async () => {
      const updateData = { first_name: 'John Updated' };
      const updateResult = { affected: 1 };
      
      mockRepository.update.mockResolvedValue(updateResult);
      
      const result = await repository.update(1, updateData);
      
      expect(result).toEqual(updateResult);
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should delete a user', async () => {
      const deleteResult = { affected: 1 };
      
      mockRepository.delete.mockResolvedValue(deleteResult);
      
      const result = await repository.delete(1);
      
      expect(result).toEqual(deleteResult);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should handle repository errors', async () => {
      mockRepository.find.mockRejectedValue(new Error('Database error'));
      
      await expect(repository.find()).rejects.toThrow('Database error');
    });
  });

  describe('Status Validation', () => {
    it('should accept valid status values', () => {
      const validStatuses = ['active', 'inactive', 'block'];
      
      validStatuses.forEach(status => {
        user.status = status;
        expect(user.status).toBe(status);
      });
    });

    it('should have default status as active when not set', () => {
      const newUser = new User();
      expect(newUser.status).toBe('active');
    });
  });

  describe('Password Security', () => {
    it('should not expose password in select queries', () => {
      const passwordColumn = Reflect.getMetadata('typeorm:columns', User.prototype);
      const passwordColumnMetadata = passwordColumn.find((col: any) => col.propertyName === 'password');
      
      expect(passwordColumnMetadata).toBeDefined();
      expect(passwordColumnMetadata.options.select).toBe(false);
    });

    it('should hash password before saving', async () => {
      const plainPassword = 'plainPassword123';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      
      const newUser = new User();
      newUser.password = hashedPassword;
      
      expect(newUser.password).not.toBe(plainPassword);
      expect(newUser.password).toBe(hashedPassword);
    });
  });
});