import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormField, form, required, schema, submit } from '@angular/forms/signals';
import { AuthService } from '../../../../core/auth/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UiButton } from '../../../../shared/components/button/button';
import { UiFormError } from '../../../../shared/components/form-error/form-error';

interface LoginFormModel {
  username: string;
  password: string;
}

const loginSchema = schema<LoginFormModel>((path) => {
  required(path.username, { message: 'El usuario es obligatorio.' });
  required(path.password, { message: 'La contraseña es obligatoria.' });
});

@Component({
  selector: 'login-page',
  imports: [FormField, UiButton, UiFormError],
  templateUrl: './login.page.html',
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly returnUrl = input<string>('/eventos');

  protected readonly loggingIn = signal(false);
  protected readonly model = signal<LoginFormModel>({ username: '', password: '' });
  protected readonly form = form(this.model, loginSchema);

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    void submit(this.form, async (field) => {
      const value = field().value();
      this.loggingIn.set(true);
      this.authService.login(value).subscribe({
        next: () => {
          this.loggingIn.set(false);
          this.notificationService.show('Sesión iniciada correctamente.', 'success');
          this.router.navigateByUrl(this.returnUrl());
        },
        error: () => this.loggingIn.set(false),
      });
      return undefined;
    });
  }
}
