import { IsEnum, IsNotEmpty } from 'class-validator';
import { WarningStatus } from '../../../generated/prisma/client';

export class UpdateWarningStatusDto {
  @IsNotEmpty()
  @IsEnum(WarningStatus)
  status: WarningStatus;
}
