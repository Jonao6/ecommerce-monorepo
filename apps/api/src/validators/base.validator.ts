export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationStrategy<T> {
  validate(data: T): ValidationResult;
}

export abstract class BaseValidator<T> {
  protected errors: ValidationError[] = [];

  abstract validate(data: T): ValidationResult;

  protected addError(field: string, message: string, code: string): void {
    this.errors.push({ field, message, code });
  }

  protected clearErrors(): void {
    this.errors = [];
  }

  protected isValid(): boolean {
    return this.errors.length === 0;
  }

  protected getResult(): ValidationResult {
    return {
      isValid: this.errors.length === 0,
      errors: [...this.errors],
    };
  }
}

export class CompositeValidator<T> {
  private validators: ValidationStrategy<T>[] = [];

  add(validator: ValidationStrategy<T>): this {
    this.validators.push(validator);
    return this;
  }

  validate(data: T): ValidationResult {
    const allErrors: ValidationError[] = [];

    for (const validator of this.validators) {
      const result = validator.validate(data);
      allErrors.push(...result.errors);
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
    };
  }
}
