import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { AcademicTitle } from '../../../generated/prisma/client';

export class CreateDoctorDto {
  @IsNotEmpty()
  @IsUUID()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  employeeCode!: string;

  @IsNotEmpty()
  @IsUUID()
  departmentId!: string;

  @IsNotEmpty()
  @IsEnum(AcademicTitle)
  academicTitle!: AcademicTitle;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  hireDate!: Date;
}
