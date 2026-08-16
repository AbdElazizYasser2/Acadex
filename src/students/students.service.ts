import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStudentDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingStudent = await this.prisma.student.findFirst({
      where: {
        OR: [{ userId: dto.userId }, { studentCode: dto.studentCode }],
      },
    });

    if (existingStudent) {
      throw new ConflictException(
        'Student record or Student Code already exists for this user',
      );
    }

    return this.prisma.student.create({
      data: {
        ...dto,
        enrollmentDate: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        department: true,
        academicYear: true,
      },
    });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      this.prisma.student.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              avatar: true,
            },
          },
          department: true,
          academicYear: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.student.count(),
    ]);

    return {
      data: students,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
        department: true,
        academicYear: true,
        enrollments: {
          include: {
            courseOffering: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    return student;
  }

  async update(id: string, dto: UpdateStudentDto) {
    await this.findOne(id);

    return this.prisma.student.update({
      where: { id },
      data: dto,
      include: {
        user: true,
        department: true,
        academicYear: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.student.delete({
      where: { id },
    });

    return { message: 'Student profile deleted successfully' };
  }
}
