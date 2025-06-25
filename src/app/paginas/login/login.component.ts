import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;
  error = '';


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirigir al dashboard si ya está logueado
    if (this.authService.currentUserValue) {
      this.router.navigate(['/precios']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    // Obtener la URL de retorno de los parámetros de la consulta o usar '/precios' por defecto
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/precios';
  }

  // Getter para acceso fácil a los campos del formulario
  get f() { return this.loginForm.controls; }

  onLogin() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    if (!email || !password) {
      console.error('Email y contraseña son requeridos');
      return;
    }

    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        // Guardar token y redirigir
        localStorage.setItem('token', response.token);
        this.router.navigate(['/precios']);
      },
      error: (error) => {
        console.error('Error de login:', error);
        // Mostrar mensaje de error al usuario
        this.error = error.error?.error || 'Error de autenticación';
      }
    });
  }
  // Navegar al registro
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}