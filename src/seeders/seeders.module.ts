import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

import UserSeeder from './users.seeder';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserSeeder, UsersService],
  exports: [UserSeeder],
})
export class SeedersModule {}
