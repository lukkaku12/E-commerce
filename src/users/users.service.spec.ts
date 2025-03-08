import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User, UserRole } from './entities/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockUser = {
  user_id: 1,
  name: 'John Doe', // Agregado
  email: 'test@example.com',
  password: 'hashedPassword',
  role: UserRole.BUYER, // Ajusta según tus roles
  created_at: new Date(),
  updated_at: new Date(),
  service: [], // Agregado
  products: [],
  transactions: [],
  orders: [],
  carts: [],
};

const mockUserRepository = {
  findOneBy: jest.fn(),
  create: jest.fn().mockReturnValue(mockUser),
  save: jest.fn().mockResolvedValue(mockUser),
  find: jest.fn().mockResolvedValue([mockUser]),
  findOne: jest.fn().mockResolvedValue(mockUser),
  update: jest.fn().mockResolvedValue(mockUser),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      const result = await service.create({
        name: 'John Doe', // Agregado
        email: 'test@example.com',
        password: 'password',
      });

      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if email exists', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockUser);

      await expect(
        service.create({
          name: 'John Doe', // Agregado
          email: 'test@example.com',
          password: 'password',
        })
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user and return the updated user', async () => {
      const result = await service.update(1, { email: 'new@example.com' });
      expect(result).toEqual(mockUser);
    });
  });

  describe('remove', () => {
    it('should update the updated_at field and return the user', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);
      const result = await service.remove(1);
      expect(result.updated_at).toBeInstanceOf(Date);
    });
  });

  describe('validateUserExists', () => {
    it('should return a user if found', async () => {
      const result = await service.validateUserExists(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.validateUserExists(99)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});