import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { IonicModule, AlertController, NavController, Platform } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DbserviceService } from '../services/dbservice';
import { of } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  
  // Mocks
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const dbServiceSpy = jasmine.createSpyObj('DbserviceService', ['loginUser', 'dbState']);
  const alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
  const navCtrlSpy = jasmine.createSpyObj('NavController', ['navigateForward', 'navigateRoot', 'back']);
  const platformSpy = jasmine.createSpyObj('Platform', ['is']);

  beforeEach(waitForAsync(() => {
    // Configuraciones por defecto
    dbServiceSpy.dbState.and.returnValue(of(true));     
    dbServiceSpy.loginUser.and.returnValue(Promise.resolve(true));
    platformSpy.is.and.returnValue(false); // Por defecto es Web

    TestBed.configureTestingModule({
      declarations: [ LoginPage ], 
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: DbserviceService, useValue: dbServiceSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: NavController, useValue: navCtrlSpy },
        { provide: Platform, useValue: platformSpy } // <--- ¡ESTA LÍNEA FALTABA!
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the login page', () => {
    expect(component).toBeTruthy();
  });

  it('should have a login method', () => {
    expect(component.login).toBeDefined();
  });

  it('should call dbService.loginUser when login is executed', async () => {
    // Preparamos el escenario: "Soy un celular"
    platformSpy.is.and.returnValue(true);
    
    const fakeForm = {
      invalid: false,
      value: { username: 'testuser', password: '123' },
      reset: () => {}
    } as any;

    await component.login(fakeForm);

    // Ahora sí debería llamar a la BD porque Platform dice "true"
    expect(dbServiceSpy.loginUser).toHaveBeenCalledWith('testuser', '123');
  });
});
