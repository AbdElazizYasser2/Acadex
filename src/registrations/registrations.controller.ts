import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationStatusDto } from './dto/update-registration-status.dto';
import { RegistrationsService } from './registrations.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Roles('ADMIN', 'STUDENT')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createRegistration(@Body() dto: CreateRegistrationDto) {
    return this.registrationsService.createRegistration(dto);
  }

  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRegistrationStatusDto,
  ) {
    return this.registrationsService.updateStatus(id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('student/:studentId/enrollments')
  findStudentEnrollments(@Param('studentId') studentId: string) {
    return this.registrationsService.findStudentEnrollments(studentId);
  }
}
