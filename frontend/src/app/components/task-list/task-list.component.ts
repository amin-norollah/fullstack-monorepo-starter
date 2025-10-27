import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task, CreateTaskDto } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTask: CreateTaskDto = { name: '', description: '' };
  editingTask: Task | null = null;
  editForm: CreateTaskDto = { name: '', description: '' };
  loading = false;
  error: string | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.error = null;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load tasks: ' + err.message;
        this.loading = false;
      },
    });
  }

  createTask(): void {
    if (this.newTask.name && this.newTask.description) {
      this.taskService.createTask(this.newTask).subscribe({
        next: (task) => {
          this.tasks.unshift(task);
          this.newTask = { name: '', description: '' };
        },
        error: (err) => {
          this.error = 'Failed to create task: ' + err.message;
        },
      });
    }
  }

  startEdit(task: Task): void {
    this.editingTask = task;
    this.editForm = { name: task.name, description: task.description };
  }

  cancelEdit(): void {
    this.editingTask = null;
    this.editForm = { name: '', description: '' };
  }

  saveEdit(): void {
    if (this.editingTask && this.editForm.name && this.editForm.description) {
      this.taskService
        .updateTask(this.editingTask.id, this.editForm)
        .subscribe({
          next: (updatedTask) => {
            const index = this.tasks.findIndex((t) => t.id === updatedTask.id);
            if (index !== -1) {
              this.tasks[index] = updatedTask;
            }
            this.cancelEdit();
          },
          error: (err) => {
            this.error = 'Failed to update task: ' + err.message;
          },
        });
    }
  }

  deleteTask(id: string): void {
    if (confirm('Delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter((task) => task.id !== id);
        },
        error: (err) => {
          this.error = 'Failed to delete task: ' + err.message;
        },
      });
    }
  }
}
