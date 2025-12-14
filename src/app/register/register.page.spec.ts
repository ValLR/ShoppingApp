import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { IonicModule, NavController } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DbserviceService } from '../services/dbservice';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;

  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const dbServiceSpy = jasmine.createSpyObj('DbserviceService', ['registerUser']);
  const navCtrlSpy = jasmine.createSpyObj('NavController', ['navigateForward']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterPage ],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: DbserviceService, useValue: dbServiceSpy },
        { provide: NavController, useValue: navCtrlSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
