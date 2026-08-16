import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FeeStatus } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AssignStudentFeeDto } from './dto/assign-student-fee.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateTuitionFeeDto } from './dto/create-tuition-fee.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTuitionFee(dto: CreateTuitionFeeDto) {
    const existing = await this.prisma.tuitionFee.findFirst({
      where: {
        semesterId: dto.semesterId,
        departmentId: dto.departmentId ?? null,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Tuition fee for this semester and department already exists',
      );
    }

    return this.prisma.tuitionFee.create({
      data: dto,
      include: { semester: true, department: true },
    });
  }

  async assignFeeToStudent(dto: AssignStudentFeeDto) {
    const discount = dto.discount || 0;
    const finalAmount = dto.amount - discount;

    if (finalAmount < 0) {
      throw new BadRequestException(
        'Discount cannot exceed the original amount',
      );
    }

    return this.prisma.studentFee.create({
      data: {
        studentId: dto.studentId,
        tuitionFeeId: dto.tuitionFeeId,
        amount: dto.amount,
        discount: discount,
        finalAmount: finalAmount,
        dueDate: dto.dueDate,
        status: FeeStatus.PENDING,
      },
      include: { tuitionFee: true, student: true },
    });
  }

  async processPayment(dto: CreatePaymentDto) {
    const studentFee = await this.prisma.studentFee.findUnique({
      where: { id: dto.studentFeeId },
      include: { payments: true },
    });

    if (!studentFee) {
      throw new NotFoundException('Student fee record not found');
    }

    const currentTotalPaid = studentFee.payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );

    const newTotalPaid = currentTotalPaid + dto.amount;
    const finalAmount = Number(studentFee.finalAmount);

    if (newTotalPaid > finalAmount) {
      throw new BadRequestException(
        `Payment exceeds total remaining amount. Remaining: ${finalAmount - currentTotalPaid}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: dto,
      });

      let newStatus: FeeStatus = FeeStatus.PARTIALLY_PAID;

      if (newTotalPaid >= finalAmount) {
        newStatus = FeeStatus.PAID;
      }

      await tx.studentFee.update({
        where: { id: dto.studentFeeId },
        data: { status: newStatus },
      });

      return payment;
    });
  }

  async getStudentFeeDetails(studentId: string) {
    return this.prisma.studentFee.findMany({
      where: { studentId },
      include: {
        tuitionFee: { include: { semester: true } },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
