import { BaseValidator, ValidationResult, ValidationStrategy } from './base.validator.js';

export interface UserInput {
  email?: string;
  password?: string;
  name?: string;
}

export class EmailValidator extends BaseValidator<string> implements ValidationStrategy<string> {
  validate(email: string): ValidationResult {
    this.clearErrors();

    if (!email || email.trim() === '') {
      this.addError('email', 'Email is required', 'MISSING_EMAIL');
      return this.getResult();
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.addError('email', 'Invalid email format', 'INVALID_EMAIL');
    }

    return this.getResult();
  }
}

export class PasswordValidator extends BaseValidator<string> implements ValidationStrategy<string> {
  validate(password: string): ValidationResult {
    this.clearErrors();

    if (!password || password.trim() === '') {
      this.addError('password', 'Password is required', 'MISSING_PASSWORD');
      return this.getResult();
    }

    if (password.length < 8) {
      this.addError('password', 'Password must be at least 8 characters long', 'PASSWORD_TOO_SHORT');
    }

    if (password.length > 128) {
      this.addError('password', 'Password must not exceed 128 characters', 'PASSWORD_TOO_LONG');
    }

    return this.getResult();
  }
}

export class NameValidator extends BaseValidator<string> implements ValidationStrategy<string> {
  validate(name: string): ValidationResult {
    this.clearErrors();

    if (!name || name.trim() === '') {
      this.addError('name', 'Name is required', 'MISSING_NAME');
      return this.getResult();
    }

    if (name.trim().length < 2) {
      this.addError('name', 'Name must be at least 2 characters long', 'NAME_TOO_SHORT');
    }

    if (name.trim().length > 100) {
      this.addError('name', 'Name must not exceed 100 characters', 'NAME_TOO_LONG');
    }

    return this.getResult();
  }
}

export class UserValidator extends BaseValidator<UserInput> implements ValidationStrategy<UserInput> {
  private emailValidator: EmailValidator;
  private passwordValidator: PasswordValidator;
  private nameValidator: NameValidator;

  constructor() {
    super();
    this.emailValidator = new EmailValidator();
    this.passwordValidator = new PasswordValidator();
    this.nameValidator = new NameValidator();
  }

  validate(data: UserInput): ValidationResult {
    this.clearErrors();

    if (data.email !== undefined) {
      const emailResult = this.emailValidator.validate(data.email);
      if (!emailResult.isValid) {
        emailResult.errors.forEach((error) => {
          this.addError(error.field, error.message, error.code);
        });
      }
    }

    if (data.password !== undefined) {
      const passwordResult = this.passwordValidator.validate(data.password);
      if (!passwordResult.isValid) {
        passwordResult.errors.forEach((error) => {
          this.addError(error.field, error.message, error.code);
        });
      }
    }

    if (data.name !== undefined) {
      const nameResult = this.nameValidator.validate(data.name);
      if (!nameResult.isValid) {
        nameResult.errors.forEach((error) => {
          this.addError(error.field, error.message, error.code);
        });
      }
    }

    return this.getResult();
  }
}
