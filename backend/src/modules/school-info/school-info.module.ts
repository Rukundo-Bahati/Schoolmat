import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolInfoService } from './school-info.service';
import { SchoolInfoController } from './school-info.controller';
import { SchoolInfo } from '../../common/entities/school-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolInfo])],
  controllers: [SchoolInfoController],
  providers: [SchoolInfoService],
  exports: [SchoolInfoService],
})
export class SchoolInfoModule {}
