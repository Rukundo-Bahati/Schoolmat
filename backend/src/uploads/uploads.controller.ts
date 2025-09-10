import {
  Controller,
  Post,
  Delete,
  Param,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor
} from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody
} from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  UploadResponseDto,
  MultipleUploadResponseDto,
  DeleteUploadResponseDto
} from '../common/dto/upload.dto';

@ApiTags('uploads')
@Controller('uploads')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('products/:productId/image')
  @ApiOperation({ summary: 'Upload product image' })
  @ApiParam({
    name: 'productId',
    description: 'Product ID to upload image for',
    example: 'uuid-string'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product image file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (JPEG, PNG, GIF, WebP) - Max 5MB'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    type: UploadResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid file or product not found'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadProductImage(
    @Param('productId') productId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    try {
      const url = await this.uploadsService.uploadProductImage(productId, file);
      return {
        success: true,
        url,
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('products/:productId/images')
  @ApiOperation({ summary: 'Upload multiple product images' })
  @ApiParam({
    name: 'productId',
    description: 'Product ID to upload images for',
    example: 'uuid-string'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Multiple product image files',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary'
          },
          description: 'Image files (JPEG, PNG, GIF, WebP) - Max 5 files, 5MB each'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Images uploaded successfully',
    type: MultipleUploadResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid files or product not found'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  @UseInterceptors(FilesInterceptor('files', 5)) // Max 5 files
  async uploadMultipleProductImages(
    @Param('productId') productId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<MultipleUploadResponseDto> {
    try {
      const urls = await this.uploadsService.uploadMultipleProductImages(productId, files);
      return {
        success: true,
        urls,
        uploadedCount: urls.length,
        failedCount: files.length - urls.length
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('products/:productId/image')
  @ApiOperation({ summary: 'Delete product image' })
  @ApiParam({
    name: 'productId',
    description: 'Product ID to delete image for',
    example: 'uuid-string'
  })
  @ApiResponse({
    status: 200,
    description: 'Image deleted successfully',
    type: DeleteUploadResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - product not found'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  async deleteProductImage(@Param('productId') productId: string): Promise<DeleteUploadResponseDto> {
    try {
      await this.uploadsService.deleteProductImage(productId);
      return {
        success: true,
        message: 'File deleted successfully'
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
