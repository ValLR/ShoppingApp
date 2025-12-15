import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { DbserviceService } from '../services/dbservice';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {

  registroForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private dbService: DbserviceService,
    private toastCtrl: ToastController,
    private platform: Platform
  ) {
    this.registroForm = this.fb.group({
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      region: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  async register() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return alert('Por favor completa todos los campos requeridos');
    }

    const { usuario, password, confirmPassword } = this.registroForm.value;

    if (password !== confirmPassword) {
      return alert('Las contraseñas no coinciden');
    }

    if (!this.platform.is('hybrid')) {
        console.log('Modo Web detectado: Simulando registro exitoso');
        this.presentToast("Usuario registrado correctamente");
        this.router.navigate(['/login']);
        return; 
    }

    try {
      await this.dbService.registerUser(usuario, password);
      this.presentToast("Usuario registrado correctamente");
      this.router.navigate(['/login']);
    } catch (error) {
      console.error(error);
      this.presentToast("Error real al registrar en BD");
    }
  }

  async presentToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }
}
