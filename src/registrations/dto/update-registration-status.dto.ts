import { IsEnum, IsNotEmpty } from 'class-validator';
import { RegistrationStatus } from '../../../generated/prisma/client';

export class UpdateRegistrationStatusDto {
  @IsNotEmpty()
  @IsEnum(RegistrationStatus)
  status!: RegistrationStatus;
}
