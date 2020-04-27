import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { classToPlain } from 'class-transformer';

export interface Response<T> {
  message: string;
  data: T;
}

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        let processedData;
        // TODO Walk the object in order to perform checks on nested arrays
        if (Array.isArray(data)) {
          processedData = data.map(details => classToPlain(details));
        } else {
          processedData = classToPlain(data);
        }

        return {
          data: processedData,
          message: 'request successful',
        };
      }),
    );
  }
}
