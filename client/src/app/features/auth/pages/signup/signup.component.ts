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
import { PasswordConfirmationValidator } from "../../../../shared/validators/passwordConfirmationValidator";
import { AuthLayoutComponent } from "../../../../core/layouts/auth-layout/auth-layout.component";
import { AuthService } from "../../auth.service";
import { AuthRole, RegisterUserRequest } from "../../auth.domain";

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    AuthLayoutComponent,
  ],
  templateUrl: "./signup.component.html",
})
export class SignupComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  signupForm!: FormGroup;
  isSubmitting = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.signupForm = this.fb.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      passwords: this.fb.group(
        {
          password: ["", [Validators.required, Validators.minLength(8)]],
          confirmPassword: ["", [Validators.required]],
        },
        { validators: PasswordConfirmationValidator.passwordMatchValidator },
      ),
      terms: [false, [Validators.requiredTrue]],
    });
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const request: RegisterUserRequest = {
      firstName: this.signupForm.get("firstName")?.value,
      lastName: this.signupForm.get("lastName")?.value,
      email: this.signupForm.get("email")?.value,
      password: this.signupForm.get("passwords.password")?.value,
      role: AuthRole.ORGANIZER,
    };

    console.log("Form submitted:", request);
    this.authService
      .registerNewUser(request)
      .subscribe((data) => console.log(data));
    this.isSubmitting = false;
    this.signupForm.reset();
  }

  get firstNameControl(): FormControl {
    return this.signupForm.get("firstName") as FormControl;
  }

  get lastNameControl(): FormControl {
    return this.signupForm.get("lastName") as FormControl;
  }

  get emailControl(): FormControl {
    return this.signupForm.get("email") as FormControl;
  }

  get passwordControl(): FormControl {
    return this.signupForm.get("passwords.password") as FormControl;
  }

  get confirmPasswordControl(): FormControl {
    return this.signupForm.get("passwords.confirmPassword") as FormControl;
  }

  get termsControl(): FormControl {
    return this.signupForm.get("terms") as FormControl;
  }

  get passwordsGroup(): FormGroup {
    return this.signupForm.get("passwords") as FormGroup;
  }
}
