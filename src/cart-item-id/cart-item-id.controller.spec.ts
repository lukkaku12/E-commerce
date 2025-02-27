import { Test, TestingModule } from '@nestjs/testing';

import { CartItemIdController } from './cart-item-id.controller';
import { CartItemIdService } from './cart-item-id.service';

describe('CartItemIdController', () => {
  let controller: CartItemIdController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartItemIdController],
      providers: [CartItemIdService],
    }).compile();

    controller = module.get<CartItemIdController>(CartItemIdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
