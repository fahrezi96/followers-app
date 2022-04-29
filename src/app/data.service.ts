import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { AppError } from './posts/app.error';
import { BadInput } from './posts/bad-input';
import { NotFoundError } from './posts/not-found-error';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(@Inject(String) private url: string, private http: HttpClient) {}

  getAll() {
    // return this.http.get(this.url).pipe(map((response) => response));
    return this.http.get(this.url);
  }

  create(resource: any) {
    return this.http
      .post(this.url, resource)
      .pipe(catchError(this.handleError));
  }

  update(resource: any) {
    return this.http
      .patch(this.url + '/' + resource.id, { isRead: true })
      .pipe(catchError(this.handleError));
  }

  delete(id: any) {
    return this.http
      .delete(this.url + '/' + id)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 400) return throwError(() => new BadInput(error));
    if (error.status === 404) return throwError(() => new NotFoundError());
    return throwError(() => new AppError(error));
  }
}
