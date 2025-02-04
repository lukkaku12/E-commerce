import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ConflictException, 
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiCreatedResponse, ApiBadRequestResponse, ApiConflictResponse, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@ApiTags('Users') 
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create-user')
  @ApiOperation({ summary: 'Register a new user', description: 'Creates a new user and validates the uniqueness of the email.' })
  @ApiCreatedResponse({ 
    description: 'User successfully registered.',
    type: User,
    schema: {
      example: {
        id: '1',
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'encrypted_password',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data.',
    schema: {
      example: {
        statusCode: 400,
        message: ['email must be an email', 'name should not be empty'],
        error: 'Bad Request',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Email already exists.',
    schema: {
      example: {
        statusCode: 409,
        message: 'Email already exists.',
        error: 'Conflict',
      },
    },
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'Returns a list of all users.' })
  @ApiOkResponse({
    description: 'List of users retrieved successfully.',
    schema: {
      example: [
        {
          id: '1',
          name: 'John Doe',
          email: 'johndoe@example.com',
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'janesmith@example.com',
        },
      ],
    },
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID', description: 'Returns the details of a user by their ID.' })
  @ApiOkResponse({
    description: 'User retrieved successfully.',
    type: User,
    schema: {
      example: {
        id: '1',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found.',
        error: 'Not Found',
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID', description: 'Updates the details of a user by their ID.' })
  @ApiOkResponse({
    description: 'User updated successfully.',
    type: User,
    schema: {
      example: {
        id: '1',
        name: 'John Updated',
        email: 'johnupdated@example.com',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found.',
        error: 'Not Found',
      },
    },
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID', description: 'Deletes a user by their ID.' })
  @ApiOkResponse({
    description: 'User deleted successfully.',
    schema: {
      example: {
        message: 'User successfully deleted.',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found.',
        error: 'Not Found',
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}