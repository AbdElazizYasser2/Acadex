import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../common/decorators';
import { JwtAuthGuard } from '../common/guards';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  getProfile(@GetUser('sub') userId: string) {
    return this.userService.getProfile(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('profile')
  updateProfile(@GetUser('sub') userId: string, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(userId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('change-password')
  changePassword(
    @GetUser('sub') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(userId, dto);
  }
}
