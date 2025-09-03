import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary.types';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('cloudinary.cloud_name'),
      api_key: this.configService.get('cloudinary.api_key'),
      api_secret: this.configService.get('cloudinary.api_secret'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: this.configService.get('cloudinary.folder'),
          resource_type: 'auto',
        },
        (error, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result as CloudinaryResponse);
        },
      );

      // Convert buffer to stream and pipe to cloudinary
      const bufferStream = require('stream').Readable.from(file.buffer);
      bufferStream.pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    return cloudinary.uploader.destroy(publicId);
  }

  getPublicIdFromUrl(url: string): string {
    // Extract public ID from Cloudinary URL
    // Example URL: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/image-id.jpg
    const urlParts = url.split('/');
    const filenameWithExtension = urlParts[urlParts.length - 1];
    const filename = filenameWithExtension.split('.')[0];
    const folder = urlParts[urlParts.length - 2];
    return `${folder}/${filename}`;
  }
}