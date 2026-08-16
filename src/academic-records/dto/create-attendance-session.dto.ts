import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAttendanceSessionDto {
  @IsNotEmpty()
  @IsUUID()
  courseOfferingId!: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  sessionDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endTime: Date;
}
