import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseOfferingDto } from './dto/create-course-offering.dto';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCourse(dto: CreateCourseDto) {
    const existing = await this.prisma.course.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException('Course with this code already exists');
    }

    return this.prisma.course.create({
      data: dto,
      include: { department: true },
    });
  }

  async findAllCourses() {
    return this.prisma.course.findMany({
      include: { department: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOneCourse(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { department: true, offerings: true },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async createOffering(dto: CreateCourseOfferingDto) {
    const existing = await this.prisma.courseOffering.findUnique({
      where: {
        courseId_doctorId_semesterId: {
          courseId: dto.courseId,
          doctorId: dto.doctorId,
          semesterId: dto.semesterId,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        'This course offering already exists for this doctor and semester',
      );
    }

    return this.prisma.courseOffering.create({
      data: dto,
      include: {
        course: true,
        doctor: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true },
            },
          },
        },
        semester: true,
      },
    });
  }

  async findAllOfferings(semesterId?: string) {
    return this.prisma.courseOffering.findMany({
      where: semesterId ? { semesterId } : {},
      include: {
        course: true,
        doctor: {
          include: {
            user: {
              select: { firstName: true, lastName: true },
            },
          },
        },
        semester: true,
      },
    });
  }
}
