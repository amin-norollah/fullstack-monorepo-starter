import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Task {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDto {
  name: string;
  description: string;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = '/api/tasks';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http
      .get<ApiResponse<Task[]>>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  getTask(id: string): Observable<Task> {
    return this.http
      .get<ApiResponse<Task>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  createTask(task: CreateTaskDto): Observable<Task> {
    return this.http
      .post<ApiResponse<Task>>(this.apiUrl, task)
      .pipe(map((response) => response.data));
  }

  updateTask(id: string, task: CreateTaskDto): Observable<Task> {
    return this.http
      .put<ApiResponse<Task>>(`${this.apiUrl}/${id}`, task)
      .pipe(map((response) => response.data));
  }

  deleteTask(id: string): Observable<{ message: string }> {
    return this.http
      .delete<ApiResponse<{ message: string }>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }
}
