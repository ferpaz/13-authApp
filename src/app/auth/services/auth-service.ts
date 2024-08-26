import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.backendBaseUrl;

  private http = inject(HttpClient);

  // Se van a usar señales para guardar el usuario actual gestionado por el servicio
  private _currentUser = signal<User | null>(null);

  // igual con un Signal se va a mantener el estado de autenticación
  private _autStatus = signal<AuthStatus>(AuthStatus.checking);

  constructor() {
    // Se va a chequear el estado de autenticación al inicializar el servicio
    this.checkAuthStatus().subscribe();
   }

  /// Getter computado para obtener el usuario autenticado
  public currentUser = computed(() => this._currentUser());

  /// Getter computado para obtener el estado de autenticación
  public authStatus = computed(() => this._autStatus());

  /// Método para hacer login
  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body)
      .pipe(
        // Si no hay error se guarda el usuario y el token en el servicio
        map(({ user, token }) => this.handleSuccess(user, token)),

        // En caso de error se reenvia el error
        catchError((err) => this.handleError(err))
      );
  }

  /// Método para hacer logout
  logout() {
    this._currentUser.set(null);
    this._autStatus.set(AuthStatus.notAuthenticated);

    localStorage.removeItem('token');
  }

  // Método para validar el estado de la autenticación
  checkAuthStatus() : Observable<boolean> {
    // Si no hay token se inicializacion las señales y se retorna false
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }

    // Si hay token se hace una petición al backend para validar el token
    const url = `${this.baseUrl}/auth/refresh-token`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(url, { headers })
      .pipe(
        // Si no hay error se guarda el usuario y el token en el servicio
        map(({ user, token }) => this.handleSuccess(user, token)),

        //En este caso cualquier error retorna false para redireccionarlo al login
        catchError(() => {
          this._currentUser.set(null);
          this._autStatus.set(AuthStatus.notAuthenticated);

          return of(false);
        })
      );
  }

  private handleSuccess(user: User, token: string) : boolean {
    this._currentUser.set(user);
    this._autStatus.set(AuthStatus.authenticated);

    localStorage.setItem('token', token);
    return true;
  }

  private handleError(err: any): Observable<never> {
    this._currentUser.set(null);
    this._autStatus.set(AuthStatus.notAuthenticated);

    // chequea si el error es un arreglo de errores y si es así devuelve el primer error
    if (Array.isArray(err.error.message)) {
      return throwError(() => err.error.message[0]);
    }
    return throwError(() => err.error.message);
  }
}
