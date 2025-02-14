import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt/jwt-auth.guard';

import { BookingService } from './booking-service.service';

@Controller('booking')
// @UseGuards(JwtAuthGuard) // Protege la ruta con autenticación JWT
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async bookService(
    @Body('userId') userId: number,
    @Body('scheduleId') scheduleId: number,
  ) {
    return this.bookingService.bookService(userId, scheduleId);
  }
}
