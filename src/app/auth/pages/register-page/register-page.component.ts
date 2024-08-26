import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth-service';

import Swal from 'sweetalert2';

@Component({
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  private authService = inject ( AuthService );

  private fb = inject( FormBuilder )

  public myForm: FormGroup = this.fb.group({
    name: ['Justo Rufino Barrios', [Validators.required, Validators.minLength(3)]],
    email: ['jrbarrios@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['123456', [Validators.compose(
      [
        Validators.required,
        Validators.minLength(6),
        (control) => control.value === this.myForm?.get('password')?.value ? null : { notEqual: true }
      ]
    )]]
  });

  public register() {
    const { name, email, password} = this.myForm.value;

    this.authService.register(name, email, password)
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
