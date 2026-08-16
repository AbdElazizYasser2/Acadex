import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRegistrationDto {
  @IsNotEmpty()
  @IsUUID()
  studentId!: string;

  @IsNotEmpty()
  @IsUUID()
  semesterId!: string;

  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  courseOfferingIds!: string[];
}
