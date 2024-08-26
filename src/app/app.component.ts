import { Component, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth/services/auth-service';
import { AuthStatus } from './auth/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'authApp';

  private authService = inject(AuthService);
  private router = inject(Router);

  public finishedAuthCheck = computed(() => this.authService.authStatus() === AuthStatus.checking ? false : true);

  public authStatusChangedEffect = effect(() => {
    switch (this.authService.authStatus()) {
      case AuthStatus.checking:
        return;

      case AuthStatus.authenticated:
        const lastUrl = localStorage.getItem('lastUrl') ?? "/dashboard";
        this.router.navigateByUrl(lastUrl);
        return;

      case AuthStatus.notAuthenticated:
        this.router.navigateByUrl('/auth/login');
        return;
    }
  });
}
