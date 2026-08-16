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
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AcademicWarningsService } from './academic-warnings.service';
import { IssueWarningDto } from './dto/issue-warning.dto';
import { UpdateWarningStatusDto } from './dto/update-warning-status.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('academic-warnings')
export class AcademicWarningsController {
  constructor(private readonly warningsService: AcademicWarningsService) {}

  @Roles('ADMIN', 'DOCTOR')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  issueWarning(@Body() dto: IssueWarningDto) {
    return this.warningsService.issueWarning(dto);
  }

  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateWarningStatusDto) {
    return this.warningsService.updateStatus(id, dto.status);
  }

  @Roles('ADMIN', 'DOCTOR')
  @HttpCode(HttpStatus.OK)
  @Get('active')
  getActiveWarnings() {
    return this.warningsService.getActiveWarnings();
  }

  @HttpCode(HttpStatus.OK)
  @Get('student/:studentId')
  getStudentWarnings(@Param('studentId') studentId: string) {
    return this.warningsService.getStudentWarnings(studentId);
  }
}
