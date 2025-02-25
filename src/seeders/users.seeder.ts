import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

import { User, UserRole } from '../users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export default class UserSeeder {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(UsersService) private readonly userService: UsersService,
  ) {}

  async seed(): Promise<void> {
    const users: User[] = [
      {
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        password: 'password123',
        role: UserRole.BUYER,
        created_at: new Date(),
        updated_at: new Date(),
        products: [],
        service: [],
        transactions: [],
        orders: [],
        carts: [],
      },
      {
        name: 'María Gómez',
        email: 'maria.gomez@example.com',
        password: 'securepassword',
        role: UserRole.SELLER,
        created_at: new Date(),
        updated_at: new Date(),
        products: [],
        service: [],
        transactions: [],
        orders: [],
        carts: [],
      },
      {
        name: 'Carlos López',
        email: 'carlos.lopez@example.com',
        password: 'mypassword',
        role: UserRole.BUYER,
        created_at: new Date(),
        updated_at: new Date(),
        products: [],
        service: [],
        transactions: [],
        orders: [],
        carts: [],
      },
      {
        name: 'Ana Martínez',
        email: 'ana.martinez@example.com',
        password: 'password456',
        role: UserRole.SELLER,
        created_at: new Date(),
        updated_at: new Date(),
        products: [],
        service: [],
        transactions: [],
        orders: [],
        carts: [],
      },
    ];

    for (const user of users) {
      const userFound = await this.userRepository.findOne({
        where: { email: user.email },
      });

      if (!userFound) {
        await this.userService.create(user);
        console.log(`Inserted user: ${user.name}`);
      } else {
        console.log(`User with ID ${user.user_id} already exists.`);
      }
    }
  }
}
