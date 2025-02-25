import { PartialType } from '@nestjs/swagger';
import { CreateCartItemIdDto } from './create-cart-item-id.dto';

export class UpdateCartItemIdDto extends PartialType(CreateCartItemIdDto) {}
