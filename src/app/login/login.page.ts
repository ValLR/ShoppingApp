import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { DbserviceService } from '../services/dbservice';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class LoginPage implements OnInit {

  constructor(
    private router: Router,
    private dbService: DbserviceService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {}

  async login(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const username = form.value.username;
    const password = form.value.password;
    const validLogin = await this.dbService.loginUser(username, password);

    if (validLogin) {
      localStorage.setItem('usuario', username);
      this.router.navigate(['/home']);
      form.reset();
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Acceso Denegado',
        message: 'Usuario o contraseña incorrectos.',
        buttons: ['Intentar de nuevo']
      })
      await alert.present();
    }
  }
}
