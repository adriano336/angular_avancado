import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';
import { Category } from './category.model.js';
import { environment } from '../../../../environments/environment.js';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiPath: string = environment.apiUrl + 'categories';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Array<Category>> {
    return this.http
      .get<Array<Category>>(this.apiPath)
      .pipe(catchError(this.handleError), map(this.jsonDataToCategories));
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiPath}/${id}`)
      .pipe(catchError(this.handleError), map(this.jsonDataToCategory));
  }

  create(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiPath, category)
      .pipe(catchError(this.handleError), map(this.jsonDataToCategory));
  }

  update(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiPath}/${category.id}`, category)
      .pipe(catchError(this.handleError), map(() => category));
  }

  delete(id: number): Observable<any> {
    return this.http.delete<Category>(`${this.apiPath}/${id}`)
      .pipe(catchError(this.handleError), map(() => { }));
  }

  private jsonDataToCategories(jsonData: any[]): Category[] {
    const categories: Category[] = [];

    jsonData.forEach((e) => categories.push(e as Category));
    return categories;
  }

  private jsonDataToCategory(jsonData: any): Category {
    return jsonData as Category;
  }

  private handleError(err: any): Observable<any> {
    console.log('Erro na request', err);
    err = new Error("Erro na request");
    return throwError(() => err);
  }
}
