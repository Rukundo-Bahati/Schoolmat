import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { Product } from '../common/entities/product.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import * as multer from 'multer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    MulterModule.register({
      storage: multer.memoryStorage(), // Store files in memory for Cloudinary
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
      },
    }),
    CloudinaryModule,
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}
