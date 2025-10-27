import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import {
  CreateTaskDto,
  TaskResponseDto,
  DeleteTaskResponseDto,
} from './dto/task.dto';
import { ApiResponseDto } from './common/dto/api-response.dto';

@ApiTags('tasks')
@Controller('api/tasks')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all tasks',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/ApiResponseDto' },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/TaskResponseDto' },
            },
          },
        },
      ],
    },
  })
  async getTasks(): Promise<TaskResponseDto[]> {
    return this.appService.getTasks();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved task',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/ApiResponseDto' },
        {
          properties: {
            data: { $ref: '#/components/schemas/TaskResponseDto' },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
    type: ApiResponseDto,
  })
  async getTask(@Param('id') id: string): Promise<TaskResponseDto> {
    return this.appService.getTask(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new task' })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/ApiResponseDto' },
        {
          properties: {
            data: { $ref: '#/components/schemas/TaskResponseDto' },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: ApiResponseDto,
  })
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.appService.createTask(createTaskDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/ApiResponseDto' },
        {
          properties: {
            data: { $ref: '#/components/schemas/TaskResponseDto' },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
    type: ApiResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: ApiResponseDto,
  })
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.appService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({
    status: 200,
    description: 'Task deleted successfully',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/ApiResponseDto' },
        {
          properties: {
            data: { $ref: '#/components/schemas/DeleteTaskResponseDto' },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
    type: ApiResponseDto,
  })
  async deleteTask(@Param('id') id: string): Promise<DeleteTaskResponseDto> {
    return this.appService.deleteTask(id);
  }
}
