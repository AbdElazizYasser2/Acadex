import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegistrationStatus } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationStatusDto } from './dto/update-registration-status.dto';

@Injectable()
export class RegistrationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createRegistration(dto: CreateRegistrationDto) {
    const existingReg = await this.prisma.academicRegistration.findUnique({
      where: {
        studentId_semesterId: {
          studentId: dto.studentId,
          semesterId: dto.semesterId,
        },
      },
    });

    if (existingReg) {
      throw new ConflictException(
        'Registration request already exists for this semester',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const registration = await tx.academicRegistration.create({
        data: {
          studentId: dto.studentId,
          semesterId: dto.semesterId,
          status: RegistrationStatus.SUBMITTED,
          submittedAt: new Date(),
          registrationItems: {
            create: dto.courseOfferingIds.map((offeringId) => ({
              courseOfferingId: offeringId,
            })),
          },
        },
        include: {
          registrationItems: {
            include: { courseOffering: { include: { course: true } } },
          },
        },
      });

      return registration;
    });
  }

  async updateStatus(id: string, dto: UpdateRegistrationStatusDto) {
    const reg = await this.prisma.academicRegistration.findUnique({
      where: { id },
      include: { registrationItems: true },
    });

    if (!reg) throw new NotFoundException('Registration record not found');

    return this.prisma.$transaction(async (tx) => {
      const updatedReg = await tx.academicRegistration.update({
        where: { id },
        data: {
          status: dto.status,
          approvedAt:
            dto.status === RegistrationStatus.APPROVED ? new Date() : null,
        },
      });

      if (dto.status === RegistrationStatus.APPROVED) {
        const enrollmentsData = reg.registrationItems.map((item) => ({
          studentId: reg.studentId,
          courseOfferingId: item.courseOfferingId,
        }));

        for (const item of enrollmentsData) {
          await tx.enrollment.upsert({
            where: {
              studentId_courseOfferingId: {
                studentId: item.studentId,
                courseOfferingId: item.courseOfferingId,
              },
            },
            create: item,
            update: {},
          });
        }
      }

      return updatedReg;
    });
  }

  async findStudentEnrollments(studentId: string) {
    return this.prisma.enrollment.findMany({
      where: { studentId },
      include: {
        courseOffering: {
          include: {
            course: true,
            doctor: {
              include: {
                user: { select: { firstName: true, lastName: true } },
              },
            },
            schedules: { include: { classroom: true } },
          },
        },
      },
    });
  }
}
