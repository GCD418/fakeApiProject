import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  tokens?: AuthTokens;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://crypto-api-idrw.onrender.com/api/auth';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Inicializar el usuario actual desde localStorage si existe
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('accessToken');
    
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser && storedToken ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Getter para obtener el valor actual del usuario
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Método para login
 login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      email: email.trim().toLowerCase(), // Normalizar email
      password: password
    };

    console.log('Enviando datos de login:', { email: body.email, password: '[HIDDEN]' });

    return this.http.post(`${this.API_URL}/login`, body, { headers });
  }

  // Método para registro
register(userData: RegisterRequest): Observable<AuthResponse> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  // Corrección: URL correcta
  return this.http.post<AuthResponse>(
    `${this.API_URL}/register`,
    userData,
    { headers }
  ).pipe(
    map(response => response),
    catchError(error => {
      console.error('Error en registro:', error);
      throw error;
    })
  );
}
  // Método para logout
  logout(): void {
    // Llamar al endpoint de logout del backend
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      this.http.post(`${this.API_URL}/api/auth/logout`, { refreshToken })
        .subscribe({
          next: () => console.log('Logout exitoso en el servidor'),
          error: (error) => console.error('Error en logout del servidor:', error)
        });
    }

    // Limpiar localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    
    // Actualizar el subject
    this.currentUserSubject.next(null);
    
    // Redirigir al login
    this.router.navigate(['/login']);
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Obtener el token de acceso
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Obtener el refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Verificar si el token ha expirado (implementación básica)
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Método para refrescar token
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      this.logout();
      throw new Error('No refresh token available');
    }

    return this.http.post<AuthResponse>(`${this.API_URL}/api/auth/refresh`, { refreshToken })
      .pipe(
        map(response => {
          if (response.success && response.tokens) {
            localStorage.setItem('accessToken', response.tokens.accessToken);
            localStorage.setItem('refreshToken', response.tokens.refreshToken);
          }
          return response;
        }),
        catchError(error => {
          console.error('Error refrescando token:', error);
          this.logout();
          throw error;
        })
      );
  }

  // Método para actualizar el perfil del usuario
  updateProfile(userData: Partial<User>): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.API_URL}/api/users/profile`, userData, { headers });
  }

  // Obtener headers con autorización
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  checkServerHealth(): Observable<any> {
  return this.http.get(`${this.API_URL}/api/health`, {
    headers: { 'Content-Type': 'application/json' }
  }).pipe(
    catchError(error => {
      console.error('Servidor no disponible:', error);
      throw error;
    })
  );
}
}
