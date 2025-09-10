import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({
    description: 'Upload success status',
    example: true,
    type: 'boolean'
  })
  success: boolean;

  @ApiProperty({
    description: 'Uploaded file URL',
    example: '/uploads/uuid-filename.jpg',
    type: 'string'
  })
  url: string;

  @ApiProperty({
    description: 'Original filename',
    example: 'product-image.jpg',
    type: 'string'
  })
  filename: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000,
    type: 'number'
  })
  size: number;

  @ApiProperty({
    description: 'File MIME type',
    example: 'image/jpeg',
    type: 'string'
  })
  mimetype: string;
}

export class MultipleUploadResponseDto {
  @ApiProperty({
    description: 'Upload success status',
    example: true,
    type: 'boolean'
  })
  success: boolean;

  @ApiProperty({
    description: 'List of uploaded file URLs',
    example: ['/uploads/uuid1-filename.jpg', '/uploads/uuid2-filename.png'],
    type: [String]
  })
  urls: string[];

  @ApiProperty({
    description: 'Number of files uploaded successfully',
    example: 3,
    type: 'number'
  })
  uploadedCount: number;

  @ApiProperty({
    description: 'Number of files that failed to upload',
    example: 1,
    type: 'number'
  })
  failedCount: number;
}

export class DeleteUploadResponseDto {
  @ApiProperty({
    description: 'Deletion success status',
    example: true,
    type: 'boolean'
  })
  success: boolean;

  @ApiProperty({
    description: 'Success message',
    example: 'File deleted successfully',
    type: 'string'
  })
  message: string;
}
