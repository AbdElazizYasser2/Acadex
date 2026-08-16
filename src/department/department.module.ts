import { Module } from '@nestjs/common';
import { DepartmentController } from './department.controller';
import { DepartmentsService } from './department.service';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentsService],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
