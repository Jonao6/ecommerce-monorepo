import { describe, it, expect } from 'vitest';
import { BaseValidator, CompositeValidator } from '../base.validator.js';
import { OrderValidator, OrderItemValidator } from '../order.validator.js';
import { EmailValidator, PasswordValidator, NameValidator, UserValidator } from '../user.validator.js';
import { ProductValidator } from '../product.validator.js';

describe('BaseValidator', () => {
  it('should start with no errors', () => {
    const validator = new (class extends BaseValidator<string> {
      validate(data: string) {
        return this.getResult();
      }
    })();

    expect(validator.validate('test').isValid).toBe(true);
    expect(validator.validate('test').errors).toHaveLength(0);
  });

  it('should collect errors', () => {
    const validator = new (class extends BaseValidator<string> {
      validate(data: string) {
        if (!data) {
          this.addError('field', 'Field is required', 'REQUIRED');
        }
        return this.getResult();
      }
    })();

    const result = validator.validate('');
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe('field');
    expect(result.errors[0].message).toBe('Field is required');
  });
});

describe('CompositeValidator', () => {
  it('should combine results from multiple validators', () => {
    const validator1 = new (class extends BaseValidator<string> {
      validate(data: string) {
        if (data.length < 3) {
          this.addError('length', 'Too short', 'TOO_SHORT');
        }
        return this.getResult();
      }
    })();

    const validator2 = new (class extends BaseValidator<string> {
      validate(data: string) {
        if (!data.includes('@')) {
          this.addError('format', 'Must contain @', 'INVALID_FORMAT');
        }
        return this.getResult();
      }
    })();

    const composite = new CompositeValidator<string>();
    composite.add(validator1);
    composite.add(validator2);

    const result = composite.validate('ab');
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(2);
  });
});

describe('OrderValidator', () => {
  it('should validate empty order items', () => {
    const validator = new OrderValidator();
    const result = validator.validate({ items: [] });
    
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.code === 'EMPTY_ORDER')).toBe(true);
  });

  it('should validate order with valid items', () => {
    const validator = new OrderValidator();
    const result = validator.validate({
      items: [{ productId: 'prod1', quantity: 2 }],
    });
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject order with more than 50 items', () => {
    const validator = new OrderValidator();
    const items = Array.from({ length: 51 }, (_, i) => ({
      productId: `prod${i}`,
      quantity: 1,
    }));
    
    const result = validator.validate({ items });
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.code === 'ORDER_TOO_LARGE')).toBe(true);
  });
});

describe('OrderItemValidator', () => {
  it('should validate item with missing productId', () => {
    const validator = new OrderItemValidator();
    const result = validator.validate({ quantity: 1 });
    
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.code === 'MISSING_PRODUCT_ID')).toBe(true);
  });

  it('should validate item with invalid quantity', () => {
    const validator = new OrderItemValidator();
    const result = validator.validate({ productId: 'prod1', quantity: -1 });
    
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.code === 'INVALID_QUANTITY')).toBe(true);
  });

  it('should validate item with quantity exceeding 1000', () => {
    const validator = new OrderItemValidator();
    const result = validator.validate({ productId: 'prod1', quantity: 1001 });
    
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.code === 'QUANTITY_TOO_LARGE')).toBe(true);
  });
});

describe('EmailValidator', () => {
  it('should validate correct email', () => {
    const validator = new EmailValidator();
    const result = validator.validate('test@example.com');
    
    expect(result.isValid).toBe(true);
  });

  it('should reject invalid email', () => {
    const validator = new EmailValidator();
    const result = validator.validate('invalid-email');
    
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.code === 'INVALID_EMAIL')).toBe(true);
  });

  it('should reject empty email', () => {
    const validator = new EmailValidator();
    const result = validator.validate('');
    
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.code === 'MISSING_EMAIL')).toBe(true);
  });
});

describe('PasswordValidator', () => {
  it('should validate password with 8+ characters', () => {
    const validator = new PasswordValidator();
    const result = validator.validate('password123');
    
    expect(result.isValid).toBe(true);
  });

  it('should reject password with less than 8 characters', () => {
    const validator = new PasswordValidator();
    const result = validator.validate('short');
    
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.code === 'PASSWORD_TOO_SHORT')).toBe(true);
  });
});

describe('NameValidator', () => {
  it('should validate name with 2+ characters', () => {
    const validator = new NameValidator();
    const result = validator.validate('John');
    
    expect(result.isValid).toBe(true);
  });

  it('should reject name with less than 2 characters', () => {
    const validator = new NameValidator();
    const result = validator.validate('J');
    
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.code === 'NAME_TOO_SHORT')).toBe(true);
  });
});

describe('ProductValidator', () => {
  it('should validate valid product', () => {
    const validator = new ProductValidator();
    const result = validator.validate({
      name: 'Nike Air Max',
      price: 299.99,
      categoryId: '1',
    });
    
    expect(result.isValid).toBe(true);
  });

  it('should reject product with missing name', () => {
    const validator = new ProductValidator();
    const result = validator.validate({
      price: 299.99,
      categoryId: '1',
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.code === 'MISSING_NAME')).toBe(true);
  });

  it('should reject product with negative price', () => {
    const validator = new ProductValidator();
    const result = validator.validate({
      name: 'Nike Air Max',
      price: -50,
      categoryId: '1',
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.code === 'INVALID_PRICE')).toBe(true);
  });

  it('should reject product with missing category', () => {
    const validator = new ProductValidator();
    const result = validator.validate({
      name: 'Nike Air Max',
      price: 299.99,
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.code === 'MISSING_CATEGORY')).toBe(true);
  });
});
