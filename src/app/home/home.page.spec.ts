import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HomePage } from './home.page';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DbserviceService } from '../services/dbservice';
import { ApiService } from '../services/api.service';
import { of } from 'rxjs';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const dbServiceSpy = jasmine.createSpyObj('DbserviceService', ['dbState', 'fetchShoppingLists', 'addList', 'deleteList']);
  const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getCategories', 'getMealsByCategory', 'getMealDetails']);

  beforeEach(waitForAsync(() => {
    dbServiceSpy.dbState.and.returnValue(of(true));
    dbServiceSpy.fetchShoppingLists.and.returnValue(of([]));
    apiServiceSpy.getCategories.and.returnValue(of([])); 

    TestBed.configureTestingModule({
      declarations: [ HomePage ],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: DbserviceService, useValue: dbServiceSpy },
        { provide: ApiService, useValue: apiServiceSpy } 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
