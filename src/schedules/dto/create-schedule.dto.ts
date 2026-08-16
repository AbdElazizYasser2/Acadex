import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { DayOfWeek } from '../../../generated/prisma/client';

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsUUID()
  courseOfferingId: string;

  @IsNotEmpty()
  @IsUUID()
  classroomId: string;

  @IsNotEmpty()
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endTime: Date;
}
