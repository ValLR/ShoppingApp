import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiURL = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) { }

  getLists(): Observable<any> {
    return this.http.get(this.apiURL);
  }

  getList(id: string): Observable<any> {
    return this.http.get(this.apiURL + '/' + id);
  }

  createList(data: any): Observable<any> {
    return this.http.post(this.apiURL, data);
  }

  updateList(id: string, data: any): Observable<any> {
    return this.http.put(this.apiURL + '/' + id, data);
  }

  deleteList(id: string): Observable<any> {
    return this.http.delete(this.apiURL + '/' + id);
  }
}
