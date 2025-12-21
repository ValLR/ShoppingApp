/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DbserviceService } from './dbservice';
import { of } from 'rxjs';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let dbServiceSpy: jasmine.SpyObj<DbserviceService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('DbserviceService', ['saveCategories', 'getLocalCategories']);

    TestBed.configureTestingModule({
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DbserviceService, useValue: spy }
      ]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    dbServiceSpy = TestBed.inject(DbserviceService) as jasmine.SpyObj<DbserviceService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe retornar categorías desde la API (Modo Online)', () => {
    const dummyCategories = [
      { idCategory: '1', strCategory: 'Beef' },
      { idCategory: '2', strCategory: 'Chicken' }
    ];

    service.getCategories().subscribe(categories => {
      expect(categories.length).toBe(2);
      expect(categories).toEqual(dummyCategories);
    });

    const req = httpMock.expectOne('https://www.themealdb.com/api/json/v1/1/categories.php');
    expect(req.request.method).toBe('GET');
    req.flush({ categories: dummyCategories });
  });
});
