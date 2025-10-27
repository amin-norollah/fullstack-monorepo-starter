import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ 
    example: 'Complete project documentation', 
    description: 'The name/title of the task' 
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'Write comprehensive README and API documentation',
    description: 'Detailed description of the task',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  description: string;
}

export class TaskResponseDto {
  @ApiProperty({ 
    example: '550e8400-e29b-41d4-a716-446655440000', 
    description: 'The unique identifier (UUID)' 
  })
  id: string;

  @ApiProperty({ 
    example: 'Complete project documentation', 
    description: 'The name/title of the task' 
  })
  name: string;

  @ApiProperty({
    example: 'Write comprehensive README and API documentation',
    description: 'Detailed description of the task',
  })
  description: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'The creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'The last update timestamp',
  })
  updatedAt: Date;
}

export class DeleteTaskResponseDto {
  @ApiProperty({
    example: 'Task with ID 550e8400-e29b-41d4-a716-446655440000 deleted successfully',
    description: 'Success message',
  })
  message: string;
}
