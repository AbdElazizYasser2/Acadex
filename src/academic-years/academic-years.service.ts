import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { CreateSemesterDto } from './dto/create-semester.dto';

@Injectable()
export class AcademicYearsService {
  constructor(private readonly prisma: PrismaService) {}

  async createAcademicYear(dto: CreateAcademicYearDto) {
    const existing = await this.prisma.academicYear.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException('Academic year name already exists');
    }

    return this.prisma.academicYear.create({
      data: dto,
    });
  }

  async findAllAcademicYears() {
    return this.prisma.academicYear.findMany({
      include: {
        semesters: true,
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOneAcademicYear(id: string) {
    const academicYear = await this.prisma.academicYear.findUnique({
      where: { id },
      include: {
        semesters: true,
      },
    });

    if (!academicYear) {
      throw new NotFoundException('Academic year not found');
    }

    return academicYear;
  }

  async createSemester(dto: CreateSemesterDto) {
    await this.findOneAcademicYear(dto.academicYearId);

    const existing = await this.prisma.semester.findUnique({
      where: {
        name_academicYearId: {
          name: dto.name,
          academicYearId: dto.academicYearId,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Semester with this name already exists in this academic year',
      );
    }

    return this.prisma.semester.create({
      data: dto,
    });
  }

  async findAllSemesters() {
    return this.prisma.semester.findMany({
      include: {
        academicYear: true,
      },
      orderBy: { startDate: 'desc' },
    });
  }
}
