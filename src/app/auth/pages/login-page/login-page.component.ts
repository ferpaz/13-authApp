import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth-service';

import Swal from 'sweetalert2';

@Component({
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  private authService = inject( AuthService );

  private fb = inject( FormBuilder )

  public myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  public login() {
    const { email, password} = this.myForm.value;

    this.authService.login(email, password)
      .subscribe({
        //   No se necesita procesar el NEXT porque las rutas y los guards harán la redirección cuando
        //   el login termina bien ya que actúan en base a los Signals
        // next: () => {},
        error: (errMessage) => {
          Swal.fire(errMessage);
        }
      });
  }
}
