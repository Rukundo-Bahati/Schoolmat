import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

interface ImageMapping {
  oldPath: string;
  newUrl: string;
  publicId: string;
}

async function migrateImagesToCloudinary() {
  console.log('Starting image migration to Cloudinary...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const cloudinaryService = app.get(CloudinaryService);
  const dataSource = app.get(DataSource);

  try {
    // Define the image mappings from database paths to actual files
    const imageMappings = [
      // Categories
      { dbPath: '/school-notebooks-and-paper-supplies.png', fileName: 'school-notebooks-and-paper-supplies.png' },
      { dbPath: '/pens-pencils-writing-materials.png', fileName: 'pens-pencils-writing-materials.png' },
      { dbPath: '/art-supplies-crayons-paints.png', fileName: 'art-supplies-crayons-paints.png' },
      { dbPath: '/colorful-school-backpacks.png', fileName: 'colorful-school-backpacks.png' },
      { dbPath: '/scientific-calculators.png', fileName: 'scientific-calculators.png' },
      { dbPath: '/school-sports-equipment.png', fileName: 'school-sports-equipment.png' },
      { dbPath: '/school-uniform-shirt.png', fileName: 'school-uniform-shirt.png' },
      { dbPath: '/school-pencil-case.png', fileName: 'school-pencil-case.png' },
      
      // Products
      { dbPath: '/premium-blue-school-backpack.png', fileName: 'premium-blue-school-backpack.png' },
      { dbPath: '/scientific-calculator.png', fileName: 'scientific-calculator.png' },
      { dbPath: '/complete-art-supply-kit.png', fileName: 'complete-art-supply-kit.png' },
      { dbPath: '/school-notebook-set.png', fileName: 'school-notebook-set.png' },
      { dbPath: '/geometry-compass-ruler-set.png', fileName: 'geometry-compass-ruler-set.png' },
      { dbPath: '/colored-pencils-set.png', fileName: 'colored-pencils-set.png' },
      { dbPath: '/school-water-bottle.png', fileName: 'school-water-bottle.png' },
      { dbPath: '/colorful-school-lunch-box.png', fileName: 'colorful-school-lunch-box.png' },
      { dbPath: '/school-exercise-books.png', fileName: 'school-exercise-books.png' },
    ];

    const frontendPublicPath = path.join(__dirname, '../../../frontend/public');
    const uploadedImages: ImageMapping[] = [];

    // Upload each image to Cloudinary
    for (const mapping of imageMappings) {
      const filePath = path.join(frontendPublicPath, mapping.fileName);
      
      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        continue;
      }

      console.log(`Uploading ${mapping.fileName}...`);
      
      try {
        // Read file and create buffer
        const fileBuffer = fs.readFileSync(filePath);
        
        // Create a mock Multer file object
        const file = {
          buffer: fileBuffer,
          originalname: mapping.fileName,
          mimetype: 'image/png',
          size: fileBuffer.length,
          fieldname: 'file',
          encoding: '7bit',
          destination: '',
          filename: mapping.fileName,
          path: filePath,
          stream: null as any,
        };

        // Upload to Cloudinary
        const result = await cloudinaryService.uploadImage(file as any);
        
        uploadedImages.push({
          oldPath: mapping.dbPath,
          newUrl: result.secure_url,
          publicId: result.public_id,
        });

        console.log(`✅ Uploaded ${mapping.fileName} -> ${result.secure_url}`);
      } catch (error) {
        console.error(`❌ Failed to upload ${mapping.fileName}:`, error);
      }
    }

    // Update database records
    console.log('Updating database records...');
    
    for (const uploaded of uploadedImages) {
      // Update categories
      await dataSource.query(
        `UPDATE "categories" SET "imageUrl" = $1 WHERE "imageUrl" = $2`,
        [uploaded.newUrl, uploaded.oldPath]
      );

      // Update products
      await dataSource.query(
        `UPDATE "products" SET "imageUrl" = $1, "cloudinaryPublicId" = $2 WHERE "imageUrl" = $3`,
        [uploaded.newUrl, uploaded.publicId, uploaded.oldPath]
      );

      // Update cart items
      await dataSource.query(
        `UPDATE "cart_items" SET "imageUrl" = $1 WHERE "imageUrl" = $2`,
        [uploaded.newUrl, uploaded.oldPath]
      );

      console.log(`✅ Updated database for ${uploaded.oldPath}`);
    }

    console.log('✅ Image migration completed successfully!');
    console.log(`📊 Updated ${uploadedImages.length} images`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await app.close();
  }
}

// Run the migration
migrateImagesToCloudinary().catch(console.error);