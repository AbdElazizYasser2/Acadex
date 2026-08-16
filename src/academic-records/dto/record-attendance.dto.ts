import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { AttendanceStatus } from '../../../generated/prisma/client';

export class RecordAttendanceDto {
  @IsNotEmpty()
  @IsUUID()
  attendanceSessionId: string;

  @IsNotEmpty()
  @IsUUID()
  studentId: string;

  @IsNotEmpty()
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
}
