import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode;

        const message = this.getSuccessMessage(request.method, statusCode);

        return {
          message,
          data,
        };
      }),
    );
  }

  private getSuccessMessage(method: string, statusCode: number): string {
    const messages: Record<string, Record<number, string>> = {
      GET: {
        200: 'Data retrieved successfully',
      },
      POST: {
        201: 'Resource created successfully',
        200: 'Operation completed successfully',
      },
      PUT: {
        200: 'Resource updated successfully',
      },
      PATCH: {
        200: 'Resource updated successfully',
      },
      DELETE: {
        200: 'Resource deleted successfully',
      },
    };

    return (
      messages[method]?.[statusCode] ||
      messages[method]?.[200] ||
      'Request processed successfully'
    );
  }
}
