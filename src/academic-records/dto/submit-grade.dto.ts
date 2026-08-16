import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { GradeLetter } from '../../../generated/prisma/client';

export class SubmitGradeDto {
  @IsNotEmpty()
  @IsUUID()
  enrollmentId!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  coursework?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  midterm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  final?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total?: number;

  @IsOptional()
  @IsEnum(GradeLetter)
  gradeLetter?: GradeLetter;
}
