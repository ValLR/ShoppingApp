import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ListViewPage } from './list-view.page';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DbserviceService } from '../services/dbservice';
import { of } from 'rxjs';

describe('ListViewPage', () => {
  let component: ListViewPage;
  let fixture: ComponentFixture<ListViewPage>;

  const dbServiceSpy = jasmine.createSpyObj('DbserviceService', ['dbState', 'fetchShoppingLists', 'updateList']);

  beforeEach(waitForAsync(() => {
    dbServiceSpy.dbState.and.returnValue(of(true));
    dbServiceSpy.fetchShoppingLists.and.returnValue(of([]));

    TestBed.configureTestingModule({
      declarations: [ ListViewPage ],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: DbserviceService, useValue: dbServiceSpy },
        { 
          provide: ActivatedRoute, 
          useValue: { 
            snapshot: { 
              paramMap: { get: (key: string) => '123' } 
            } 
          } 
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
