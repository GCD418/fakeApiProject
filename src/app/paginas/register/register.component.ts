import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirigir al dashboard si ya está logueado
    if (this.authService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.pattern(/^\+?[1-9]\d{1,14}$/)]] // Opcional, formato internacional
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Validador personalizado para confirmar contraseña
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  // Getter para acceso fácil a los campos del formulario
  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';

    // Parar si el formulario es inválido
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    // Preparar datos para el backend (usar password_hash como espera tu API)
    const registerData = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      first_name: this.registerForm.value.first_name,
      last_name: this.registerForm.value.last_name,
      phone: this.registerForm.value.phone || undefined
    };

    this.authService.register(registerData)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.success = 'Usuario registrado exitosamente. Redirigiendo...';
            
            // Redirigir al dashboard después de 2 segundos
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 2000);
          } else {
            this.error = response.message || 'Error al registrar usuario';
            this.loading = false;
          }
        },
        error: (error) => {
          console.error('Error de registro:', error);
          
          // Manejar diferentes tipos de errores
          if (error.status === 400) {
            this.error = error.error?.message || 'Datos de registro inválidos';
          } else if (error.status === 409) {
            this.error = 'El email o username ya está en uso';
          } else {
            this.error = 'Error al conectar con el servidor. Intenta nuevamente.';
          }
          
          this.loading = false;
        }
      });
  }

  // Navegar al login
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Validar si un campo específico tiene errores
  hasFieldError(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || this.submitted));
  }

  // Obtener el mensaje de error para un campo específico
  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    
    if (field && field.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors['email']) {
        return 'El email debe ser válido';
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldLabel(fieldName)} no debe exceder ${field.errors['maxlength'].requiredLength} caracteres`;
      }
      if (field.errors['pattern']) {
        return 'Formato de teléfono inválido';
      }
      if (field.errors['passwordMismatch']) {
        return 'Las contraseñas no coinciden';
      }
    }
    
    return '';
  }

  // Obtener etiqueta amigable para los campos
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      username: 'Nombre de usuario',
      email: 'Email',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
      first_name: 'Nombre',
      last_name: 'Apellido',
      phone: 'Teléfono'
    };
    
    return labels[fieldName] || fieldName;
  }
}
