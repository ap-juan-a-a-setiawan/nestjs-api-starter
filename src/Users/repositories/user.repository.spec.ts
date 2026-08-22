typescript
import { Test } from "@nestjs/testing";
import { UserRepository } from "./user.repository";
import { RepositoryBase } from "../../App/abstracts/repository.base";

jest.mock("typeorm", () => ({
  EntityRepository: () => (target: any) => target,
}));

jest.mock("../../App/abstracts/repository.base", () => {
  return {
    RepositoryBase: class {
      find = jest.fn();
      findOne = jest.fn();
      save = jest.fn();
      delete = jest.fn();
      create = jest.fn();
      update = jest.fn();
      count = jest.fn();
    },
  };
});

jest.mock("../entities/user.entity", () => ({
  User: class {},
}));

describe("UserRepository", () => {
  let repository: UserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    repository = moduleRef.get(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  it("should be an instance of RepositoryBase", () => {
    expect(repository).toBeInstanceOf(RepositoryBase);
  });

  it("should have all base repository methods", () => {
    expect(repository.find).toBeDefined();
    expect(repository.findOne).toBeDefined();
    expect(repository.save).toBeDefined();
    expect(repository.delete).toBeDefined();
    expect(repository.create).toBeDefined();
    expect(repository.update).toBeDefined();
    expect(repository.count).toBeDefined();
  });

  describe("find", () => {
    it("should return an array of users", async () => {
      const users = [{ id: 1, email: "test@example.com" }];
      (repository.find as jest.Mock).mockResolvedValue(users);

      const result = await repository.find();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it("should return an empty array when no users exist", async () => {
      (repository.find as jest.Mock).mockResolvedValue([]);

      const result = await repository.find();

      expect(result).toEqual([]);
    });

    it("should pass options to the base find method", async () => {
      const options = { where: { active: true } };
      (repository.find as jest.Mock).mockResolvedValue([]);

      await repository.find(options);

      expect(repository.find).toHaveBeenCalledWith(options);
    });
  });

  describe("findOne", () => {
    it("should return a user when found", async () => {
      const user = { id: 1, email: "test@example.com" };
      (repository.findOne as jest.Mock).mockResolvedValue(user);

      const result = await repository.findOne({ where: { id: 1 } });

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(user);
    });

    it("should return null when user is not found", async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await repository.findOne({ where: { id: 999 } });

      expect(result).toBeNull();
    });
  });

  describe("save", () => {
    it("should save a user and return the saved entity", async () => {
      const user = { id: 1, email: "test@example.com" };
      (repository.save as jest.Mock).mockResolvedValue(user);

      const result = await repository.save(user);

      expect(repository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });

    it("should propagate errors from the database", async () => {
      const error = new Error("Database error");
      (repository.save as jest.Mock).mockRejectedValue(error);

      await expect(repository.save({})).rejects.toThrow("Database error");
    });
  });

  describe("delete", () => {
    it("should delete a user by id", async () => {
      const deleteResult = { affected: 1 };
      (repository.delete as jest.Mock).mockResolvedValue(deleteResult);

      const result = await repository.delete(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(deleteResult);
    });

    it("should handle delete when no rows affected", async () => {
      (repository.delete as jest.Mock).mockResolvedValue({ affected: 0 });

      const result = await repository.delete(999);

      expect(result.affected).toBe(0);
    });
  });

  describe("create", () => {
    it("should create a new user instance", () => {
      const userData = { email: "new@example.com" };
      const newUser = { id: 2, ...userData };
      (repository.create as jest.Mock).mockReturnValue(newUser);

      const result = repository.create(userData);

      expect(repository.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(newUser);
    });
  });

  describe("update", () => {
    it("should update a user and return the update result", async () => {
      const updateResult = { affected: 1, raw: {} };
      (repository.update as jest.Mock).mockResolvedValue(updateResult);

      const result = await repository.update(1, { email: "updated@example.com" });

      expect(repository.update).toHaveBeenCalledWith(1, { email: "updated@example.com" });
      expect(result).toEqual(updateResult);
    });
  });

  describe("count", () => {
    it("should return the number of users", async () => {
      (repository.count as jest.Mock).mockResolvedValue(5);

      const result = await repository.count();

      expect(repository.count).toHaveBeenCalled();
      expect(result).toBe(5);
    });

    it("should return 0 when no users exist", async () => {
      (repository.count as jest.Mock).mockResolvedValue(0);

      const result = await repository.count();

      expect(result).toBe(0);
    });
  });
});