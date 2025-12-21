import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DbserviceService } from './dbservice'; 
import { Observable, from } from 'rxjs'; 
import { tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_URL = 'https://www.themealdb.com/api/json/v1/1/categories.php';

  constructor(private http: HttpClient, private dbService: DbserviceService) { }

  getCategories(): Observable<any[]> {
    return this.http.get<any>(this.API_URL).pipe(      
      map(response => response.categories),
      
      tap(categories => {
        console.log('Conexión exitosa: Actualizando base de datos local...');
        this.dbService.saveCategories(categories);
      }),

      catchError(error => {
        console.error('Sin conexión: Cargando datos desde SQLite...', error);
        return from(this.dbService.getLocalCategories());
      })
    );
  }

  getMealsByCategory(categoryName: string): Observable<any[]> {
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`;
    
    return this.http.get<any>(url).pipe(
      map(response => response.meals),
      catchError(error => {
        console.error('Error cargando platos', error);
        return of([]);
      })
    );
  }

  getMealDetails(id: string): Observable<any> {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    return this.http.get<any>(url).pipe(
      map(response => response.meals ? response.meals[0] : null),
      catchError(error => {
        console.error('Error obteniendo detalles', error);
        return of(null);
      })
    );
  }
}
