import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  private fb = inject( FormBuilder )

  public myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.compose(
      [
        Validators.required,
        Validators.minLength(6),
        (control) => control.value === this.myForm?.get('password')?.value ? null : { notEqual: true }
      ]
    )]]
  });

  public register() {
    console.log(this.myForm.value);
  }
}
