import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchoolInfo } from '../../common/entities/school-info.entity';
import { CreateSchoolInfoDto, UpdateSchoolInfoDto } from '../../common/dto/school-info.dto';

@Injectable()
export class SchoolInfoService {
  constructor(
    @InjectRepository(SchoolInfo)
    private schoolInfoRepository: Repository<SchoolInfo>,
  ) {}

  async findOne(): Promise<SchoolInfo> {
    const schoolInfo = await this.schoolInfoRepository.findOne({ where: {} });
    if (!schoolInfo) {
      // Create default school info if not found
      const defaultSchoolInfo = this.schoolInfoRepository.create({
        name: 'School Name',
        email: 'admin@school.edu',
        phone: '+1234567890',
        address: 'School Address'
      });
      return this.schoolInfoRepository.save(defaultSchoolInfo);
    }
    return schoolInfo;
  }

  async create(createSchoolInfoDto: CreateSchoolInfoDto): Promise<SchoolInfo> {
    const schoolInfo = this.schoolInfoRepository.create(createSchoolInfoDto);
    return this.schoolInfoRepository.save(schoolInfo);
  }

  async update(id: string, updateSchoolInfoDto: UpdateSchoolInfoDto): Promise<SchoolInfo> {
    const schoolInfo = await this.schoolInfoRepository.findOne({ where: { id } });
    if (!schoolInfo) {
      throw new NotFoundException('School information not found');
    }
    Object.assign(schoolInfo, updateSchoolInfoDto);
    return this.schoolInfoRepository.save(schoolInfo);
  }

  async updateWithoutId(updateSchoolInfoDto: UpdateSchoolInfoDto): Promise<SchoolInfo> {
    const schoolInfo = await this.findOne();
    Object.assign(schoolInfo, updateSchoolInfoDto);
    return this.schoolInfoRepository.save(schoolInfo);
  }

  async remove(id: string): Promise<void> {
    const schoolInfo = await this.schoolInfoRepository.findOne({ where: { id } });
    if (!schoolInfo) {
      throw new NotFoundException('School information not found');
    }
    await this.schoolInfoRepository.remove(schoolInfo);
  }
}
