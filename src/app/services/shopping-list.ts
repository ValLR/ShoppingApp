import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShoppingList, ShoppingItem } from '../models/shopping.models';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  
  private apiURL = 'https://692c7d16c829d464006fb59f.mockapi.io/api/v1/lists';

  constructor(private http: HttpClient) { }

  getLists(): Observable<ShoppingList[]> {
    return this.http.get<ShoppingList[]>(this.apiURL);
  }

  getList(id: string): Observable<ShoppingList> {
    return this.http.get<ShoppingList>(`${this.apiURL}/${id}`);
  }

  createList(list: any): Observable<ShoppingList> {
    return this.http.post<ShoppingList>(this.apiURL, list);
  }

  updateList(id: string, list: any): Observable<ShoppingList> {
    return this.http.put<ShoppingList>(`${this.apiURL}/${id}`, list);
  }

  deleteList(id: string): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }
}
