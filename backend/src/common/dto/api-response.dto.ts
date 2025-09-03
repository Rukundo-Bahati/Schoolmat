/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class DefinedApiResponse {
  @ApiProperty({
    description: 'Indicates whether the request was successful or not',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Error message, if any',
    example: 'An error occurred',
    required: false,
  })
  error?: string;

  @ApiProperty({
    description: 'Data returned by the request',
    example: {},
    required: false,
  })
  data?: any;

  constructor(success: boolean, error?: string, data?: any) {
    this.success = success;
    this.error = error;
    this.data = data;
  }
}
