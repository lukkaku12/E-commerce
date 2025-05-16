import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserCart } from 'src/user-cart/entities/user-cart.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

export interface JwtPayload {
  sub: number;
  role: string;
}

export interface JwtTokenData {
  accessToken: string;
  user: User;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserCart)
    private readonly cartRepository: Repository<UserCart>,
  ) { }

  async registerUser(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string; user: User }> {
    const user = await this.usersService.create(createUserDto);
    if (user.role === 'buyer') {
    const userCart = this.cartRepository.create({
      user,
      status: 'active',
    });
    await this.cartRepository.save(userCart);
  }
    return this.generateJwtToken(user);
  }

  async validateUser(userData: {
    email: string;
    password: string;
  }): Promise<User> {
    const { email, password } = userData;
    const foundUser = await this.usersService.findByEmail(email);

    if (
      !foundUser ||
      !(await this.comparePasswords(password, foundUser.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return foundUser;
  }

  generateJwtToken(user: User): JwtTokenData {
    const payload: JwtPayload = {
      sub: user.user_id,
      role: user.role,
    };
    //      e.g. {
    //   "sub": "12345",
    //   "role": "admin"
    // }

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  private async comparePasswords(
    plainText: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainText, hashedPassword);
  }

  async logout() {
    return { message: "Logout successful. Delete the token on the client side." };
  }
}
