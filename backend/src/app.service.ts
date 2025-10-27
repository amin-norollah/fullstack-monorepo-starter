import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { RedisService } from './redis/redis.service';
import { Task } from '@prisma/client';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly CACHE_TTL = 300;
  private readonly CACHE_PREFIX = 'task:';
  private readonly TASKS_LIST_KEY = 'tasks:all';

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getTasks(): Promise<Task[]> {
    const cached = await this.redis.get<Task[]>(this.TASKS_LIST_KEY);
    if (cached) {
      this.logger.debug('Returning tasks from cache');
      return cached;
    }

    const tasks = await this.prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });

    await this.redis.set(this.TASKS_LIST_KEY, tasks, this.CACHE_TTL);

    return tasks;
  }

  async getTask(id: string): Promise<Task> {
    const cacheKey = `${this.CACHE_PREFIX}${id}`;

    const cached = await this.redis.get<Task>(cacheKey);
    if (cached) {
      this.logger.debug(`Returning task ${id} from cache`);
      return cached;
    }

    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    await this.redis.set(cacheKey, task, this.CACHE_TTL);

    return task;
  }

  async createTask(createTaskDto: {
    name: string;
    description: string;
  }): Promise<Task> {
    const newTask = await this.prisma.task.create({
      data: createTaskDto,
    });

    await this.redis.del(this.TASKS_LIST_KEY);

    this.logger.log(`Created task with ID ${newTask.id}`);
    return newTask;
  }

  async updateTask(
    id: string,
    updateTaskDto: { name: string; description: string },
  ): Promise<Task> {
    await this.getTask(id);

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });

    await this.redis.del(`${this.CACHE_PREFIX}${id}`);
    await this.redis.del(this.TASKS_LIST_KEY);

    this.logger.log(`Updated task with ID ${id}`);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<{ message: string }> {
    await this.getTask(id);

    await this.prisma.task.delete({
      where: { id },
    });

    await this.redis.del(`${this.CACHE_PREFIX}${id}`);
    await this.redis.del(this.TASKS_LIST_KEY);

    this.logger.log(`Deleted task with ID ${id}`);
    return { message: `Task with ID ${id} deleted successfully` };
  }
}
