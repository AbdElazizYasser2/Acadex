import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ClassroomType } from '../../../generated/prisma/client';

export class CreateClassroomDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  building?: string;

  @IsOptional()
  @IsInt()
  floor?: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  capacity!: number;

  @IsOptional()
  @IsEnum(ClassroomType)
  type?: ClassroomType;
}
