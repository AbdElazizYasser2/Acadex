import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  async createClassroom(dto: CreateClassroomDto) {
    const existing = await this.prisma.classroom.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException('Classroom name already exists');
    }

    return this.prisma.classroom.create({
      data: dto,
    });
  }

  async findAllClassrooms() {
    return this.prisma.classroom.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async createSchedule(dto: CreateScheduleDto) {
    const classroom = await this.prisma.classroom.findUnique({
      where: { id: dto.classroomId },
    });
    if (!classroom) throw new NotFoundException('Classroom not found');

    const offering = await this.prisma.courseOffering.findUnique({
      where: { id: dto.courseOfferingId },
    });

    if (!offering) throw new NotFoundException('Course offering not found');

    const classroomConflict = await this.prisma.schedule.findFirst({
      where: {
        classroomId: dto.classroomId,
        dayOfWeek: dto.dayOfWeek,
        OR: [
          {
            startTime: { lte: dto.startTime },
            endTime: { gt: dto.startTime },
          },
          {
            startTime: { lt: dto.endTime },
            endTime: { gte: dto.endTime },
          },
        ],
      },
    });

    if (classroomConflict) {
      throw new ConflictException('Classroom is already booked for this slot');
    }

    return this.prisma.schedule.create({
      data: dto,
      include: {
        classroom: true,
        courseOffering: {
          include: {
            course: true,
            doctor: {
              include: {
                user: { select: { firstName: true, lastName: true } },
              },
            },
          },
        },
      },
    });
  }

  async findAllSchedules() {
    return this.prisma.schedule.findMany({
      include: {
        classroom: true,
        courseOffering: {
          include: {
            course: true,
            doctor: {
              include: {
                user: { select: { firstName: true, lastName: true } },
              },
            },
          },
        },
      },
      orderBy: { dayOfWeek: 'asc' },
    });
  }
}
