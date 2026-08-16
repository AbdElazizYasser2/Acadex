import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { SchedulesService } from './schedules.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @Post('classrooms')
  createClassroom(@Body() dto: CreateClassroomDto) {
    return this.schedulesService.createClassroom(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('classrooms')
  findAllClassrooms() {
    return this.schedulesService.findAllClassrooms();
  }

  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createSchedule(@Body() dto: CreateScheduleDto) {
    return this.schedulesService.createSchedule(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  findAllSchedules() {
    return this.schedulesService.findAllSchedules();
  }
}
