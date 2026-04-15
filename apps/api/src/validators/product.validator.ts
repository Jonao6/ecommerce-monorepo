import { BaseValidator, ValidationResult, ValidationStrategy } from './base.validator.js';

export interface ProductInput {
  name?: string;
  price?: number;
  description?: string;
  categoryId?: string;
  colors?: string[];
  sizes?: number[];
}

export class ProductValidator extends BaseValidator<ProductInput> implements ValidationStrategy<ProductInput> {
  validate(data: ProductInput): ValidationResult {
    this.clearErrors();

    if (!data.name || data.name.trim() === '') {
      this.addError('name', 'Product name is required', 'MISSING_NAME');
    } else if (data.name.trim().length > 200) {
      this.addError('name', 'Product name must not exceed 200 characters', 'NAME_TOO_LONG');
    }

    if (data.price === undefined || data.price === null) {
      this.addError('price', 'Product price is required', 'MISSING_PRICE');
    } else if (data.price < 0) {
      this.addError('price', 'Price must be positive', 'INVALID_PRICE');
    } else if (data.price > 999999.99) {
      this.addError('price', 'Price must not exceed 999999.99', 'PRICE_TOO_HIGH');
    }

    if (data.description && data.description.length > 2000) {
      this.addError('description', 'Description must not exceed 2000 characters', 'DESCRIPTION_TOO_LONG');
    }

    if (!data.categoryId) {
      this.addError('categoryId', 'Category is required', 'MISSING_CATEGORY');
    }

    if (data.colors && data.colors.length > 0) {
      const validColors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'gray', 'brown', 'pink', 'purple', 'orange'];
      data.colors.forEach((color, index) => {
        if (!validColors.includes(color.toLowerCase()) && !/^#[A-Fa-f0-9]{6}$/.test(color)) {
          this.addError(`colors[${index}]`, `Invalid color: ${color}`, 'INVALID_COLOR');
        }
      });
    }

    if (data.sizes && data.sizes.length > 0) {
      data.sizes.forEach((size, index) => {
        if (size < 20 || size > 60) {
          this.addError(`sizes[${index}]`, `Invalid size: ${size}. Must be between 20 and 60`, 'INVALID_SIZE');
        }
      });
    }

    return this.getResult();
  }
}
