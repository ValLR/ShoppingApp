import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { DbserviceService } from '../services/dbservice';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  constructor(
    private router: Router,
    private dbService: DbserviceService,
    private alertCtrl: AlertController,
    private platform: Platform
  ) { }

  ngOnInit() {}

  async login(form: NgForm) {
    if (form.invalid) { return; }
    
    const { username, password } = form.value;

    if (this.platform.is('hybrid')) {
        try {
            const validLogin = await this.dbService.loginUser(username, password);
            if (validLogin) {
                this.ingresar(username, form);
            } else {
                this.mostrarError();
            }
        } catch (error) {
            console.error(error);
            this.mostrarError();
        }
    } 
    else {
        console.warn('Modo Web detectado: Saltando SQLite');
        this.ingresar(username, form);
    }
  }

  ingresar(username: string, form: NgForm) {
    localStorage.setItem('usuario', username);
    this.router.navigate(['/home']);
    form.reset();
  }

  async mostrarError() {
    const alert = await this.alertCtrl.create({
      header: 'Acceso Denegado',
      message: 'Credenciales incorrectas.',
      buttons: ['OK']
    });
    await alert.present();
  }

}
