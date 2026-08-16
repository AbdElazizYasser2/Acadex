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
import { AcademicRecordsService } from './academic-records.service';
import { CreateAttendanceSessionDto } from './dto/create-attendance-session.dto';
import { CreateExamDto } from './dto/create-exam.dto';
import { RecordAttendanceDto } from './dto/record-attendance.dto';
import { RecordExamResultDto } from './dto/record-exam-result.dto';
import { SubmitGradeDto } from './dto/submit-grade.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('academic-records')
export class AcademicRecordsController {
  constructor(private readonly recordsService: AcademicRecordsService) {}

  @Roles('ADMIN', 'DOCTOR')
  @HttpCode(HttpStatus.CREATED)
  @Post('attendance/sessions')
  createAttendanceSession(@Body() dto: CreateAttendanceSessionDto) {
    return this.recordsService.createAttendanceSession(dto);
  }

  @Roles('ADMIN', 'DOCTOR')
  @HttpCode(HttpStatus.OK)
  @Post('attendance/records')
  recordAttendance(@Body() dto: RecordAttendanceDto) {
    return this.recordsService.recordAttendance(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('attendance/student/:studentId')
  getStudentAttendance(@Param('studentId') studentId: string) {
    return this.recordsService.getStudentAttendance(studentId);
  }

  @Roles('ADMIN', 'DOCTOR')
  @HttpCode(HttpStatus.CREATED)
  @Post('exams')
  createExam(@Body() dto: CreateExamDto) {
    return this.recordsService.createExam(dto);
  }

  @Roles('ADMIN', 'DOCTOR')
  @HttpCode(HttpStatus.OK)
  @Post('exams/results')
  recordExamResult(@Body() dto: RecordExamResultDto) {
    return this.recordsService.recordExamResult(dto);
  }

  @Roles('ADMIN', 'DOCTOR')
  @HttpCode(HttpStatus.OK)
  @Post('grades')
  submitGrade(@Body() dto: SubmitGradeDto) {
    return this.recordsService.submitGrade(dto);
  }
}
