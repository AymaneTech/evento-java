import { Component, inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FormFieldComponent } from "../../components/form-field/form-field.component";
import { AuthLayoutComponent } from "../../../../core/layouts/auth-layout/auth-layout.component";
import { AuthService } from "../../auth.service";
import { LoginUserRequest } from "../../auth.domain";

@Component({
  selector: "app-login",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    AuthLayoutComponent,
  ],
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  loginForm!: FormGroup;
  isSubmitting = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const request: LoginUserRequest = {
      email: this.loginForm.get("email")?.value,
      password: this.loginForm.get("password")?.value,
    };

    console.log("Form submitted:", request);
    this.authService.loginUser(request).subscribe((data) => console.log(data));
    this.isSubmitting = false;
    this.loginForm.reset();
  }

  get emailControl(): FormControl {
    return this.loginForm.get("email") as FormControl;
  }

  get passwordControl(): FormControl {
    return this.loginForm.get("password") as FormControl;
  }
}
