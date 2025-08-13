import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Entry } from './entry.model';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class EntryService {
  private apiPath: string = environment.apiUrl+'entries';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Array<Entry>> {
    return this.http
      .get<Array<Entry>>(this.apiPath)
      .pipe(catchError(this.handleError), map(this.jsonDataToEntries));
  }

  getById(id : number) : Observable<Entry> {
    return this.http.get<Entry>(`${this.apiPath}/${id}`)
    .pipe(catchError(this.handleError), map(this.jsonDataToEntry));
  }

  create(category : Entry) : Observable<Entry> {
    return this.http.post<Entry>(this.apiPath, category)
    .pipe(catchError(this.handleError), map(this.jsonDataToEntry));
  }

  update(category : Entry) : Observable<Entry> {
    return this.http.put<Entry>(`${this.apiPath}/${category.id}`, category)
    .pipe(catchError(this.handleError), map(() => category));
  }

  delete(id :number) : Observable<any> {
    return this.http.delete<Entry>(`${this.apiPath}/${id}`)
    .pipe(catchError(this.handleError), map(() => {}));
  }

  private jsonDataToEntries(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];

    jsonData.forEach((e) => entries.push(Object.assign(new Entry(), e)));
    return entries;
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }

  private handleError(err: any): Observable<any> {
    console.log('Erro na request', err);
    err = new Error("Erro na request");
    return throwError(() => err);
  }
}
