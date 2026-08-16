import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { CoursesService } from './courses.service';
import { CreateCourseOfferingDto } from './dto/create-course-offering.dto';
import { CreateCourseDto } from './dto/create-course.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createCourse(@Body() dto: CreateCourseDto) {
    return this.coursesService.createCourse(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  findAllCourses() {
    return this.coursesService.findAllCourses();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOneCourse(@Param('id') id: string) {
    return this.coursesService.findOneCourse(id);
  }

  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @Post('offerings')
  createOffering(@Body() dto: CreateCourseOfferingDto) {
    return this.coursesService.createOffering(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('offerings/all')
  findAllOfferings(@Query('semesterId') semesterId?: string) {
    return this.coursesService.findAllOfferings(semesterId);
  }
}
