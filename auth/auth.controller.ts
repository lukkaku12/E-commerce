import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { LocalAuthGuard } from './guards/jwt/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

export interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Registers a new user with name, email, and password. Returns the authentication token and user data.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Data required to register a user',
  })
  @ApiCreatedResponse({
    description: 'User successfully registered.',
    type: User,
    schema: {
      example: {
        accessToken: 'JWT_TOKEN',
        user: {
          id: 'uuid',
          name: 'Jane Smith',
          email: 'janesmith@example.com',
          onboarding: 'false',
          role: 'user',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data. Validation failed.',
    schema: {
      example: {
        statusCode: 400,
        message: ['name should not be empty', 'email must be an email'],
        error: 'Bad Request',
      },
    },
  })
  async registerUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string; user: User }> {
    return await this.authService.registerUser(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: 'Login a user (patient or doctor)',
    description:
      'Authenticate a user using email and password. Returns a JWT token and user information.',
  })
  @ApiBody({
    description: 'Credentials for login',
    schema: {
      example: {
        email: 'user@example.com',
        password: 'your_password',
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Login successful. JWT token and user data returned.',
    schema: {
      example: {
        accessToken: 'JWT_TOKEN',
        user: {
          id: 'uuid',
          name: 'Jane Smith',
          email: 'janesmith@example.com',
          onboarding: 'false',
          role: 'user',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials provided.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      },
    },
  })
  login(@Req() req: RequestWithUser) {
    const user = req.user as User;
    const jwtAndUser = this.authService.generateJwtToken(user);
    return jwtAndUser;
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout a user',
    description:
      'Logs out a user by instructing the client to delete the JWT token. This endpoint does not invalidate tokens on the server side.',
  })
  @ApiCreatedResponse({
    description: 'User successfully logged out.',
    schema: {
      example: {
        message: 'Logout successful. Delete the token on the client side.',
      },
    },
  })
  logout() {
    return this.authService.logout();
  }
}