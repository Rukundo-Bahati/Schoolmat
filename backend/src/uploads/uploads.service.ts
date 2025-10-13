import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../common/entities/product.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
  private readonly uploadPath = './uploads';

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private cloudinaryService: CloudinaryService,
  ) {
    // Ensure upload directory exists (for backward compatibility)
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadProductImage(productId: string, file: Express.Multer.File): Promise<string> {
    // Verify product exists
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    // Validate file type
    if (!this.isValidImageFile(file)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 5MB.');
    }

    try {
      // Delete old image from Cloudinary if it exists
      if (product.cloudinaryPublicId) {
        try {
          await this.cloudinaryService.deleteImage(product.cloudinaryPublicId);
        } catch (deleteError) {
          console.error('Failed to delete old image from Cloudinary:', deleteError);
          // Continue with upload even if deletion fails
        }
      } else if (product.imageUrl && product.imageUrl.includes('cloudinary.com')) {
        // Try to extract public_id from URL for legacy images
        try {
          const publicId = this.cloudinaryService.getPublicIdFromUrl(product.imageUrl);
          await this.cloudinaryService.deleteImage(publicId);
        } catch (deleteError) {
          console.error('Failed to delete old image from Cloudinary:', deleteError);
          // Continue with upload even if deletion fails
        }
      }

      // Upload new image to Cloudinary
      const cloudinaryResponse = await this.cloudinaryService.uploadImage(file);
      
      // Update product with new Cloudinary image URL
      const imageUrl = cloudinaryResponse.secure_url;
      product.imageUrl = imageUrl;
      product.cloudinaryPublicId = cloudinaryResponse.public_id; // Store public_id for future reference
      await this.productRepository.save(product);

      return imageUrl;
    } catch (error) {
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }
  }

  async deleteProductImage(productId: string): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (product.imageUrl) {
      try {
        // Delete from Cloudinary if public_id exists
        if (product.cloudinaryPublicId) {
          await this.cloudinaryService.deleteImage(product.cloudinaryPublicId);
        } 
        // For legacy images without public_id, try to extract it from URL
        else if (product.imageUrl.includes('cloudinary.com')) {
          const publicId = this.cloudinaryService.getPublicIdFromUrl(product.imageUrl);
          await this.cloudinaryService.deleteImage(publicId);
        }
        // For local file system images (backward compatibility)
        else if (product.imageUrl.startsWith('/uploads/')) {
          const fileName = path.basename(product.imageUrl);
          const filePath = path.join(this.uploadPath, fileName);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }

        // Remove image URL and public_id from product
        product.imageUrl = '';
        product.cloudinaryPublicId = '';
        await this.productRepository.save(product);
      } catch (error) {
        throw new BadRequestException(`Failed to delete image: ${error.message}`);
      }
    }
  }

  async uploadMultipleProductImages(productId: string, files: Express.Multer.File[]): Promise<string[]> {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      try {
        const url = await this.uploadProductImage(productId, file);
        uploadedUrls.push(url);
      } catch (error) {
        // Continue with other files if one fails
        console.error(`Failed to upload file ${file.originalname}:`, error);
      }
    }

    return uploadedUrls;
  }

  private isValidImageFile(file: Express.Multer.File): boolean {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    const fileExtension = path.extname(file.originalname).toLowerCase();

    return allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension);
  }

  getUploadPath(): string {
    return this.uploadPath;
  }
}
