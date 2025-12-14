import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProfilePage } from './profile.page';
import { IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DbserviceService } from '../services/dbservice';
import { of } from 'rxjs';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;

  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const dbServiceSpy = jasmine.createSpyObj('DbserviceService', ['dbState', 'fetchShoppingLists', 'getUser']);
  const navCtrlSpy = jasmine.createSpyObj('NavController', ['navigateForward']);

  beforeEach(waitForAsync(() => {
    dbServiceSpy.dbState.and.returnValue(of(true));
    dbServiceSpy.fetchShoppingLists.and.returnValue(of([]));
    dbServiceSpy.getUser.and.returnValue(Promise.resolve({ image: '' }));

    TestBed.configureTestingModule({
      declarations: [ ProfilePage ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: DbserviceService, useValue: dbServiceSpy },
        { provide: NavController, useValue: navCtrlSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
