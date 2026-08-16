import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AcademicYearsService } from './academic-years.service';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { CreateSemesterDto } from './dto/create-semester.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('academic-years')
export class AcademicYearsController {
  constructor(private readonly academicYearsService: AcademicYearsService) {}

  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createAcademicYear(@Body() dto: CreateAcademicYearDto) {
    return this.academicYearsService.createAcademicYear(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  findAllAcademicYears() {
    return this.academicYearsService.findAllAcademicYears();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOneAcademicYear(@Param('id') id: string) {
    return this.academicYearsService.findOneAcademicYear(id);
  }

  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @Post('semesters')
  createSemester(@Body() dto: CreateSemesterDto) {
    return this.academicYearsService.createSemester(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('semesters/all')
  findAllSemesters() {
    return this.academicYearsService.findAllSemesters();
  }
}
