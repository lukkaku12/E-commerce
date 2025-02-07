import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import UserSeeder from './users.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserSeeder],
  exports: [UserSeeder],
})
export class SeedersModule {}
