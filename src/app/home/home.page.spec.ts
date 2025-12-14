import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HomePage } from './home.page';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DbserviceService } from '../services/dbservice';
import { of } from 'rxjs';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const dbServiceSpy = jasmine.createSpyObj('DbserviceService', ['dbState', 'fetchShoppingLists', 'addList', 'deleteList']);

  beforeEach(waitForAsync(() => {
    dbServiceSpy.dbState.and.returnValue(of(true));
    dbServiceSpy.fetchShoppingLists.and.returnValue(of([]));

    TestBed.configureTestingModule({
      declarations: [ HomePage ],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: DbserviceService, useValue: dbServiceSpy }
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
