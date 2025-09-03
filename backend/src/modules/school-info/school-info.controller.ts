import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SchoolInfoService } from './school-info.service';
import { CreateSchoolInfoDto, UpdateSchoolInfoDto } from '../../common/dto/school-info.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '../../common/entities/user.entity';

@Controller('school-info')
export class SchoolInfoController {
  constructor(private readonly schoolInfoService: SchoolInfoService) {}

  @Get()
  findOne() {
    return this.schoolInfoService.findOne();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_MANAGER)
  create(@Body() createSchoolInfoDto: CreateSchoolInfoDto) {
    return this.schoolInfoService.create(createSchoolInfoDto);
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_MANAGER)
  updateWithoutId(@Body() updateSchoolInfoDto: UpdateSchoolInfoDto) {
    return this.schoolInfoService.updateWithoutId(updateSchoolInfoDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_MANAGER)
  update(@Param('id') id: string, @Body() updateSchoolInfoDto: UpdateSchoolInfoDto) {
    return this.schoolInfoService.update(id, updateSchoolInfoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_MANAGER)
  remove(@Param('id') id: string) {
    return this.schoolInfoService.remove(id);
  }
}
