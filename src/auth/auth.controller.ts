import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
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

  // 🔐 REGISTER
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
    schema: {
      example: {
        accessToken: 'JWT_TOKEN',
        user: {
          id: 'uuid',
          name: 'Jane Smith',
          email: 'janesmith@example.com',
          onboarding: false,
          role: 'buyer',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data. Validation failed or user already exists.',
    schema: {
      example: {
        statusCode: 400,
        message: ['email must be an email', 'password must be longer than 6 characters'],
        error: 'Bad Request',
      },
    },
  })
  async registerUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string; user: User }> {
    return await this.authService.registerUser(createUserDto);
  }

  // 🔐 LOGIN
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: 'Login a user (buyer, seller, etc.)',
    description:
      'Authenticates a user using email and password. Returns a JWT token and user info if valid.',
  })
  @ApiBody({
    description: 'Credentials for login',
    schema: {
      example: {
        email: 'user@example.com',
        password: 'securePassword123',
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
          onboarding: false,
          role: 'buyer',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Email or password missing.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Email and password are required',
        error: 'Bad Request',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Incorrect password.',
    schema: {
      example: {
        statusCode: 403,
        message: 'Incorrect password',
        error: 'Forbidden',
      },
    },
  })
  login(@Req() req: RequestWithUser) {
    const user = req.user as User;
    return this.authService.generateJwtToken(user);
  }

  // 🔐 LOGOUT
  @Post('logout')
  @ApiOperation({
    summary: 'Logout a user',
    description:
      'Logs out a user by informing the client to delete the JWT token. No server-side token invalidation.',
  })
  @ApiCreatedResponse({
    description: 'Logout successful.',
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