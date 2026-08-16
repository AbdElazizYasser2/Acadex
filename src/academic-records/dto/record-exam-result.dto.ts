import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class RecordExamResultDto {
  @IsNotEmpty()
  @IsUUID()
  examId: string;

  @IsNotEmpty()
  @IsUUID()
  studentId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  score: number;
}
