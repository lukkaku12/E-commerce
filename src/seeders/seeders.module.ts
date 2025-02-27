import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import UserSeeder from './users.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserSeeder, UsersService],
  exports: [UserSeeder],
})
export class SeedersModule {}
