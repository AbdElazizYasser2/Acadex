import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { MilitaryStatus } from '../../../generated/prisma/client';

export class CreateStudentDto {
  @IsNotEmpty()
  @IsUUID()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  studentCode!: string;

  @IsNotEmpty()
  @IsUUID()
  departmentId!: string;

  @IsNotEmpty()
  @IsUUID()
  academicYearId!: string;

  @IsOptional()
  @IsEnum(MilitaryStatus)
  militaryStatus?: MilitaryStatus;
}
