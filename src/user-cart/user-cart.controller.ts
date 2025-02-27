import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateUserCartDto } from './dto/create-user-cart.dto';
import { UpdateUserCartDto } from './dto/update-user-cart.dto';
import { UserCartService } from './user-cart.service';

@Controller('user-cart')
export class UserCartController {
  constructor(private readonly userCartService: UserCartService) {}

  @Post()
  create(@Body() createUserCartDto: CreateUserCartDto) {
    return this.userCartService.create(createUserCartDto);
  }

  @Get()
  findAll() {
    return this.userCartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userCartService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserCartDto: UpdateUserCartDto,
  ) {
    return this.userCartService.update(+id, updateUserCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userCartService.remove(+id);
  }
}
