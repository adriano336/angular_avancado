import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Entry } from './entry.model';
import { Category } from '../../categories/shared/category.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  private apiPath: string = 'api/entries';

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

  create(entry : Entry) : Observable<Entry> {
    return this.http.post<Entry>(this.apiPath, entry)
    .pipe(catchError(this.handleError), map(this.jsonDataToEntry));
  }

  update(entry : Entry) : Observable<Entry> {
    return this.http.put<Entry>(`${this.apiPath}/${entry.id}`, entry)
    .pipe(catchError(this.handleError), map(() => entry));
  }

  delete(id :number) : Observable<any> {
    return this.http.delete<Entry>(`${this.apiPath}/${id}`)
    .pipe(catchError(this.handleError), map(() => {}));
  }

    private jsonDataToEntry(jsonData: any): Entry {
      return jsonData as Entry;
    }

    private handleError(err: any): Observable<any> {
      console.log('Erro na request', err);
      err = new Error("Erro na request");
      return throwError(() => err);
    }

     private jsonDataToEntries(jsonData: any[]): Entry[] {
    const categories: Entry[] = [];

    jsonData.forEach((e) => categories.push(e as Entry));
    return categories;
  }
}
