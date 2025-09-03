import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../app.module';
import { v2 as cloudinary } from 'cloudinary';

async function verifyCloudinaryConfig() {
  console.log('🔍 Verifying Cloudinary configuration...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);

  try {
    const cloudName = configService.get('cloudinary.cloud_name');
    const apiKey = configService.get('cloudinary.api_key');
    const apiSecret = configService.get('cloudinary.api_secret');

    console.log('📋 Configuration found:');
    console.log(`   Cloud Name: ${cloudName ? ' Set' : 'Missing'}`);
    console.log(`   API Key: ${apiKey ? 'Set' : ' Missing'}`);
    console.log(`   API Secret: ${apiSecret ? 'Set' : ' Missing'}`);

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('\n Missing Cloudinary configuration!');
      console.log('Please set these environment variables:');
      console.log('   CLOUDINARY_CLOUD_NAME');
      console.log('   CLOUDINARY_API_KEY');
      console.log('   CLOUDINARY_API_SECRET');
      process.exit(1);
    }

    // Test Cloudinary connection
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    console.log('\nTesting Cloudinary connection...');
    
    // Try to ping Cloudinary
    const result = await cloudinary.api.ping();
    console.log(' Cloudinary connection successful!');
    console.log(' Ready to migrate images!');

  } catch (error) {
    console.error('Cloudinary connection failed:', error.message);
    process.exit(1);
  } finally {
    await app.close();
  }
}

verifyCloudinaryConfig().catch(console.error);