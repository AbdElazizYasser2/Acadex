import { Injectable, NotFoundException } from '@nestjs/common';
import { WarningStatus } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IssueWarningDto } from './dto/issue-warning.dto';

@Injectable()
export class AcademicWarningsService {
  constructor(private readonly prisma: PrismaService) {}

  async issueWarning(dto: IssueWarningDto) {
    const student = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
    });
    if (!student) throw new NotFoundException('Student not found');

    const semester = await this.prisma.semester.findUnique({
      where: { id: dto.semesterId },
    });
    if (!semester) throw new NotFoundException('Semester not found');

    return this.prisma.academicWarning.create({
      data: {
        studentId: dto.studentId,
        semesterId: dto.semesterId,
        type: dto.type,
        reason: dto.reason,
        description: dto.description,
        gpa: dto.gpa,
        status: WarningStatus.ACTIVE,
      },
      include: {
        semester: true,
        student: { include: { user: true } },
      },
    });
  }

  async updateStatus(id: string, status: WarningStatus) {
    const warning = await this.prisma.academicWarning.findUnique({
      where: { id },
    });
    if (!warning) throw new NotFoundException('Academic warning not found');

    const resolvedAt =
      status === WarningStatus.RESOLVED || status === WarningStatus.DISMISSED
        ? new Date()
        : null;

    return this.prisma.academicWarning.update({
      where: { id },
      data: {
        status,
        resolvedAt,
      },
    });
  }

  async getStudentWarnings(studentId: string) {
    return this.prisma.academicWarning.findMany({
      where: { studentId },
      include: { semester: true },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async getActiveWarnings() {
    return this.prisma.academicWarning.findMany({
      where: { status: WarningStatus.ACTIVE },
      include: {
        student: { include: { user: true, department: true } },
        semester: true,
      },
      orderBy: { issuedAt: 'desc' },
    });
  }
}
