import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    const usuario = localStorage.getItem('usuario');

    if (usuario) {
      this.router.navigate(['/home']);
    }
  }
}