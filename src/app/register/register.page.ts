import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterModule]
})
export class RegisterPage implements OnInit {

  registroForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {
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

  register() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return alert('Por favor completa todos los campos requeridos');
    }

    const { password, confirmPassword } = this.registroForm.value;

    if (password !== confirmPassword) {
      return alert('Las contraseñas no coinciden');
    }

    console.log('Datos válidos:', this.registroForm.value);
    this.router.navigate(['/login']);
  }
}
