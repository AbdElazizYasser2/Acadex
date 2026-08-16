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
import { Roles } from '../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { AssignStudentFeeDto } from './dto/assign-student-fee.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateTuitionFeeDto } from './dto/create-tuition-fee.dto';
import { PaymentsService } from './payments.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @Post('tuition-fees')
  createTuitionFee(@Body() dto: CreateTuitionFeeDto) {
    return this.paymentsService.createTuitionFee(dto);
  }

  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @Post('student-fees')
  assignFeeToStudent(@Body() dto: AssignStudentFeeDto) {
    return this.paymentsService.assignFeeToStudent(dto);
  }

  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @Post('process')
  processPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.processPayment(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('student/:studentId')
  getStudentFeeDetails(@Param('studentId') studentId: string) {
    return this.paymentsService.getStudentFeeDetails(studentId);
  }
}
