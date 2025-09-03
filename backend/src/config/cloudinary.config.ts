import { registerAs } from '@nestjs/config';

export default registerAs('cloudinary', () => ({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your-api-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your-api-secret',
  folder: process.env.CLOUDINARY_FOLDER || 'schoolmart',
}));