import { Test, TestingModule } from '@nestjs/testing';
import { CartItemIdService } from './cart-item-id.service';

describe('CartItemIdService', () => {
  let service: CartItemIdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartItemIdService],
    }).compile();

    service = module.get<CartItemIdService>(CartItemIdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
