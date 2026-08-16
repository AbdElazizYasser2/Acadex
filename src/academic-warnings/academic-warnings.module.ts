import { Module } from '@nestjs/common';
import { AcademicWarningsController } from './academic-warnings.controller';
import { AcademicWarningsService } from './academic-warnings.service';

@Module({
  controllers: [AcademicWarningsController],
  providers: [AcademicWarningsService],
  exports: [AcademicWarningsService],
})
export class AcademicWarningsModule {}
