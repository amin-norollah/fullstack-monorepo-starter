import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorDetailsDto {
  @ApiProperty({
    description: 'Error code',
  })
  code: string;

  @ApiPropertyOptional({
    description: 'Additional error details',
  })
  details?: any;
}

export class ApiResponseDto<T = any> {
  @ApiProperty({
    description: 'Response message',
    example: 'Request processed successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
    nullable: true,
  })
  data: T | null;

  @ApiPropertyOptional({
    description: 'Error details (only present for error responses)',
    type: ErrorDetailsDto,
  })
  error?: ErrorDetailsDto;
}
