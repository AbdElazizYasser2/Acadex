import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceSessionDto } from './dto/create-attendance-session.dto';
import { CreateExamDto } from './dto/create-exam.dto';
import { RecordAttendanceDto } from './dto/record-attendance.dto';
import { RecordExamResultDto } from './dto/record-exam-result.dto';
import { SubmitGradeDto } from './dto/submit-grade.dto';

@Injectable()
export class AcademicRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async createAttendanceSession(dto: CreateAttendanceSessionDto) {
    const offering = await this.prisma.courseOffering.findUnique({
      where: { id: dto.courseOfferingId },
    });
    if (!offering) throw new NotFoundException('Course offering not found');

    return this.prisma.attendanceSession.create({
      data: dto,
    });
  }

  async recordAttendance(dto: RecordAttendanceDto) {
    const session = await this.prisma.attendanceSession.findUnique({
      where: { id: dto.attendanceSessionId },
    });
    if (!session) throw new NotFoundException('Attendance session not found');

    return this.prisma.attendanceRecord.upsert({
      where: {
        attendanceSessionId_studentId: {
          attendanceSessionId: dto.attendanceSessionId,
          studentId: dto.studentId,
        },
      },
      create: {
        attendanceSessionId: dto.attendanceSessionId,
        studentId: dto.studentId,
        status: dto.status,
      },
      update: {
        status: dto.status,
      },
    });
  }

  async getStudentAttendance(studentId: string) {
    return this.prisma.attendanceRecord.findMany({
      where: { studentId },
      include: {
        attendanceSession: {
          include: {
            courseOffering: {
              include: { course: true },
            },
          },
        },
      },
      orderBy: { markedAt: 'desc' },
    });
  }

  async createExam(dto: CreateExamDto) {
    const offering = await this.prisma.courseOffering.findUnique({
      where: { id: dto.courseOfferingId },
    });
    if (!offering) throw new NotFoundException('Course offering not found');

    return this.prisma.exam.create({
      data: dto,
      include: { courseOffering: { include: { course: true } } },
    });
  }

  async recordExamResult(dto: RecordExamResultDto) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: dto.examId },
    });
    if (!exam) throw new NotFoundException('Exam not found');

    return this.prisma.examResult.upsert({
      where: {
        examId_studentId: {
          examId: dto.examId,
          studentId: dto.studentId,
        },
      },
      create: dto,
      update: { score: dto.score },
    });
  }

  async submitGrade(dto: SubmitGradeDto) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: dto.enrollmentId },
    });

    if (!enrollment) throw new NotFoundException('Enrollment not found');

    return this.prisma.grade.upsert({
      where: { enrollmentId: dto.enrollmentId },
      create: {
        enrollmentId: dto.enrollmentId,
        coursework: dto.coursework,
        midterm: dto.midterm,
        final: dto.final,
        total: dto.total,
        gradeLetter: dto.gradeLetter,
      },
      update: {
        coursework: dto.coursework,
        midterm: dto.midterm,
        final: dto.final,
        total: dto.total,
        gradeLetter: dto.gradeLetter,
      },
    });
  }
}
